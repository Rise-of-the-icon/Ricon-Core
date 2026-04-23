import { hasWorkspaceEmailEnv, hasWorkspaceSupabaseEnv } from "@/apps/core/workspace/env";
import { applyLifecycleState } from "@/apps/core/workspace/lifecycle";
import {
  getMockReviewEvents,
  getMockReviewProfile,
  getMockReviewProfiles,
  recordMockReviewEvent,
  updateMockReviewProfile,
} from "@/apps/core/workspace/mock-store";
import { writeProfileToSanity } from "@/apps/core/workspace/sanity";
import {
  readProfilesPendingReviewFromSupabase,
  readReviewAuditTrailFromSupabase,
  writeReviewAuditEventToSupabase,
  writeWorkspaceDraftToSupabase,
  writeWorkspaceRevisionToSupabase,
} from "@/apps/core/workspace/supabase";
import type {
  ProfileStatus,
  ResearchProfile,
  RevisionRecord,
} from "@/apps/core/workspace/types";

import { sendReviewDecisionNotification } from "./notifications";
import type {
  ReviewChangeDecisionInput,
  ReviewActionInput,
  ReviewAuditEvent,
  ReviewDashboardPayload,
  ReviewQueueItem,
} from "./types";

const reviewActionStatusMap: Record<
  ReviewActionInput["action"],
  ProfileStatus
> = {
  editor_approve: "talent_review",
  editor_flag_issue: "in_review",
  editor_request_changes: "needs_revision",
  editor_send_back: "needs_revision",
  publish: "published",
  talent_approve: "talent_approved",
  talent_request_changes: "needs_revision",
};

function isLiveMode() {
  return hasWorkspaceSupabaseEnv();
}

function countComplete(value: string | null | undefined) {
  return value && value.trim().length > 0 ? 1 : 0;
}

function computeCompletenessScore(profile: ResearchProfile) {
  let complete = 0;
  let total = 0;

  const registerFieldClaim = (value: string, citation: ResearchProfile["name"]["claim"]["citation"]) => {
    total += 2;
    complete += countComplete(value);
    complete +=
      countComplete(citation.url) &&
      countComplete(citation.publicationName) &&
      countComplete(citation.dateAccessed)
        ? 1
        : 0;
  };

  registerFieldClaim(profile.name.value, profile.name.claim.citation);
  registerFieldClaim(profile.dateOfBirth.value, profile.dateOfBirth.claim.citation);

  const registerStructuredRecord = (
    values: Array<string | null | undefined>,
    citation: ResearchProfile["name"]["claim"]["citation"],
  ) => {
    total += 2;
    complete += values.every((value) => countComplete(value)) ? 1 : 0;
    complete +=
      countComplete(citation.url) &&
      countComplete(citation.publicationName) &&
      countComplete(citation.dateAccessed)
        ? 1
        : 0;
  };

  profile.careerTimeline.forEach((item) => {
    registerStructuredRecord(
      [item.title, item.date, item.description],
      item.claim.citation,
    );
  });

  profile.personalHistory.forEach((item) => {
    registerStructuredRecord([item.heading, item.body], item.claim.citation);
  });

  profile.stats.forEach((item) => {
    registerStructuredRecord([item.label, item.value], item.claim.citation);
  });

  profile.media.forEach((item) => {
    registerStructuredRecord([item.kind, item.title, item.url], item.claim.citation);
  });
  profile.achievements.forEach((item) => {
    registerStructuredRecord([item.awardName, item.awardingBody, item.year], item.claim.citation);
  });
  profile.quotes.forEach((item) => {
    registerStructuredRecord([item.quoteText, item.context], item.claim.citation);
  });

  if (total === 0) {
    return 0;
  }

  return Math.round((complete / total) * 100);
}

function countProfileFields(profile: ResearchProfile) {
  return (
    2 +
    8 +
    profile.careerTimeline.length +
    profile.personalHistory.length +
    profile.stats.length +
    profile.achievements.length +
    profile.quotes.length +
    profile.media.length
  );
}

function buildResearcherName(profile: ResearchProfile) {
  if (profile.researcherName) {
    return profile.researcherName;
  }

  if (profile.researcherEmail) {
    const [localPart] = profile.researcherEmail.split("@");
    return localPart
      .split(/[._+-]/g)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  }

  return profile.researcherId;
}

function buildQueueItem(profile: ResearchProfile): ReviewQueueItem {
  return {
    completenessScore: computeCompletenessScore(profile),
    fieldCount: countProfileFields(profile),
    profileId: profile.id,
    profileName: profile.name.value,
    researcherEmail: profile.researcherEmail,
    researcherId: profile.researcherId,
    researcherName: buildResearcherName(profile),
    status: profile.status,
    submissionDate: profile.submittedAt ?? profile.updatedAt,
  };
}

function sortQueue(queue: ReviewQueueItem[]) {
  return [...queue].sort(
    (left, right) =>
      new Date(left.submissionDate).getTime() - new Date(right.submissionDate).getTime(),
  );
}

async function getQueueProfiles() {
  if (!isLiveMode()) {
    return getMockReviewProfiles();
  }

  try {
    return await readProfilesPendingReviewFromSupabase();
  } catch {
    return [];
  }
}

async function getAuditTrail(profileId: string) {
  if (!isLiveMode()) {
    return getMockReviewEvents(profileId);
  }

  try {
    return await readReviewAuditTrailFromSupabase(profileId);
  } catch {
    return [];
  }
}

export function createEmptyReviewDashboardPayload(): ReviewDashboardPayload {
  return {
    auditTrail: [],
    emailNotificationEnabled: hasWorkspaceEmailEnv(),
    persistenceMode: isLiveMode() ? "live" : "mock",
    queue: [],
    selectedProfile: null,
  };
}

export async function getReviewDashboardPayload(
  selectedProfileId?: string | null,
): Promise<ReviewDashboardPayload> {
  const queueProfiles = await getQueueProfiles();
  const queue = sortQueue(queueProfiles.map(buildQueueItem));
  const fallbackProfileId = queue[0]?.profileId ?? null;
  const resolvedProfileId = selectedProfileId ?? fallbackProfileId;
  const selectedProfile = resolvedProfileId
    ? queueProfiles.find((profile) => profile.id === resolvedProfileId) ?? null
    : null;
  const auditTrail = resolvedProfileId ? await getAuditTrail(resolvedProfileId) : [];

  return {
    auditTrail,
    emailNotificationEnabled: hasWorkspaceEmailEnv(),
    persistenceMode: isLiveMode() ? "live" : "mock",
    queue,
    selectedProfile,
  };
}

function buildAuditComment(action: ReviewActionInput["action"], comment: string | null) {
  if (comment) {
    return comment.trim();
  }

  if (action === "editor_approve" || action === "talent_approve" || action === "publish") {
    return null;
  }

  throw new Error("A comment is required for this review action.");
}

function buildRevisionSummary(action: ReviewActionInput["action"]) {
  switch (action) {
    case "editor_approve":
      return "Approved for talent review";
    case "editor_flag_issue":
      return "Issue flagged by editor";
    case "editor_request_changes":
      return "Changes requested by editor";
    case "editor_send_back":
      return "Sent back to draft by editor";
    case "talent_approve":
      return "Approved by talent";
    case "talent_request_changes":
      return "Changes requested by talent";
    case "publish":
      return "Published";
  }
}

function createRevision(profile: ResearchProfile, summary: string): RevisionRecord {
  return {
    id: crypto.randomUUID(),
    profileId: profile.id,
    researcherId: profile.researcherId,
    savedAt: profile.updatedAt,
    status: profile.status,
    summary,
  };
}

function buildAuditEvent(params: {
  action: ReviewActionInput["action"];
  actorName: string;
  actorRole: string;
  actorUserId: string;
  comment: string | null;
  nextStatus: ProfileStatus;
  profile: ResearchProfile;
}): Omit<ReviewAuditEvent, "id"> {
  return {
    action: params.action,
    actorName: params.actorName,
    actorRole: params.actorRole,
    actorUserId: params.actorUserId,
    comment: params.comment,
    nextStatus: params.nextStatus,
    profileId: params.profile.id,
    researcherId: params.profile.researcherId,
    timestamp: params.profile.updatedAt,
  };
}

async function getProfileForAction(profileId: string) {
  if (!isLiveMode()) {
    return getMockReviewProfile(profileId);
  }

  const queueProfiles = await readProfilesPendingReviewFromSupabase();
  return queueProfiles.find((profile) => profile.id === profileId) ?? null;
}

function canApplyAction(status: ProfileStatus, action: ReviewActionInput["action"]) {
  if (
    action === "editor_approve" ||
    action === "editor_flag_issue" ||
    action === "editor_request_changes" ||
    action === "editor_send_back"
  ) {
    return status === "in_review";
  }

  if (action === "publish") {
    return status === "talent_approved";
  }

  if (action === "talent_approve" || action === "talent_request_changes") {
    return status === "talent_review";
  }

  return false;
}

export async function applyReviewAction(
  input: ReviewActionInput,
  actor: { actorName: string; actorRole: string; userId: string },
) {
  const profile = await getProfileForAction(input.profileId);

  if (!profile || !canApplyAction(profile.status, input.action)) {
    throw new Error("The selected profile is not eligible for that lifecycle transition.");
  }

  const comment = buildAuditComment(input.action, input.comment ?? null);
  const now = new Date().toISOString();
  const nextStatus = reviewActionStatusMap[input.action];
  const nextProfile: ResearchProfile = {
    ...applyLifecycleState(profile, nextStatus),
    lastSavedAt: now,
    updatedAt: now,
  };
  const summary = buildRevisionSummary(input.action);
  const revision = createRevision(nextProfile, summary);
  const auditEvent = buildAuditEvent({
    action: input.action,
    actorName: actor.actorName,
    actorRole: actor.actorRole,
    actorUserId: actor.userId,
    comment,
    nextStatus,
    profile: nextProfile,
  });

  if (isLiveMode()) {
    try {
      await writeProfileToSanity(nextProfile);
      await writeWorkspaceDraftToSupabase(nextProfile);
      await writeWorkspaceRevisionToSupabase(revision);
      await writeReviewAuditEventToSupabase(auditEvent);
    } catch {
      throw new Error(
        "Review data could not be updated. Check the Supabase review tables and service credentials.",
      );
    }
  } else {
    updateMockReviewProfile(nextProfile, summary);
    recordMockReviewEvent(auditEvent);
  }

  const shouldNotifyResearcher =
    input.action === "editor_request_changes" ||
    input.action === "editor_send_back" ||
    input.action === "talent_request_changes";
  const emailTriggered = shouldNotifyResearcher
    ? await sendReviewDecisionNotification(nextProfile, input.action, comment)
    : false;

  const payload = await getReviewDashboardPayload();

  return {
    ...payload,
    emailTriggered,
  };
}

export async function applyReviewChangeDecision(
  input: ReviewChangeDecisionInput,
  actor: { actorName: string; actorRole: string; userId: string },
) {
  const profile = await getProfileForAction(input.profileId);

  if (!profile) {
    throw new Error("The selected profile could not be loaded for decision tracking.");
  }

  const now = new Date().toISOString();
  const nextProfile: ResearchProfile = {
    ...profile,
    updatedAt: now,
    lastSavedAt: now,
    changeDecisions: {
      ...(profile.changeDecisions ?? {}),
      [input.fieldId]: {
        status: input.decision,
        changedAt: now,
        changedBy: actor.userId,
        role: actor.actorRole === "talent" ? "talent" : "editor",
      },
    },
  };

  const summary = `Change ${input.decision} for ${input.fieldId} by ${actor.actorRole}`;
  const revision = createRevision(nextProfile, summary);

  if (isLiveMode()) {
    try {
      await writeProfileToSanity(nextProfile);
      await writeWorkspaceDraftToSupabase(nextProfile);
      await writeWorkspaceRevisionToSupabase(revision);
    } catch {
      throw new Error("Unable to persist change decision.");
    }
  } else {
    updateMockReviewProfile(nextProfile, summary);
  }

  return nextProfile.changeDecisions[input.fieldId];
}
