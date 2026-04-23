import { NextResponse } from "next/server";

import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { searchImportCandidates } from "@/apps/core/workspace/imports";
import type { SourceCandidateProvider } from "@/apps/core/workspace/types";

export async function POST(request: Request) {
  const access = await requireResearcherAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    provider?: SourceCandidateProvider;
    query?: string;
  };

  if (body.provider !== "balldontlie" && body.provider !== "wikipedia") {
    return NextResponse.json(
      { candidates: [], error: "Choose balldontlie or Wikipedia for discovery search." },
      { status: 400 },
    );
  }

  const result = await searchImportCandidates({
    provider: body.provider,
    query: body.query ?? "",
  });

  return NextResponse.json(result, {
    status: result.error && result.candidates.length === 0 ? 400 : 200,
  });
}
