function read(name: string): string | undefined {
  return typeof process === "undefined" ? undefined : process.env[name];
}

export function hasSanityEnv(): boolean {
  return Boolean(
    read("SANITY_PROJECT_ID") &&
      read("SANITY_DATASET") &&
      read("SANITY_API_TOKEN"),
  );
}

export function hasWorkspaceSupabaseEnv(): boolean {
  return Boolean(
    read("NEXT_PUBLIC_SUPABASE_URL") &&
      (read("SUPABASE_SERVICE_ROLE_KEY") ||
        read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
        read("NEXT_PUBLIC_SUPABASE_ANON_KEY")),
  );
}

export function hasWorkspaceEmailEnv(): boolean {
  return Boolean(read("WORKSPACE_REVIEW_EMAIL_WEBHOOK_URL"));
}

export function getWorkspaceEmailWebhookUrl(): string | null {
  return read("WORKSPACE_REVIEW_EMAIL_WEBHOOK_URL") ?? null;
}
