import { notFound } from "next/navigation";

import ResearchWorkspace from "@/apps/core/workspace/ResearchWorkspace";
import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { getWorkspacePayload } from "@/apps/core/workspace/repository";

interface PageProps {
  params: Promise<{ profileId: string }>;
}

export default async function WorkspaceProfileRoute({ params }: PageProps) {
  const access = await requireResearcherAccess();
  if (!access) return null;

  const { profileId } = await params;
  const payload = await getWorkspacePayload(profileId, access.researcherId, access.user);
  if (!payload) notFound();

  return <ResearchWorkspace initialPayload={payload} />;
}
