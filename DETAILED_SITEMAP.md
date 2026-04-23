# RICON Detailed Sitemap

This sitemap is based on the current Next.js App Router structure, `src/next/pageManifest.js`, `app/sitemap.ts`, route handlers under `app/api`, and auth routing in `apps/core/auth/src/routes.ts`.

## Sitemap Scope

- Framework: Next.js App Router.
- Primary route root: `app/`.
- Human-facing route registry: `src/next/pageManifest.js`.
- XML sitemap generator: `app/sitemap.ts`.
- Robots policy: `app/robots.ts`.
- Protected route policy: `apps/core/auth/src/routes.ts` and `apps/core/auth/src/middleware.ts`.

## Public Navigation Model

Primary navigation items from `src/data/siteData.js`:

| Label | Route | Purpose |
| --- | --- | --- |
| Home | `/` | Main marketing entry point and product positioning. |
| About | `/about` | Company overview and RICON positioning. |
| How It Works | `/how-it-works` | Research, review, verify, and distribute workflow. |
| Talent Directory | `/talent` | Browse and filter talent profile records. |
| API Docs | `/api` | Public developer-facing API overview. |
| Contact | `/contact` | Contact route for onboarding, API, licensing, and platform questions. |

Common CTAs across marketing pages:

- `/apply/talent` for talent onboarding.
- `/developers/api-access` for developer/API access.
- `/talent` for profile discovery.
- `/contact` for partner and general inquiries.

## Public Marketing Pages

These pages are publicly accessible and are marked `visibility: "public"` in the page manifest unless noted otherwise.

| Route | Page Title | Source | Search Sitemap | Purpose / Content |
| --- | --- | --- | --- | --- |
| `/` | Home | `app/page.jsx` | Included | Marketing homepage for the verified biographical data platform. Features trust positioning, featured talent, workflow, ecosystem cards, and primary CTAs. |
| `/about` | About | `app/about/page.jsx` | Included | Static company overview: RICON gives talent a verified place to own facts, milestones, and commercial context. |
| `/mission` | Mission | `app/mission/page.jsx` | Included | Static mission page focused on reducing misinformation drift, talent review workflows, and visible provenance. |
| `/how-it-works` | How It Works | `app/how-it-works/page.jsx` | Included | Detailed workflow page for Research, Review, Verify, and Distribute stages. |
| `/talent` | Talent Directory | `app/talent/page.jsx` | Included | Public searchable/filterable talent directory with status filters, sorting, profile cards, and profile links. |
| `/marketplace` | Marketplace | `app/marketplace/page.jsx` | Included | Public product/drop marketplace surface using product and drop data from `src/data/siteData.js`. |
| `/api` | API | `app/api/page.jsx` | Included | Public API overview page for verified talent data, metrics, endpoint concepts, and developer positioning. |
| `/licensing` | Licensing | `app/licensing/page.jsx` | Included | Static licensing overview for structured, provenance-rich profile data. |
| `/data-licensing` | Data Licensing | `app/data-licensing/page.jsx` | Included | Ecosystem vertical for profile API payloads, JSON exports, and licensee-ready feeds. |
| `/digital-experiences` | Digital Experiences | `app/digital-experiences/page.jsx` | Included | Ecosystem vertical for profile hubs, fan touchpoints, storefronts, and timeline products. |
| `/gaming-ai` | Gaming and AI | `app/gaming-ai/page.jsx` | Included | Ecosystem vertical for identity-safe talent data used in simulations, agents, games, and generated media. |
| `/contact` | Contact | `app/contact/page.jsx` | Included | Contact page for onboarding, licensing, API access, security, privacy, and platform questions. |
| `/security` | Security | `app/security/page.jsx` | Included | Static trust/security page for role-aware access, version history, and workflow data handling. |
| `/privacy` | Privacy | `app/privacy/page.jsx` | Included | Placeholder privacy policy page for data collection, platform use, and privacy contact routing. |
| `/terms` | Terms | `app/terms/page.jsx` | Included | Placeholder terms page for site use, account access, profile ownership, and licensing rights. |

## Lead Capture And Auth Pages

| Route | Page Title | Source | Search Sitemap | Purpose / Content |
| --- | --- | --- | --- | --- |
| `/apply/talent` | Apply as Talent | `app/apply/talent/page.jsx` | Included | Talent beta wait-list form. Collects work email and onboarding context. |
| `/developers/api-access` | API Access | `app/developers/api-access/page.jsx` | Included | Developer beta request form for API needs, sandbox/production needs, and product context. |
| `/sign-in` | Sign In | `app/sign-in/page.jsx` | Included | Public auth entry point. Supports Supabase auth or mock-mode role selection when Supabase env vars are absent. Supports `?next=/path` and mock `?switch=1`. |
| `/sign-up` | Sign Up | `app/sign-up/page.jsx` | Included | Public account creation page. |
| `/forgot-password` | Forgot Password | `app/forgot-password/page.jsx` | Included | Public password recovery page. |
| `/login` | Login alias | Middleware only | Not included | Recognized as an auth route by middleware, but there is no `app/login/page.*` page in the current tree. |

## Public Dynamic Talent Profiles

The XML sitemap expands `TALENT` records from `src/data/siteData.js` into `/talent/{id}` URLs.

| Route | Talent | Status | Type | Last Updated | Search Sitemap |
| --- | --- | --- | --- | --- | --- |
| `/talent/1` | Jason Kidd | Verified | Basketball | Mar 12, 2026 | Included |
| `/talent/2` | JR Ryder | Verified | Basketball | Mar 8, 2026 | Included |
| `/talent/3` | Ray Allen | In Review | Basketball | Mar 1, 2026 | Included |
| `/talent/4` | Brian Blue | In Progress | Music | Feb 22, 2026 | Included |
| `/talent/5` | Cooper Flagg | Potential | Basketball | Apr 4, 2026 | Included |

Profile page content includes:

- Biography and long-form profile story.
- Career milestones.
- Statistics.
- Product associations.
- Provenance/source toggles.
- Approval/audit status display.
- Follow/share interactions.

Implementation note: `TalentProfile` currently compares `item.id === talentId`; route params arrive as strings, while `TALENT.id` values are numbers. `/talent/1` still resolves to the first profile through the fallback, but other numeric profile URLs may not resolve to their intended profile without coercion.

## Marketplace Content Model

Marketplace data is currently not represented as separate routable product or drop pages. It is rendered within `/marketplace`.

Products:

| Product | Talent | Status | Type |
| --- | --- | --- | --- |
| Jason Kidd Signed Mavericks Jersey | Jason Kidd | Live | Collectible |
| Jason Kidd Career Timeline Print | Jason Kidd | Live | Art print |
| Kidd Signature Community Tee | Jason Kidd | Live | Apparel |
| JR Rider Highlight Archive Card | JR Ryder | Live | Digital collectible |
| Ray Allen Finals Shot Commemorative Card | Ray Allen | Coming Soon | Trading card |
| Brian Blue Studio Sessions Poster | Brian Blue | Draft | Poster |

Drops:

| Drop | Talent | Status | Date |
| --- | --- | --- | --- |
| The Assist King Collection | Jason Kidd | Upcoming | Mar 22, 2026 |
| Rider Replay Vault | JR Ryder | Upcoming | Apr 12, 2026 |
| Clutch Moments Archive | Ray Allen | Planned | TBD |

## Protected Product Areas

Protected routes are not included in `app/sitemap.ts` and are disallowed by `app/robots.ts`.

| Route | Page Title | Role Access | Source | Purpose / Content |
| --- | --- | --- | --- | --- |
| `/portal` | Portal Dashboard | `admin`, `talent` | `app/portal/page.jsx` | Talent dashboard with profile overview, verification status, earnings/products summary, and account context. |
| `/portal/review` | Portal Review | `admin`, `talent` | `app/portal/review/page.jsx` | Talent-facing review queue with proposed changes, module decisions, and approval/request-changes actions. |
| `/portal/products` | Portal Products | `admin`, `talent` | `app/portal/products/page.jsx` | Talent product management view for associated marketplace items. |
| `/portal/earnings` | Portal Earnings | `admin`, `talent` | `app/portal/earnings/page.jsx` | Talent earnings and reporting view. |
| `/portal/settings` | Portal Settings | `admin`, `talent` | `app/portal/settings/page.jsx` | Talent settings for module visibility, data sharing, delegate access, and notifications. |
| `/workspace` | Research Workspace | `researcher` | `app/workspace/page.tsx` | Researcher workspace for profile research, editing, saving, and submission. |
| `/review` | Review Dashboard | `editor` | `app/review/page.tsx` | Editor review dashboard for profile approval, issue flagging, change requests, send-back, and publish actions. Supports optional `?profileId=`. |
| `/admin/dashboard` | Admin Dashboard | `admin` | `app/admin/dashboard/page.jsx` | Mission control dashboard for operational overview and admin-only metrics. |
| `/admin/sources` | Source Citation Manager | `admin` | `app/admin/sources/page.tsx` | Admin source citation database and optional broken-link checking. |

Role dashboard defaults:

| Role | Post Sign-In Dashboard |
| --- | --- |
| `admin` | `/admin/dashboard` |
| `researcher` | `/workspace` |
| `editor` | `/review` |
| `talent` | `/portal` |

Protected navigation by role:

- Admin: `/admin/dashboard`, `/admin/sources`, `/review`, `/portal`.
- Researcher: `/workspace`.
- Editor: `/review`.
- Talent: `/portal`, `/portal/review`, `/portal/products`, `/portal/earnings`, `/portal/settings`.

## Figma Export Routes

`/figma-export/[pageId]` is a utility route for rendering pages/screens for Figma capture. It is not in the public page manifest, not in the XML sitemap, and not disallowed by `robots.ts`.

Supported page IDs:

| Route | Rendered Screen |
| --- | --- |
| `/figma-export/home` | Home |
| `/figma-export/talent` | Talent Directory |
| `/figma-export/talent-profile` | Talent Profile using `talentId: "1"` |
| `/figma-export/api` | API page |
| `/figma-export/talent-apply` | Apply as Talent |
| `/figma-export/api-access` | API Access |
| `/figma-export/sign-in` | Export-specific sign-in page |
| `/figma-export/sign-up` | Sign Up |
| `/figma-export/forgot-password` | Forgot Password |
| `/figma-export/talent-dash` | Talent portal dashboard with mock talent auth |
| `/figma-export/talent-review` | Talent portal review with mock talent auth |
| `/figma-export/talent-products` | Talent portal products with mock talent auth |
| `/figma-export/talent-earnings` | Talent portal earnings with mock talent auth |
| `/figma-export/talent-settings` | Talent portal settings with mock talent auth |
| `/figma-export/admin-dashboard` | Admin dashboard with mock admin auth |
| `/figma-export/workspace` | Research workspace with mock researcher auth |
| `/figma-export/review` | Review dashboard with mock editor auth |

Unknown `pageId` values call `notFound()`.

## API Route Handlers

API handlers live under `app/api`. These are not included in `app/sitemap.ts` and `/api/` is disallowed by `robots.ts`.

| Endpoint | Methods | Auth / Role | Purpose |
| --- | --- | --- | --- |
| `/api/page-manifest` | `GET` | Public | Returns the page manifest for export/tracking tooling. |
| `/api/mock-auth/sign-out` | `POST` | Public/mock auth | Clears the `ricon_mock_auth` cookie and returns `{ ok: true }`. |
| `/api/workspace/profile` | `GET`, `PUT` | `researcher` | Loads or saves a research workspace profile. `GET` supports `?profileId=`, defaulting to `jason-kidd`. |
| `/api/workspace/profile/submit` | `POST` | `researcher` | Submits a workspace profile into the review workflow. |
| `/api/review` | `GET` | `editor` | Loads the review dashboard payload. Supports optional `?profileId=`. |
| `/api/review/action` | `POST` | `editor` | Applies editor review actions: `editor_approve`, `editor_flag_issue`, `editor_request_changes`, `editor_send_back`, or `publish`. |
| `/api/talent/review/action` | `POST` | `talent` | Applies talent actions: `talent_approve` or `talent_request_changes`. |
| `/api/talent/review/decision` | `POST` | `talent` | Accepts or rejects field-level review changes with `decision: "accepted" | "rejected"`. |
| `/api/admin/mission-control` | `GET` | `admin` | Loads mission control/admin dashboard data. |
| `/api/admin/sources` | `GET` | `admin` | Loads source citation database. Supports `?checkBrokenLinks=1`. |

## System Routes

| Route | Source | Purpose |
| --- | --- | --- |
| `/sitemap.xml` | `app/sitemap.ts` | Generated MetadataRoute sitemap for public static pages and dynamic talent profiles. |
| `/robots.txt` | `app/robots.ts` | Allows `/`; disallows `/admin/`, `/portal/`, `/review/`, `/workspace/`, and `/api/`; points to `/sitemap.xml`. |
| `/_not-found` / 404 fallback | `app/not-found.jsx` | Custom not-found page rendered through `SiteFrame`. |
| Global error boundary | `app/global-error.tsx` | Global application error UI. |
| Route loading states | `app/loading.tsx`, `app/review/loading.tsx` | Loading UI for app-wide and review routes. |
| Review route error boundary | `app/review/error.tsx` | Error UI specific to `/review`. |

## Current XML Sitemap Coverage

`app/sitemap.ts` includes:

- All manifest pages where `visibility === "public"` and the route is not dynamic.
- All talent profile URLs generated from `TALENT` as `/talent/{id}`.

Included static public routes:

- `/`
- `/talent`
- `/api`
- `/about`
- `/mission`
- `/how-it-works`
- `/contact`
- `/security`
- `/privacy`
- `/terms`
- `/licensing`
- `/data-licensing`
- `/digital-experiences`
- `/gaming-ai`
- `/apply/talent`
- `/developers/api-access`
- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/marketplace`

Included dynamic public routes:

- `/talent/1`
- `/talent/2`
- `/talent/3`
- `/talent/4`
- `/talent/5`

Not included:

- Protected product/admin routes.
- API route handlers.
- `/figma-export/[pageId]`.
- `/login`.
- System/error/loading routes.
- Product or drop detail routes, because they do not currently exist as pages.

## Robots And Discoverability Notes

- `robots.ts` disallows `/admin/`, `/portal/`, `/review/`, `/workspace/`, and `/api/`.
- The public `/api` page is included in the XML sitemap. The robots disallow rule is `/api/` with a trailing slash, so it does not explicitly disallow `/api`.
- `/figma-export/[pageId]` is not included in the sitemap but is not currently disallowed in `robots.ts`.
- Auth pages are included in the XML sitemap because they are public manifest entries.
- Protected routes are guarded through middleware and/or route-level access checks, depending on the route.

## Suggested Sitemap Improvements

1. Coerce `talentId` route params before profile lookup so `/talent/2` through `/talent/5` resolve to the intended records.
2. Decide whether `/sign-in`, `/sign-up`, and `/forgot-password` should be indexed; if not, remove them from `app/sitemap.ts` and add robots or metadata controls.
3. Decide whether `/figma-export/` should be disallowed in `robots.ts`, since it is a utility/export surface.
4. Add product/drop detail routes only if marketplace items need shareable URLs; otherwise keep them as `/marketplace` content.
5. Consider adding route-level metadata per public page if search titles/descriptions need to differ from the root metadata.
