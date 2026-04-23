import {
  getWorkspaceEmailWebhookUrl,
  hasWorkspaceEmailEnv,
} from "@/apps/core/workspace/env";
import type { ResearchProfile } from "@/apps/core/workspace/types";

import type { ReviewActionInput } from "./types";

export async function sendReviewDecisionNotification(
  profile: ResearchProfile,
  action: ReviewActionInput["action"],
  comment: string | null,
) {
  if (!hasWorkspaceEmailEnv()) {
    return false;
  }

  const webhookUrl = getWorkspaceEmailWebhookUrl();

  if (!webhookUrl || !profile.researcherEmail) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment,
      event: `review.${action}`,
      profileId: profile.id,
      profileName: profile.name.value,
      recipient: {
        email: profile.researcherEmail,
        id: profile.researcherId,
        name: profile.researcherName,
      },
      status: profile.status,
      updatedAt: profile.updatedAt,
    }),
    cache: "no-store",
  });

  return response.ok;
}
