import type { AppRole, RouteRoleRule } from "./types";

interface ProtectedNavigationItem {
  href: string;
  label: string;
}

export const roleDashboardRoutes: Record<AppRole, string> = {
  admin: "/admin/dashboard",
  researcher: "/workspace",
  editor: "/review",
  talent: "/portal",
};

export const defaultAuthRoutes = ["/login", "/sign-in"];

export const defaultPublicRoutes = ["/", "/auth/callback"];

export const defaultRouteRoleRules: RouteRoleRule[] = [
  { pathname: "/admin", roles: ["admin"] },
  { pathname: "/workspace", roles: ["researcher"] },
  { pathname: "/review", roles: ["editor"] },
  { pathname: "/portal", roles: ["admin", "talent"] },
];

const protectedNavigationByRole: Record<AppRole, ProtectedNavigationItem[]> = {
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/sources", label: "Sources" },
    { href: "/review", label: "Review" },
    { href: "/portal", label: "Portal" },
  ],
  researcher: [{ href: "/workspace", label: "Workspace" }],
  editor: [{ href: "/review", label: "Review" }],
  talent: [
    { href: "/portal", label: "Portal" },
    { href: "/portal/review", label: "Review Queue" },
    { href: "/portal/earnings", label: "Earnings" },
    { href: "/portal/settings", label: "Settings" },
  ],
};

export function getDashboardForRole(role: AppRole | null): string {
  if (!role) {
    return "/sign-in";
  }

  return roleDashboardRoutes[role];
}

export function pathnameMatches(pathname: string, candidate: string): boolean {
  return pathname === candidate || pathname.startsWith(`${candidate}/`);
}

export function getRequiredRolesForPathname(
  pathname: string,
  rules: RouteRoleRule[] = defaultRouteRoleRules,
): AppRole[] | null {
  const matchingRule = [...rules]
    .sort((left, right) => right.pathname.length - left.pathname.length)
    .find((rule) => pathnameMatches(pathname, rule.pathname));

  return matchingRule?.roles ?? null;
}

export function getProtectedNavigationItems(
  role: AppRole | null,
): ProtectedNavigationItem[] {
  if (!role) {
    return [];
  }

  return protectedNavigationByRole[role];
}

function isSafeInternalPath(pathname: string | null | undefined): pathname is string {
  return Boolean(pathname && pathname.startsWith("/") && !pathname.startsWith("//"));
}

export function getPostSignInPath(
  role: AppRole | null,
  requestedPath: string | null | undefined,
): string {
  const dashboardPath = getDashboardForRole(role);

  if (!role || !isSafeInternalPath(requestedPath)) {
    return dashboardPath;
  }

  if (defaultAuthRoutes.some((route) => pathnameMatches(requestedPath, route))) {
    return dashboardPath;
  }

  const requiredRoles = getRequiredRolesForPathname(requestedPath);
  if (!requiredRoles) {
    return requestedPath;
  }

  return requiredRoles.includes(role) ? requestedPath : dashboardPath;
}
