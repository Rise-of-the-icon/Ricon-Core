import { getServerAuthState } from "@/apps/core/auth";

function getActorName(user: Awaited<ReturnType<typeof getServerAuthState>>["user"]) {
  if (!user) {
    return null;
  }

  if (typeof user.user_metadata?.full_name === "string") {
    return user.user_metadata.full_name;
  }

  if (typeof user.user_metadata?.name === "string") {
    return user.user_metadata.name;
  }

  if (typeof user.email === "string") {
    const [localPart] = user.email.split("@");
    return localPart
      .split(/[._+-]/g)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  }

  return null;
}

export async function requireEditorAccess() {
  let authState;

  try {
    authState = await getServerAuthState();
  } catch {
    return null;
  }

  if (!authState.user || authState.role !== "editor") {
    return null;
  }

  return {
    actorName: getActorName(authState.user) ?? "Editor",
    actorRole: "editor",
    user: authState.user,
    userId: authState.user.id,
  };
}
