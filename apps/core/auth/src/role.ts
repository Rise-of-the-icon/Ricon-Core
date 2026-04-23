import type {
  SupabaseClient,
  User,
} from "@supabase/supabase-js";

import { APP_ROLES } from "./types";
import type { AppRole, RoleResolverOptions } from "./types";

const DEFAULT_ROLE_RESOLVER_OPTIONS: Required<RoleResolverOptions> = {
  roleColumn: "role",
  tableName: "user_roles",
  userIdColumn: "user_id",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

export function normalizeRole(value: unknown): AppRole | null {
  if (!isAppRole(value)) {
    return null;
  }

  return value;
}

function extractRoleValue(source: unknown): AppRole | null {
  if (!isRecord(source)) {
    return null;
  }

  const directRole = normalizeRole(source.role);
  if (directRole) {
    return directRole;
  }

  if (Array.isArray(source.roles)) {
    return normalizeRole(source.roles[0]);
  }

  return null;
}

export function extractRoleFromUser(user: User | null): AppRole | null {
  if (!user) {
    return null;
  }

  return (
    extractRoleValue(user.app_metadata) ??
    extractRoleValue(user.user_metadata) ??
    null
  );
}

export async function resolveUserRole(
  user: User | null,
  supabase?: SupabaseClient,
  options?: RoleResolverOptions,
): Promise<AppRole | null> {
  const metadataRole = extractRoleFromUser(user);

  if (metadataRole) {
    return metadataRole;
  }

  if (!user || !supabase) {
    return null;
  }

  const resolvedOptions = {
    ...DEFAULT_ROLE_RESOLVER_OPTIONS,
    ...options,
  };

  const { data, error } = await supabase
    .from(resolvedOptions.tableName)
    .select(resolvedOptions.roleColumn)
    .eq(resolvedOptions.userIdColumn, user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const row = data as Record<string, unknown> | null;

  return normalizeRole(row?.[resolvedOptions.roleColumn]);
}

export async function resolveRoleFromClaims(
  claims: Record<string, unknown> | null | undefined,
  supabase?: SupabaseClient,
  options?: RoleResolverOptions,
): Promise<AppRole | null> {
  if (!claims) {
    return null;
  }

  const metadataRole =
    extractRoleValue(claims.app_metadata) ??
    extractRoleValue(claims.user_metadata) ??
    normalizeRole(claims.role);

  if (metadataRole) {
    return metadataRole;
  }

  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId || !supabase) {
    return null;
  }

  const resolvedOptions = {
    ...DEFAULT_ROLE_RESOLVER_OPTIONS,
    ...options,
  };

  const { data, error } = await supabase
    .from(resolvedOptions.tableName)
    .select(resolvedOptions.roleColumn)
    .eq(resolvedOptions.userIdColumn, userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const row = data as Record<string, unknown> | null;

  return normalizeRole(row?.[resolvedOptions.roleColumn]);
}
