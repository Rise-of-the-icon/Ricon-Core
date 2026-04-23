import type { AppRole, Permission } from "./types";

export const rolePermissions: Record<AppRole, Permission[]> = {
  admin: [
    "admin.manage",
    "workspace.read",
    "workspace.write",
    "review.read",
    "review.write",
    "talent.read",
    "talent.write",
  ],
  researcher: ["workspace.read", "workspace.write", "talent.read"],
  editor: ["review.read", "review.write"],
  talent: ["talent.read", "talent.write"],
};

export function hasPermission(
  role: AppRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) {
    return false;
  }

  return rolePermissions[role].includes(permission);
}
