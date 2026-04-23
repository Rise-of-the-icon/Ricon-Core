import type { User } from "@supabase/supabase-js";

import { createSeedProfile } from "./constants";
import { applyLifecycleState } from "./lifecycle";
import type { ReviewAuditEvent } from "@/apps/core/review/types";
import type {
  ProfileStatus,
  ResearchProfile,
  RevisionRecord,
  WorkspacePayload,
} from "./types";

// Back the stores with globalThis so they survive Next dev HMR reloads
// and module re-evaluation across API route + RSC render boundaries.
const globalKey = "__riconWorkspaceMockStore__" as const;
type Store = {
  profiles: Map<string, ResearchProfile>;
  revisions: Map<string, RevisionRecord[]>;
  reviewEvents: Map<string, ReviewAuditEvent[]>;
};
const globalRef = globalThis as unknown as { [globalKey]?: Store };
const store: Store =
  globalRef[globalKey] ??
  (globalRef[globalKey] = {
    profiles: new Map(),
    revisions: new Map(),
    reviewEvents: new Map(),
  });
const { profiles, revisions, reviewEvents } = store;

function revisionSummary(status: ProfileStatus): string {
  if (status === "in_review") {
    return "Submitted for editorial review";
  }

  if (status === "talent_review") {
    return "Approved for talent review";
  }

  if (status === "talent_approved") {
    return "Approved by talent";
  }

  if (status === "published") {
    return "Published";
  }

  return "Draft autosave";
}

function getResearcherName(user: User | null | undefined): string | null {
  if (!user?.email) {
    return null;
  }

  const [localPart] = user.email.split("@");
  return localPart
    .split(/[._+-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function ensureProfile(profileId: string, researcherId: string, user?: User | null) {
  if (profileId !== "jason-kidd") return;
  if (!profiles.has(profileId)) {
    const profile = createSeedProfile(researcherId);
    profiles.set(profileId, {
      ...profile,
      researcherEmail: user?.email ?? profile.researcherEmail,
      researcherName: getResearcherName(user) ?? profile.researcherName,
    });
    revisions.set(profileId, []);
    reviewEvents.set(profileId, []);
  }
}

export function getMockWorkspaceState(
  profileId: string,
  researcherId: string,
  user?: User | null,
): WorkspacePayload | null {
  ensureProfile(profileId, researcherId, user);

  const profile = profiles.get(profileId);
  if (!profile) return null;

  return {
    profile,
    revisions: revisions.get(profileId) ?? [],
    persistenceMode: "mock",
    emailNotificationEnabled: false,
  };
}

export function saveMockWorkspaceState(
  profile: ResearchProfile,
  researcherId: string,
  user?: User | null,
): WorkspacePayload {
  const now = new Date().toISOString();
  const nextProfile = {
    ...profile,
    researcherId,
    researcherEmail: user?.email ?? profile.researcherEmail,
    researcherName: getResearcherName(user) ?? profile.researcherName,
    updatedAt: now,
    lastSavedAt: now,
  };
  const nextRevision: RevisionRecord = {
    id: crypto.randomUUID(),
    profileId: profile.id,
    researcherId,
    savedAt: now,
    status: nextProfile.status,
    summary: revisionSummary(nextProfile.status),
  };
  const profileRevisions = [nextRevision, ...(revisions.get(profile.id) ?? [])];

  profiles.set(profile.id, nextProfile);
  revisions.set(profile.id, profileRevisions);

  return {
    profile: nextProfile,
    revisions: profileRevisions,
    persistenceMode: "mock",
    emailNotificationEnabled: false,
  };
}

function createMockReviewProfile() {
  const profile = createSeedProfile("researcher-1");
  const submittedAt = new Date(Date.now() - 1000 * 60 * 90).toISOString();
  const nextProfile: ResearchProfile = {
    ...applyLifecycleState(profile, "in_review"),
    researcherEmail: "researcher@ricon.local",
    researcherId: "researcher-1",
    researcherName: "Marcus Proietti",
    submittedAt,
    updatedAt: submittedAt,
    lastSavedAt: submittedAt,
  };

  profiles.set(nextProfile.id, nextProfile);
  revisions.set(nextProfile.id, [
    {
      id: crypto.randomUUID(),
      profileId: nextProfile.id,
      researcherId: nextProfile.researcherId,
      savedAt: submittedAt,
      status: nextProfile.status,
      summary: "Submitted for editorial review",
    },
  ]);
  reviewEvents.set(nextProfile.id, [
    {
      id: crypto.randomUUID(),
      profileId: nextProfile.id,
      researcherId: nextProfile.researcherId,
      actorUserId: nextProfile.researcherId,
      actorName: nextProfile.researcherName ?? "Researcher",
      actorRole: "researcher",
      action: "submitted",
      timestamp: submittedAt,
      comment: null,
      nextStatus: "in_review",
    },
  ]);
}

function ensureMockReviewProfile() {
  if (profiles.size === 0) {
    createMockReviewProfile();
  }
}

export function getMockReviewProfiles() {
  ensureMockReviewProfile();

  return [...profiles.values()].filter((profile) =>
    profile.status === "in_review" ||
    profile.status === "talent_review" ||
    profile.status === "talent_approved"
  );
}

export function getAllMockProfiles() {
  ensureMockReviewProfile();
  return [...profiles.values()];
}

export function hasMockProfile(profileId: string) {
  return profiles.has(profileId);
}

export function createMockProfile(profile: ResearchProfile): ResearchProfile {
  const now = new Date().toISOString();
  const next: ResearchProfile = { ...profile, updatedAt: now, lastSavedAt: now };
  profiles.set(next.id, next);
  revisions.set(next.id, [
    {
      id: crypto.randomUUID(),
      profileId: next.id,
      researcherId: next.researcherId,
      savedAt: now,
      status: next.status,
      summary: "Onboarding created",
    },
  ]);
  reviewEvents.set(next.id, []);
  return next;
}

export function listMockDraftProfiles(researcherId: string) {
  ensureMockReviewProfile();
  return [...profiles.values()]
    .filter((p) => p.researcherId === researcherId || p.status === "draft")
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getMockReviewProfile(profileId: string) {
  ensureMockReviewProfile();

  return profiles.get(profileId) ?? null;
}

export function getMockReviewEvents(profileId: string) {
  ensureMockReviewProfile();

  return reviewEvents.get(profileId) ?? [];
}

export function recordMockReviewEvent(event: Omit<ReviewAuditEvent, "id">) {
  const nextEvent: ReviewAuditEvent = {
    ...event,
    id: crypto.randomUUID(),
  };

  reviewEvents.set(event.profileId, [
    nextEvent,
    ...(reviewEvents.get(event.profileId) ?? []),
  ]);

  return nextEvent;
}

export function updateMockReviewProfile(profile: ResearchProfile, summary: string) {
  const nextProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  };

  profiles.set(profile.id, nextProfile);
  revisions.set(profile.id, [
    {
      id: crypto.randomUUID(),
      profileId: profile.id,
      researcherId: profile.researcherId,
      savedAt: nextProfile.updatedAt,
      status: nextProfile.status,
      summary,
    },
    ...(revisions.get(profile.id) ?? []),
  ]);

  return nextProfile;
}
