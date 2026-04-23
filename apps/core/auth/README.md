# `@ricon/core-auth`

Role-based authentication foundation for a Next.js app using Supabase Auth and `@supabase/ssr`.

## Roles

- `admin`
- `researcher`
- `editor`
- `talent`

## What this package provides

- Email/password sign-in helper with role-aware dashboard redirects
- Cookie-backed Supabase SSR clients for browser, server, and middleware usage
- Route middleware that refreshes auth state and enforces role access
- `AuthProvider` and `useAuth()` with `user`, `role`, `loading`, and `signOut`
- Role permissions and redirect helpers

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
# or NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Recommended `user_roles` table

```sql
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'researcher', 'editor', 'talent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

If you already store the role in `app_metadata.role` or `user_metadata.role`, the package will use that first and only fall back to `public.user_roles`.

## Next.js usage

Create your app's root middleware and re-export the package middleware:

```ts
export { middleware, config } from "@/apps/core/auth/middleware";
```

Wrap your app with the provider:

```tsx
import { AuthProvider } from "@/apps/core/auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

Use the sign-in helper from a server action or route handler so the SSR helper flow owns the auth cookie lifecycle:

```ts
import { signInWithEmailPassword } from "@/apps/core/auth";

const result = await signInWithEmailPassword({
  email,
  password,
});
```

## Session security note

This module uses Supabase's SSR client pattern and middleware-based token refresh. In practice, Supabase's browser/server split still requires the standard SSR cookie flow rather than a fully custom opaque session layer. Keep RLS enabled and do not trust session data from cookies without server verification.
