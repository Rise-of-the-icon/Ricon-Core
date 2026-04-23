import { NextResponse } from "next/server";

import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { submitWorkspacePayload } from "@/apps/core/workspace/repository";
import type { ResearchProfile } from "@/apps/core/workspace/types";

export async function POST(request: Request) {
  const access = await requireResearcherAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { profile?: ResearchProfile };

  if (!body.profile) {
    return NextResponse.json({ error: "Missing profile payload" }, { status: 400 });
  }

  try {
    const payload = await submitWorkspacePayload(
      body.profile,
      access.researcherId,
      access.user,
    );

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit profile." },
      { status: 400 },
    );
  }
}
