import { NextResponse } from "next/server";

import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { lookupPlayer } from "@/apps/core/workspace/playerLookup";

export async function GET(request: Request) {
  const access = await requireResearcherAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ matches: [] });
  }

  try {
    const matches = await lookupPlayer(q);
    return NextResponse.json({ matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return NextResponse.json({ error: message, matches: [] }, { status: 502 });
  }
}
