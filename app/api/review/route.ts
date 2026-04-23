import { NextResponse } from "next/server";

import { requireEditorAccess } from "@/apps/core/review/auth";
import { getReviewDashboardPayload } from "@/apps/core/review/repository";

export async function GET(request: Request) {
  const access = await requireEditorAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const profileId = url.searchParams.get("profileId");
    const payload = await getReviewDashboardPayload(profileId);

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to load the review dashboard. Check editor role resolution and review data configuration.",
      },
      { status: 500 },
    );
  }
}
