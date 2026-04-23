import { getWorkspaceEmailWebhookUrl, hasWorkspaceEmailEnv } from "./env";
import type { ResearchProfile } from "./types";

export async function sendReviewSubmissionNotification(profile: ResearchProfile) {
  if (!hasWorkspaceEmailEnv()) {
    return false;
  }

  const webhookUrl = getWorkspaceEmailWebhookUrl();

  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "workspace.submit_for_review",
      profileId: profile.id,
      status: profile.status,
      researcherId: profile.researcherId,
      updatedAt: profile.updatedAt,
      subject: `Research profile submitted for review: ${profile.name.value}`,
    }),
    cache: "no-store",
  });

  return response.ok;
}
