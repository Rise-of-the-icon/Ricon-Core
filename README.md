# RICON — Rise of the Icon

Verification-first biographical infrastructure. The app now runs on Next.js with Supabase-backed role authentication and middleware-protected dashboard routes.

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
# or NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Auth Routes

- `/sign-in`
- `/admin/dashboard`
- `/workspace`
- `/review`
- `/portal`

## Page Tracking And Figma Export

Every route now resolves through a shared page manifest in [src/next/pageManifest.js](/Users/marcusproietti/Documents/GitHub/Ricon/src/next/pageManifest.js). Tracked pages stamp stable DOM attributes such as `data-ricon-page`, `data-ricon-page-path`, and `data-ricon-figma-frame`, and the active payload is exposed on `window.__RICON_CURRENT_PAGE__`.

The full manifest is available at `/api/page-manifest`, which makes it straightforward to script Figma export or capture workflows without hardcoding the route list in external tooling.

Role resolution lives in [apps/core/auth](/Users/marcusproietti/Documents/GitHub/Ricon/apps/core/auth) and checks `app_metadata.role`, `user_metadata.role`, then `public.user_roles`.

## Workspace Backend

The researcher workspace at `/workspace` writes profile content to Sanity when these vars are set:

```bash
SANITY_PROJECT_ID=...
SANITY_DATASET=...
SANITY_API_TOKEN=...
```

The expected Studio document shape is exported from [apps/core/workspace/sanity-schema.ts](/Users/marcusproietti/Documents/GitHub/Ricon/apps/core/workspace/sanity-schema.ts).

Draft autosaves and revision history write to Supabase when these vars are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Optional review notification webhook:

```bash
WORKSPACE_REVIEW_EMAIL_WEBHOOK_URL=...
```

Recommended Supabase tables:

```sql
create table if not exists public.profile_drafts (
  profile_id text primary key,
  researcher_id text not null,
  status text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_revisions (
  id uuid primary key,
  profile_id text not null,
  researcher_id text not null,
  status text not null,
  summary text not null,
  saved_at timestamptz not null default now()
);
```

## Recommended Supabase Schema

```sql
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'researcher', 'editor', 'talent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

create policy "Users can read their own role"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);
```

## Tech Stack

- Next.js App Router
- React 19
- Supabase Auth with `@supabase/ssr`
- Playfair Display + Inter + JetBrains Mono
- Custom design system in `src/`

## Project Structure

```text
ricon-site/
├── app/                # Next.js routes
├── apps/core/auth/     # Supabase auth foundation and middleware
├── public/             # Static assets
└── src/                # Reused UI, content, and client wrappers
```
