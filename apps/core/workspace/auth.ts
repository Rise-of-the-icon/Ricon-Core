import { getServerAuthState } from "@/apps/core/auth";

export async function requireResearcherAccess() {
  let authState;

  try {
    authState = await getServerAuthState();
  } catch {
    return null;
  }

  if (!authState.user || authState.role !== "researcher") {
    return null;
  }

  return {
    researcherId: authState.user.id,
    user: authState.user,
  };
}
