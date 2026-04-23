import type { User } from "@supabase/supabase-js";

export const APP_ROLES = ["admin", "researcher", "editor", "talent"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type Permission =
  | "admin.manage"
  | "workspace.read"
  | "workspace.write"
  | "review.read"
  | "review.write"
  | "talent.read"
  | "talent.write";

export interface AuthState {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
}

export interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
}

export interface SignInWithPasswordInput {
  email: string;
  password: string;
  role?: AppRole | null;
}

export interface SignInWithPasswordResult {
  error: string | null;
  redirectTo: string | null;
  role: AppRole | null;
  user: User | null;
}

export interface RoleResolverOptions {
  roleColumn?: string;
  tableName?: string;
  userIdColumn?: string;
}

export interface RouteRoleRule {
  pathname: string;
  roles: AppRole[];
}

export interface AuthMiddlewareOptions {
  authRoutes?: string[];
  loginPath?: string;
  publicRoutes?: string[];
  roleResolver?: RoleResolverOptions;
  routeRoleRules?: RouteRoleRule[];
}
