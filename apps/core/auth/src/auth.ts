import { getMockServerAuthState, signInWithMockRole } from "./mock";
import { hasSupabaseEnv } from "./env";
import { createServerSupabaseClient } from "./supabase/server";
import { resolveUserRole } from "./role";
import { getDashboardForRole } from "./routes";
import type {
  RoleResolverOptions,
  SignInWithPasswordInput,
  SignInWithPasswordResult,
} from "./types";

export async function signInWithEmailPassword(
  input: SignInWithPasswordInput,
  options?: RoleResolverOptions,
): Promise<SignInWithPasswordResult> {
  if (!hasSupabaseEnv()) {
    return signInWithMockRole(input);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    return {
      error: error.message,
      redirectTo: null,
      role: null,
      user: null,
    };
  }

  const role = await resolveUserRole(data.user, supabase, options);

  return {
    error: null,
    redirectTo: getDashboardForRole(role),
    role,
    user: data.user,
  };
}

export async function getServerAuthState(options?: RoleResolverOptions) {
  if (!hasSupabaseEnv()) {
    return getMockServerAuthState();
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = await resolveUserRole(user, supabase, options);

  return {
    role,
    supabase,
    user,
  };
}
