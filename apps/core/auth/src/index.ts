export { AuthProvider, useAuth } from "./auth-context";
export { getServerAuthState, signInWithEmailPassword } from "./auth";
export { hasSupabaseEnv } from "./env";
export { authMiddleware, config, middleware } from "./middleware";
export { hasPermission, rolePermissions } from "./permissions";
export { clearMockAuthCookie, MOCK_AUTH_COOKIE } from "./mock";
export { extractRoleFromUser, isAppRole, normalizeRole, resolveUserRole } from "./role";
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
export { createBrowserSupabaseClient } from "./supabase/browser";
export { createServerSupabaseClient } from "./supabase/server";
export type {
  AppRole,
  AuthContextValue,
  AuthMiddlewareOptions,
  AuthState,
  Permission,
  RoleResolverOptions,
  RouteRoleRule,
  SignInWithPasswordInput,
  SignInWithPasswordResult,
} from "./types";
