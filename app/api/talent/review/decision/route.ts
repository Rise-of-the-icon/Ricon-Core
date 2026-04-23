import { NextResponse } from "next/server";

import { applyReviewChangeDecision } from "@/apps/core/review/repository";
import type { ReviewChangeDecisionInput } from "@/apps/core/review/types";
import { requireTalentAccess } from "@/apps/core/talent/auth";

export async function POST(request: Request) {
  const access = await requireTalentAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Partial<ReviewChangeDecisionInput>;

  if (
    !body.profileId ||
    !body.fieldId ||
    !body.decision ||
    !["accepted", "rejected"].includes(body.decision)
  ) {
    return NextResponse.json({ error: "Invalid change decision payload." }, { status: 400 });
  }

  try {
    const decision = await applyReviewChangeDecision(
      {
        decision: body.decision,
        fieldId: body.fieldId,
        profileId: body.profileId,
      },
      access,
    );

    return NextResponse.json({ decision });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to save talent change decision.",
      },
      { status: 400 },
    );
  }
}
