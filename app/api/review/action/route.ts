import { NextResponse } from "next/server";

import { requireEditorAccess } from "@/apps/core/review/auth";
import { applyReviewAction } from "@/apps/core/review/repository";
import type { ReviewActionInput } from "@/apps/core/review/types";

export async function POST(request: Request) {
  const access = await requireEditorAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Partial<ReviewActionInput>;

  if (
    !body.profileId ||
    !body.action ||
    ![
      "editor_approve",
      "editor_flag_issue",
      "editor_request_changes",
      "editor_send_back",
      "publish",
    ].includes(body.action)
  ) {
    return NextResponse.json({ error: "Invalid review action payload." }, { status: 400 });
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
          error instanceof Error ? error.message : "Unable to update review state.",
      },
      { status: 400 },
    );
  }
}
