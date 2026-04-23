import { NextResponse } from "next/server";

import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { listWorkspaceProfiles } from "@/apps/core/workspace/repository";

export async function GET() {
  const access = await requireResearcherAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profiles = await listWorkspaceProfiles(access.researcherId);
  return NextResponse.json({ profiles });
}
