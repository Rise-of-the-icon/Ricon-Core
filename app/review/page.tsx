import { redirect } from "next/navigation";

import { requireEditorAccess } from "@/apps/core/review/auth";
import ReviewDashboard from "@/apps/core/review/ReviewDashboard";
import {
  createEmptyReviewDashboardPayload,
  getReviewDashboardPayload,
} from "@/apps/core/review/repository";

export default async function ReviewRoute({
  searchParams,
}: {
  searchParams?: Promise<{ profileId?: string }>;
}) {
  const access = await requireEditorAccess();

  if (!access) {
    redirect("/sign-in?next=/review");
  }

  let payload = createEmptyReviewDashboardPayload();

  try {
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    payload = await getReviewDashboardPayload(resolvedSearchParams?.profileId);
  } catch {
    payload = createEmptyReviewDashboardPayload();
  }

  return <ReviewDashboard initialPayload={payload} />;
}
