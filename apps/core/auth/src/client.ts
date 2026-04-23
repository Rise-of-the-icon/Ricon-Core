export { AuthProvider, useAuth } from "./auth-context";
export { hasSupabaseEnv } from "./env";
export { hasPermission, rolePermissions } from "./permissions";
export {
  defaultAuthRoutes,
  defaultPublicRoutes,
  defaultRouteRoleRules,
  getDashboardForRole,
  getPostSignInPath,
  getProtectedNavigationItems,
  getRequiredRolesForPathname,
  roleDashboardRoutes,
} from "./routes";
export { extractRoleFromUser, isAppRole, normalizeRole } from "./role";
export type {
  AppRole,
  AuthContextValue,
  AuthState,
  Permission,
  RoleResolverOptions,
  RouteRoleRule,
} from "./types";
