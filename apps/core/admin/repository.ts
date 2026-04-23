import { getServerAuthState } from "@/apps/core/auth";
import { hasWorkspaceSupabaseEnv } from "@/apps/core/workspace/env";
import { getAllMockProfiles } from "@/apps/core/workspace/mock-store";
import { readAllProfilesFromSupabase } from "@/apps/core/workspace/supabase";
import type { ProfileStatus } from "@/apps/core/workspace/types";

export type PipelineStage =
  | "draft"
  | "in_review"
  | "needs_revision"
  | "talent_review"
  | "talent_approved"
  | "published";

export interface MissionControlProfile {
  id: string;
  name: string;
  stage: PipelineStage;
  researcherName: string;
  updatedAt: string;
}

export interface PipelineStageSummary {
  stage: PipelineStage;
  label: string;
  count: number;
  isBottleneck: boolean;
}

export interface MissionControlPayload {
  profiles: MissionControlProfile[];
  stageSummaries: PipelineStageSummary[];
  totalActive: number;
}

const stageOrder: PipelineStage[] = [
  "draft",
  "in_review",
  "needs_revision",
  "talent_review",
  "talent_approved",
  "published",
];

const stageLabel: Record<PipelineStage, string> = {
  draft: "Draft",
  in_review: "In Review",
  needs_revision: "Needs Revision",
  talent_review: "Talent Review",
  talent_approved: "Talent Approved",
  published: "Published",
};

function isPipelineStage(value: ProfileStatus): value is PipelineStage {
  return (
    value === "draft" ||
    value === "in_review" ||
    value === "needs_revision" ||
    value === "talent_review" ||
    value === "talent_approved" ||
    value === "published"
  );
}

function getResearcherName(profile: {
  researcherName: string | null;
  researcherEmail: string | null;
  researcherId: string;
}) {
  if (profile.researcherName) {
    return profile.researcherName;
  }
  if (profile.researcherEmail) {
    const [localPart] = profile.researcherEmail.split("@");
    return localPart || profile.researcherId;
  }
  return profile.researcherId;
}

export async function getMissionControlPayload(): Promise<MissionControlPayload> {
  const profiles = hasWorkspaceSupabaseEnv()
    ? await readAllProfilesFromSupabase()
    : getAllMockProfiles();

  const activeProfiles = profiles
    .flatMap((profile) => {
      if (!isPipelineStage(profile.status)) {
        return [];
      }

      return [
        {
          id: profile.id,
          name: profile.name.value || "Unnamed profile",
          researcherName: getResearcherName(profile),
          stage: profile.status as PipelineStage,
          updatedAt: profile.updatedAt,
        },
      ];
    })
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());

  const counts = new Map<PipelineStage, number>(stageOrder.map((stage) => [stage, 0]));
  for (const profile of activeProfiles) {
    counts.set(profile.stage, (counts.get(profile.stage) ?? 0) + 1);
  }

  const maxCount = Math.max(...stageOrder.map((stage) => counts.get(stage) ?? 0), 0);
  const stageSummaries = stageOrder.map((stage) => {
    const count = counts.get(stage) ?? 0;
    return {
      stage,
      label: stageLabel[stage],
      count,
      isBottleneck: maxCount > 0 && count === maxCount,
    };
  });

  return {
    profiles: activeProfiles,
    stageSummaries,
    totalActive: activeProfiles.length,
  };
}

export async function requireAdminAccess() {
  const authState = await getServerAuthState();
  if (!authState.user || authState.role !== "admin") {
    return null;
  }
  return authState;
}
