import { createClient } from "@supabase/supabase-js";

import { hasWorkspaceSupabaseEnv } from "./env";
import { normalizeResearchProfile } from "./normalize";
import type { ResearchProfile, RevisionRecord } from "./types";

interface ReviewAuditEventWrite {
  action: string;
  actorName: string;
  actorRole?: string;
  actorUserId: string;
  comment: string | null;
  nextStatus: string;
  profileId: string;
  researcherId: string;
  timestamp: string;
}

function getSupabaseClient() {
  if (!hasWorkspaceSupabaseEnv()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export async function writeWorkspaceDraftToSupabase(profile: ResearchProfile) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  await supabase.from("profile_drafts").upsert({
    profile_id: profile.id,
    researcher_id: profile.researcherId,
    status: profile.status,
    payload: profile,
    updated_at: profile.updatedAt,
  });
}

export async function writeWorkspaceRevisionToSupabase(revision: RevisionRecord) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  await supabase.from("profile_revisions").insert({
    id: revision.id,
    profile_id: revision.profileId,
    researcher_id: revision.researcherId,
    status: revision.status,
    summary: revision.summary,
    saved_at: revision.savedAt,
  });
}

export async function readWorkspaceRevisionsFromSupabase(profileId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profile_revisions")
    .select("id, profile_id, researcher_id, status, summary, saved_at")
    .eq("profile_id", profileId)
    .order("saved_at", { ascending: false })
    .limit(20);

  if (error) {
    return null;
  }

  return (
    data?.map((item) => ({
      id: item.id,
      profileId: item.profile_id,
      researcherId: item.researcher_id,
      savedAt: item.saved_at,
      status: item.status,
      summary: item.summary,
    })) ?? []
  );
}

export async function readProfilesPendingReviewFromSupabase() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profile_drafts")
    .select("profile_id, payload, researcher_id, status, updated_at")
    .in("status", ["in_review", "needs_revision", "talent_review", "talent_approved", "approved"])
    .order("updated_at", { ascending: true });

  if (error) {
    return [];
  }

  return (
    data
      ?.map((item) => {
        const payload =
          item.payload && typeof item.payload === "object"
            ? (item.payload as ResearchProfile)
            : null;

        if (!payload) {
          return null;
        }

        return normalizeResearchProfile({
          ...payload,
          id: item.profile_id,
          researcherId: item.researcher_id,
          status: item.status,
          updatedAt: item.updated_at,
        });
      })
      .filter((item): item is ResearchProfile => item !== null) ?? []
  );
}

export async function readAllProfilesFromSupabase() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profile_drafts")
    .select("profile_id, payload, researcher_id, status, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return (
    data
      ?.map((item) => {
        const payload =
          item.payload && typeof item.payload === "object"
            ? (item.payload as ResearchProfile)
            : null;

        if (!payload) {
          return null;
        }

        return normalizeResearchProfile({
          ...payload,
          id: item.profile_id,
          researcherId: item.researcher_id,
          status: item.status,
          updatedAt: item.updated_at,
        });
      })
      .filter((item): item is ResearchProfile => item !== null) ?? []
  );
}

export async function readReviewAuditTrailFromSupabase(profileId: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profile_review_events")
    .select(
      "id, action, actor_name, actor_user_id, comment, next_status, profile_id, researcher_id, timestamp",
    )
    .eq("profile_id", profileId)
    .order("timestamp", { ascending: false });

  if (error) {
    return [];
  }

  return (
    data?.map((item) => ({
      id: item.id,
      action: item.action,
      actorName: item.actor_name,
      actorRole:
        item.action === "submitted"
          ? "researcher"
          : item.action?.startsWith?.("talent")
            ? "talent"
            : "editor",
      actorUserId: item.actor_user_id,
      comment: item.comment,
      nextStatus: item.next_status,
      profileId: item.profile_id,
      researcherId: item.researcher_id,
      timestamp: item.timestamp,
    })) ?? []
  );
}

export async function writeReviewAuditEventToSupabase(event: ReviewAuditEventWrite) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  await supabase.from("profile_review_events").insert({
    action: event.action,
    actor_name: event.actorName,
    actor_user_id: event.actorUserId,
    comment: event.comment,
    next_status: event.nextStatus,
    profile_id: event.profileId,
    researcher_id: event.researcherId,
    timestamp: event.timestamp,
  });
}
