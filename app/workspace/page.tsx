import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import { listWorkspaceProfiles } from "@/apps/core/workspace/repository";

import OnboardingHub from "@/apps/core/workspace/OnboardingHub";

export default async function WorkspaceRoute() {
  const access = await requireResearcherAccess();
  if (!access) return null;

  const profiles = await listWorkspaceProfiles(access.researcherId);
  return <OnboardingHub initialProfiles={profiles} />;
}
