import type { User } from "@supabase/supabase-js";

import { createBlankProfile, createSeedProfile, slugify } from "./constants";
import { hasSanityEnv, hasWorkspaceEmailEnv, hasWorkspaceSupabaseEnv } from "./env";
import { applyLifecycleState } from "./lifecycle";
import {
  createMockProfile,
  getMockWorkspaceState,
  hasMockProfile,
  listMockDraftProfiles,
  recordMockReviewEvent,
  saveMockWorkspaceState,
} from "./mock-store";
import { normalizeResearchProfile } from "./normalize";
import { sendReviewSubmissionNotification } from "./notifications";
import { validateProfileVerification } from "./verification";
import { readProfileFromSanity, writeProfileToSanity } from "./sanity";
import {
  readWorkspaceRevisionsFromSupabase,
  writeReviewAuditEventToSupabase,
  writeWorkspaceDraftToSupabase,
  writeWorkspaceRevisionToSupabase,
} from "./supabase";
import type {
  ProfileStatus,
  ResearchProfile,
  RevisionRecord,
  WorkspacePayload,
} from "./types";

function getResearcherName(user: User | null | undefined): string | null {
  if (!user) {
    return null;
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  if (metadataName) {
    return metadataName;
  }

  if (typeof user.email === "string") {
    const [localPart] = user.email.split("@");
    return localPart
      .split(/[._+-]/g)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  }

  return null;
}

function applyResearcherIdentity(
  profile: ResearchProfile,
  researcherId: string,
  user?: User | null,
): ResearchProfile {
  return {
    ...profile,
    researcherId,
    researcherEmail: user?.email ?? profile.researcherEmail ?? null,
    researcherName: getResearcherName(user) ?? profile.researcherName ?? null,
  };
}

function buildRevision(
  profile: ResearchProfile,
  researcherId: string,
  status: ProfileStatus,
  summary: string,
): RevisionRecord {
  return {
    id: crypto.randomUUID(),
    profileId: profile.id,
    researcherId,
    savedAt: profile.updatedAt,
    status,
    summary,
  };
}

function isLiveMode() {
  return hasSanityEnv() || hasWorkspaceSupabaseEnv();
}

export async function getWorkspacePayload(
  profileId: string,
  researcherId: string,
  user?: User | null,
): Promise<WorkspacePayload | null> {
  if (!isLiveMode()) {
    return getMockWorkspaceState(profileId, researcherId, user);
  }

  const sanityProfile = normalizeResearchProfile(await readProfileFromSanity(profileId));
  if (!sanityProfile) {
    if (profileId === "jason-kidd") {
      const seed = createSeedProfile(researcherId);
      return {
        profile: applyResearcherIdentity(seed, researcherId, user),
        revisions: [],
        persistenceMode: "live",
        emailNotificationEnabled: hasWorkspaceEmailEnv(),
      };
    }
    return null;
  }
  const revisions = (await readWorkspaceRevisionsFromSupabase(profileId)) ?? [];

  return {
    profile: applyResearcherIdentity(sanityProfile, researcherId, user),
    revisions,
    persistenceMode: "live",
    emailNotificationEnabled: hasWorkspaceEmailEnv(),
  };
}

export async function createWorkspaceProfile(
  seed: { name: string; slug?: string },
  researcherId: string,
  user?: User | null,
): Promise<WorkspacePayload> {
  if (!seed.name.trim()) {
    throw new Error("Player name is required to begin onboarding.");
  }

  const baseSlug = (seed.slug && slugify(seed.slug)) || slugify(seed.name);
  let uniqueSlug = baseSlug || `player-${Date.now()}`;

  if (!isLiveMode()) {
    let i = 2;
    while (hasMockProfile(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${i++}`;
    }
    const blank = applyResearcherIdentity(
      createBlankProfile(researcherId, { name: seed.name, slug: uniqueSlug }),
      researcherId,
      user,
    );
    const created = createMockProfile(blank);
    return {
      profile: created,
      revisions: [],
      persistenceMode: "mock",
      emailNotificationEnabled: false,
    };
  }

  // Live mode: check sanity for collisions, then write.
  let collision = await readProfileFromSanity(uniqueSlug);
  let i = 2;
  while (collision) {
    uniqueSlug = `${baseSlug}-${i++}`;
    collision = await readProfileFromSanity(uniqueSlug);
  }

  const blank = applyResearcherIdentity(
    createBlankProfile(researcherId, { name: seed.name, slug: uniqueSlug }),
    researcherId,
    user,
  );
  return saveWorkspacePayload(blank, researcherId, user, "Onboarding created");
}

export async function listWorkspaceProfiles(
  researcherId: string,
): Promise<
  Array<{
    id: string;
    name: string;
    status: ProfileStatus;
    updatedAt: string;
    completion: number;
  }>
> {
  const summarize = (p: ResearchProfile) => {
    const core = [
      p.name,
      p.dateOfBirth,
      p.placeOfBirth,
      p.nationality,
      p.heightWeight,
      p.profileImage,
      p.biographyExcerpt,
    ];
    const identityDone = core.filter((f) => f.value.trim()).length;
    const buckets = [
      { done: identityDone, total: core.length },
      { done: Math.min(p.careerTimeline.length, 3), total: 3 },
      {
        done: Math.min(p.stats.length + p.achievements.length, 3),
        total: 3,
      },
      { done: Math.min(p.media.length, 1), total: 1 },
    ];
    const done = buckets.reduce((a, b) => a + b.done, 0);
    const total = buckets.reduce((a, b) => a + b.total, 0);
    return Math.round((done / total) * 100);
  };

  if (!isLiveMode()) {
    return listMockDraftProfiles(researcherId).map((p) => ({
      id: p.id,
      name: p.name.value || "Unnamed player",
      status: p.status,
      updatedAt: p.updatedAt,
      completion: summarize(p),
    }));
  }

  // Live mode doesn't yet index — return empty list; individual loads still work.
  return [];
}

export async function saveWorkspacePayload(
  profile: ResearchProfile,
  researcherId: string,
  user?: User | null,
  summary = "Draft autosave",
): Promise<WorkspacePayload> {
  const now = new Date().toISOString();
  const nextProfile: ResearchProfile = {
    ...applyResearcherIdentity(profile, researcherId, user),
    updatedAt: now,
    lastSavedAt: now,
  };

  if (!isLiveMode()) {
    return saveMockWorkspaceState(nextProfile, researcherId, user);
  }

  await writeProfileToSanity(nextProfile);
  await writeWorkspaceDraftToSupabase(nextProfile);

  const revision = buildRevision(nextProfile, researcherId, nextProfile.status, summary);
  await writeWorkspaceRevisionToSupabase(revision);

  const revisions = (await readWorkspaceRevisionsFromSupabase(nextProfile.id)) ?? [
    revision,
  ];

  return {
    profile: nextProfile,
    revisions,
    persistenceMode: "live",
    emailNotificationEnabled: hasWorkspaceEmailEnv(),
  };
}

export async function submitWorkspacePayload(
  profile: ResearchProfile,
  researcherId: string,
  user?: User | null,
) {
  const verification = validateProfileVerification(profile);
  if (!verification.isValidForSubmission) {
    throw new Error("Insufficient verification: every claim requires at least 2 sources before submission.");
  }

  const now = new Date().toISOString();
  const nextProfile: ResearchProfile = {
    ...applyLifecycleState(applyResearcherIdentity(profile, researcherId, user), "in_review"),
    submittedAt: now,
    updatedAt: now,
  };
  const payload = await saveWorkspacePayload(
    nextProfile,
    researcherId,
    user,
    "Submitted for editorial review",
  );
  const actorName = getResearcherName(user) ?? payload.profile.researcherName ?? "Researcher";

  const reviewEvent = {
    action: "submitted",
    actorName,
    actorRole: "researcher",
    actorUserId: user?.id ?? researcherId,
    comment: null,
    nextStatus: payload.profile.status,
    profileId: payload.profile.id,
    researcherId,
    timestamp: payload.profile.submittedAt ?? payload.profile.updatedAt,
  } as const;

  if (isLiveMode()) {
    await writeReviewAuditEventToSupabase(reviewEvent);
  } else {
    recordMockReviewEvent(reviewEvent);
  }

  const emailTriggered = await sendReviewSubmissionNotification(payload.profile);

  return {
    ...payload,
    emailTriggered,
  };
}
