import { NextResponse } from "next/server";

import { applyReviewAction } from "@/apps/core/review/repository";
import type { ReviewActionInput } from "@/apps/core/review/types";
import { requireTalentAccess } from "@/apps/core/talent/auth";

export async function POST(request: Request) {
  const access = await requireTalentAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Partial<ReviewActionInput>;

  if (
    !body.profileId ||
    !body.action ||
    !["talent_approve", "talent_request_changes"].includes(body.action)
  ) {
    return NextResponse.json({ error: "Invalid talent review action payload." }, { status: 400 });
  }

  try {
    const payload = await applyReviewAction(
      {
        action: body.action,
        comment: body.comment ?? null,
        profileId: body.profileId,
      },
      access,
    );

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update talent review state.",
      },
      { status: 400 },
    );
  }
}
