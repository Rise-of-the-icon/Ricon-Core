import { NextResponse } from "next/server";

import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { normalizeSourceCandidate } from "@/apps/core/workspace/normalize";
import { saveWorkspacePayload } from "@/apps/core/workspace/repository";
import type { ResearchProfile, SourceCandidate } from "@/apps/core/workspace/types";

function mergeCandidate(profile: ResearchProfile, candidate: SourceCandidate): ResearchProfile {
  const existing = new Set(profile.sourceCandidates.map((item) => item.id));

  return {
    ...profile,
    workflowStep: "sources",
    sourceGateStatus: candidate.status === "blocked_for_claims" ? "blocked" : "needs_review",
    sourceCandidates: existing.has(candidate.id)
      ? profile.sourceCandidates.map((item) => (item.id === candidate.id ? candidate : item))
      : [candidate, ...profile.sourceCandidates],
  };
}

export async function POST(request: Request) {
  const access = await requireResearcherAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    profile?: ResearchProfile;
    candidate?: unknown;
  };

  if (!body.profile || !body.candidate) {
    return NextResponse.json(
      { error: "Missing profile or source candidate payload." },
      { status: 400 },
    );
  }

  const candidate = normalizeSourceCandidate(body.candidate);
  const nextProfile = mergeCandidate(body.profile, candidate);
  const payload = await saveWorkspacePayload(
    nextProfile,
    access.researcherId,
    access.user,
    `Attached ${candidate.publicationName} source candidate`,
  );

  return NextResponse.json(payload);
}
