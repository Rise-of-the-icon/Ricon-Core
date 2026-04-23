# RICON UX Architecture Audit

Audit date: 2026-04-16  
Scope: repository at `/Users/marcusproietti/Documents/GitHub/Ricon`

This audit is based on the implemented Next.js App Router code, shared route/page manifests, navigation components, protected shells, auth middleware, API actions, page composition, and available project metadata. No test or story files were found in the repository search, so flows are inferred from code and page structure rather than from test scenarios.

## SECTION A — Product Areas

### 1. Public Marketing Site

**Status: definitely implemented**

Public marketing pages are implemented through `app/` routes and shared client wrappers:

- `app/page.jsx` renders `src/views/HomePage.jsx` inside `src/next/SiteFrame.jsx`.
- `app/about/page.jsx`, `app/mission/page.jsx`, `app/security/page.jsx`, `app/privacy/page.jsx`, `app/terms/page.jsx`, and `app/licensing/page.jsx` render `src/next/StaticRoute.jsx`, which lazy-loads `src/views/StaticPage.jsx`.
- `app/how-it-works/page.jsx` renders `src/views/HowItWorksPage.jsx`.
- `app/contact/page.jsx` renders `src/views/ContactPage.jsx`.
- `app/data-licensing/page.jsx`, `app/digital-experiences/page.jsx`, and `app/gaming-ai/page.jsx` render `src/next/EcosystemVerticalRoute.jsx`, which lazy-loads `src/views/EcosystemVerticalPage.jsx`.
- `app/marketplace/page.jsx` lazy-loads `src/views/MarketplacePage.jsx`.

The public shell is `src/components/layout/AppShell.jsx`. It provides the sticky global nav, responsive tablet/mobile nav variants, footer, newsletter form, auth CTA, sign-out state, back-to-top overlay, and beta badge.

Primary public navigation is defined by `NAV_ITEMS` in `src/data/siteData.js`: Home, About, How It Works, Talent Directory, API Docs, Contact. Footer navigation exposes additional routes: Talent Directory, API Docs, Apply as Talent, Get API Access, About, Mission, How it works, Contact, Security, Sign in, Create account, Privacy, Terms, Licensing.

### 2. Talent Discovery and Profile Viewing

**Status: definitely implemented**

This area includes:

- Talent directory: `app/talent/page.jsx` renders `src/views/TalentPage.jsx`.
- Talent profile route: `app/talent/[talentId]/page.jsx` renders `src/views/TalentProfile.jsx`.
- Talent data source: `TALENT` records in `src/data/siteData.js`.

The directory includes search/filter-style UI patterns and tab roles. The profile page includes profile content, profile tabs, source/citation presentation, marketplace/API CTAs, and a custom fallback when an unknown talent ID is requested.

Evidence:

- `app/talent/page.jsx`
- `app/talent/[talentId]/page.jsx`
- `src/views/TalentPage.jsx`
- `src/views/TalentProfile.jsx`
- `src/data/siteData.js`

### 3. Developer/API Acquisition

**Status: definitely implemented, with mock/incomplete product capability**

This area includes:

- API marketing/docs page: `app/api/page.jsx` renders `src/views/ApiPage.jsx`.
- Developer access intake: `app/developers/api-access/page.jsx` renders `src/views/LeadCapturePage.jsx`.
- Page manifest API: `app/api/page-manifest/route.ts` returns `PAGE_MANIFEST`.

The API page presents API resources, metrics, search, and an “API key management (mock)” area. The access request page is a front-end intake form with an acknowledgement state; there is no repository evidence of persistence for the lead form.

Evidence:

- `app/api/page.jsx`
- `app/developers/api-access/page.jsx`
- `src/views/ApiPage.jsx`
- `src/views/LeadCapturePage.jsx`
- `app/api/page-manifest/route.ts`

### 4. Talent Acquisition / Application

**Status: definitely implemented as front-end intake**

`app/apply/talent/page.jsx` renders `src/views/LeadCapturePage.jsx` with Talent-specific copy and an acknowledgement message. The page is tracked as `talent-apply` in `src/next/pageManifest.js`.

There is no code evidence of server-side form submission or lead storage for this intake screen.

Evidence:

- `app/apply/talent/page.jsx`
- `src/views/LeadCapturePage.jsx`
- `src/next/pageManifest.js`

### 5. Authentication and Account Entry

**Status: definitely implemented**

Auth/account pages:

- `/sign-in`: `app/sign-in/page.jsx` with `src/next/SignInForm.jsx`.
- `/sign-up`: `app/sign-up/page.jsx` with `src/views/SignUpPage.jsx`.
- `/forgot-password`: `app/forgot-password/page.jsx` with `src/views/ForgotPasswordPage.jsx`.

Auth supports two operating modes:

- Supabase-backed auth when Supabase env vars exist.
- Mock auth when Supabase env vars are absent. Mock mode exposes role selection and “Switch role” behavior.

Role-aware redirects are implemented in `apps/core/auth/src/routes.ts` and enforced by `apps/core/auth/src/middleware.ts`, re-exported from root `middleware.ts`.

Evidence:

- `app/sign-in/page.jsx`
- `src/next/SignInForm.jsx`
- `app/sign-in/actions.js`
- `app/sign-up/page.jsx`
- `src/views/SignUpPage.jsx`
- `app/forgot-password/page.jsx`
- `src/views/ForgotPasswordPage.jsx`
- `apps/core/auth/src/routes.ts`
- `apps/core/auth/src/middleware.ts`
- `middleware.ts`

### 6. Talent Portal

**Status: definitely implemented, partly mock/static**

Talent portal routes:

- `/portal`: dashboard
- `/portal/review`: profile/module review
- `/portal/products`: product review
- `/portal/earnings`: earnings
- `/portal/settings`: settings/privacy

All five routes render `src/views/TalentPortal.jsx` with a `section` prop and are wrapped by public `SiteFrame`, not `ProtectedShell`. Route protection is supplied by middleware for `/portal/:path*`, with required roles `admin` and `talent`.

The portal has its own local left/nav rail using `PORTAL_ITEMS` from `src/data/siteData.js`. On tablet/mobile it becomes a horizontal local nav. Settings are stored in `localStorage`; dashboard/products/earnings are mostly static/mock data from `src/data/siteData.js`; review actions call protected API routes.

Evidence:

- `app/portal/page.jsx`
- `app/portal/review/page.jsx`
- `app/portal/products/page.jsx`
- `app/portal/earnings/page.jsx`
- `app/portal/settings/page.jsx`
- `src/views/TalentPortal.jsx`
- `src/data/siteData.js`
- `apps/core/auth/src/routes.ts`
- `apps/core/auth/src/middleware.ts`
- `app/api/talent/review/action/route.ts`
- `app/api/talent/review/decision/route.ts`

### 7. Research Workspace

**Status: definitely implemented, with live/mock persistence split**

`/workspace` renders `apps/core/workspace/ResearchWorkspace.tsx` from `app/workspace/page.tsx`. It requires researcher access via `apps/core/workspace/auth.ts`. The route fetches a workspace payload for `jason-kidd`.

The workspace supports profile basics, career timeline, personal history, stats/media, citation/reliability editing, additional sources, diff review, save draft, submit for review, autosave, verification blocking/warning states, and revision history.

Persistence is conditional:

- Sanity for profile content when Sanity env vars exist.
- Supabase for drafts/revisions when workspace Supabase env vars exist.
- Mock store fallback otherwise.

Evidence:

- `app/workspace/page.tsx`
- `apps/core/workspace/ResearchWorkspace.tsx`
- `apps/core/workspace/auth.ts`
- `apps/core/workspace/repository.ts`
- `apps/core/workspace/mock-store.ts`
- `apps/core/workspace/sanity.ts`
- `apps/core/workspace/supabase.ts`
- `apps/core/workspace/verification.ts`
- `README.md`

### 8. Editorial Review Dashboard

**Status: definitely implemented**

`/review` renders `apps/core/review/ReviewDashboard.tsx` from `app/review/page.tsx`. It requires editor access via `apps/core/review/auth.ts`. It supports a pending review queue, selected submission detail, source citations, audit trail, editor approve, request changes, flag issue, publish API support, and modal confirmation for issue/request-change actions.

The route has route-local loading and error boundaries: `app/review/loading.tsx` and `app/review/error.tsx`.

Evidence:

- `app/review/page.tsx`
- `apps/core/review/ReviewDashboard.tsx`
- `apps/core/review/auth.ts`
- `apps/core/review/repository.ts`
- `apps/core/review/types.ts`
- `app/api/review/route.ts`
- `app/api/review/action/route.ts`
- `app/review/loading.tsx`
- `app/review/error.tsx`

### 9. Admin Operations

**Status: definitely implemented**

Admin screens:

- `/admin/dashboard`: `apps/core/admin/MissionControlDashboard.tsx`
- `/admin/sources`: `apps/core/admin/SourceCitationManager.tsx`

The dashboard fetches `/api/admin/mission-control`, displays pipeline stage summaries, bottleneck state, system health, and profile links to workspace/review based on stage. Source manager fetches `/api/admin/sources`, displays source count, duplicate count, broken link count, source usage, and can run broken link detection.

Admin access is enforced server-side in `apps/core/admin/repository.ts` and by middleware route rules for `/admin`.

Evidence:

- `app/admin/dashboard/page.jsx`
- `app/admin/sources/page.tsx`
- `apps/core/admin/MissionControlDashboard.tsx`
- `apps/core/admin/SourceCitationManager.tsx`
- `apps/core/admin/repository.ts`
- `app/api/admin/mission-control/route.ts`
- `app/api/admin/sources/route.ts`
- `apps/core/auth/src/routes.ts`

### 10. Figma Export / Capture Support

**Status: implemented, likely tooling-only**

`/figma-export/[pageId]` renders selected application pages with mock auth for protected screens. It supports these page IDs in code: `home`, `talent`, `talent-profile`, `api`, `talent-apply`, `api-access`, `sign-in`, `sign-up`, `forgot-password`, `talent-dash`, `talent-review`, `talent-products`, `talent-earnings`, `talent-settings`, `admin-dashboard`, `workspace`, `review`.

The app also loads the Figma capture script in `app/layout.jsx` and `app/head.jsx`. The shared manifest adds `data-ricon-*` attributes through `src/next/PageTracker.jsx`, and README documents `/api/page-manifest` for scripted Figma export/capture workflows.

This appears to be a design/export workflow, not a user product journey.

Evidence:

- `app/figma-export/[pageId]/page.tsx`
- `src/next/pageManifest.js`
- `src/next/PageTracker.jsx`
- `app/layout.jsx`
- `app/head.jsx`
- `README.md`

### 11. Error, Loading, and Fallback Infrastructure

**Status: definitely implemented**

App-level and route-level states:

- Global loading: `app/loading.tsx`
- Global error: `app/global-error.tsx`
- 404: `app/not-found.jsx`
- Review loading: `app/review/loading.tsx`
- Review error: `app/review/error.tsx`
- Lazy route fallback: `src/components/feedback/RouteFallback.jsx`
- Loading primitives: `src/components/feedback/LoadingState.tsx`

## SECTION B — Route Inventory

### Public Pages

| Route | Product area | Implementation | Status | Notes |
| --- | --- | --- | --- | --- |
| `/` | Marketing home | `app/page.jsx`, `src/views/HomePage.jsx` | Definitely implemented | Primary public landing/home experience. |
| `/about` | Company | `app/about/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx` | Definitely implemented | Static marketing/company page. |
| `/mission` | Company | `app/mission/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx` | Definitely implemented | Static mission page. |
| `/how-it-works` | Product education | `app/how-it-works/page.jsx`, `src/views/HowItWorksPage.jsx` | Definitely implemented | Dedicated page, not the legacy StaticPage variant. |
| `/contact` | Contact/lead | `app/contact/page.jsx`, `src/views/ContactPage.jsx` | Definitely implemented | Client-side status validation/success/error; no persistence found. |
| `/security` | Trust | `app/security/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx` | Definitely implemented | Static trust page. |
| `/privacy` | Legal | `app/privacy/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx` | Definitely implemented, placeholder content | StaticPage copy says full privacy policy is finalized later. |
| `/terms` | Legal | `app/terms/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx` | Definitely implemented, placeholder content | StaticPage copy says future home for full terms. |
| `/licensing` | Licensing | `app/licensing/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx` | Definitely implemented | Public licensing overview. |
| `/data-licensing` | Ecosystem vertical | `app/data-licensing/page.jsx`, `src/next/EcosystemVerticalRoute.jsx`, `src/views/EcosystemVerticalPage.jsx` | Definitely implemented | Linked from ecosystem cards. |
| `/digital-experiences` | Ecosystem vertical | `app/digital-experiences/page.jsx`, `src/next/EcosystemVerticalRoute.jsx`, `src/views/EcosystemVerticalPage.jsx` | Definitely implemented | Linked from ecosystem cards. |
| `/gaming-ai` | Ecosystem vertical | `app/gaming-ai/page.jsx`, `src/next/EcosystemVerticalRoute.jsx`, `src/views/EcosystemVerticalPage.jsx` | Definitely implemented | Linked from ecosystem cards. |
| `/marketplace` | Marketplace | `app/marketplace/page.jsx`, `src/views/MarketplacePage.jsx` | Definitely implemented | Lazy-loaded route with fallback. |
| `/api` | Developer/API docs | `app/api/page.jsx`, `src/views/ApiPage.jsx` | Definitely implemented | Public page route coexists with nested API route handlers under `app/api/**/route.ts`. |
| `/developers/api-access` | Developer acquisition | `app/developers/api-access/page.jsx`, `src/views/LeadCapturePage.jsx` | Definitely implemented as front-end intake | Acknowledgement UI only; no persistence found. |
| `/apply/talent` | Talent acquisition | `app/apply/talent/page.jsx`, `src/views/LeadCapturePage.jsx` | Definitely implemented as front-end intake | Acknowledgement UI only; no persistence found. |
| `/talent` | Talent directory | `app/talent/page.jsx`, `src/views/TalentPage.jsx` | Definitely implemented | Search/filter/tab-like directory controls. |
| `/talent/[talentId]` | Talent profile | `app/talent/[talentId]/page.jsx`, `src/views/TalentProfile.jsx` | Definitely implemented | Numeric ID route, backed by `TALENT` array. |
| `/sign-in` | Auth | `app/sign-in/page.jsx`, `src/next/SignInForm.jsx` | Definitely implemented | Supports `?next=` and mock `?switch=1`. |
| `/sign-up` | Auth/onboarding | `app/sign-up/page.jsx`, `src/views/SignUpPage.jsx` | Definitely implemented | Copy indicates new accounts start as Talent by default but role selector exists. |
| `/forgot-password` | Auth recovery | `app/forgot-password/page.jsx`, `src/views/ForgotPasswordPage.jsx` | Definitely implemented | Front-end status state; Supabase recovery integration not evident in page component. |
| `/figma-export/[pageId]` | Design tooling | `app/figma-export/[pageId]/page.tsx` | Referenced/live route, likely tooling-only | Not in global nav; renders selected pages for capture/export. |

### Protected Pages

| Route | Product area | Implementation | Required role(s) | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/portal` | Talent portal | `app/portal/page.jsx`, `src/views/TalentPortal.jsx` | `admin`, `talent` | Definitely implemented | Dashboard section. |
| `/portal/review` | Talent portal | `app/portal/review/page.jsx`, `src/views/TalentPortal.jsx` | `admin`, `talent` | Definitely implemented | Talent content review with diff decisions and approve/request changes. |
| `/portal/products` | Talent portal | `app/portal/products/page.jsx`, `src/views/TalentPortal.jsx` | `admin`, `talent` | Definitely implemented, partly mock | Product approval buttons do not call APIs in current code. |
| `/portal/earnings` | Talent portal | `app/portal/earnings/page.jsx`, `src/views/TalentPortal.jsx` | `admin`, `talent` | Definitely implemented, static/mock | Revenue data appears hard-coded. |
| `/portal/settings` | Talent portal | `app/portal/settings/page.jsx`, `src/views/TalentPortal.jsx` | `admin`, `talent` | Definitely implemented, local-only persistence | Settings saved to `localStorage`. |
| `/workspace` | Research workspace | `app/workspace/page.tsx`, `apps/core/workspace/ResearchWorkspace.tsx` | `researcher` | Definitely implemented | Page returns `null` when server access check fails; middleware should normally redirect unauthenticated users. |
| `/review` | Editorial review | `app/review/page.tsx`, `apps/core/review/ReviewDashboard.tsx` | `editor` | Definitely implemented | Supports optional `?profileId=`. |
| `/admin/dashboard` | Admin operations | `app/admin/dashboard/page.jsx`, `apps/core/admin/MissionControlDashboard.tsx` | `admin` | Definitely implemented | Client-fetches mission control payload. |
| `/admin/sources` | Admin operations | `app/admin/sources/page.tsx`, `apps/core/admin/SourceCitationManager.tsx` | `admin` | Definitely implemented | Not present in `PAGE_MANIFEST`, but present in protected nav for admins. |

### API / Action Routes With UX Impact

| Route | Method(s) | Area | Evidence | UX impact |
| --- | --- | --- | --- | --- |
| `/api/page-manifest` | GET | Tracking/export | `app/api/page-manifest/route.ts` | Exposes page inventory and metadata for capture tooling. |
| `/api/mock-auth/sign-out` | POST | Auth | `app/api/mock-auth/sign-out/route.js`, `apps/core/auth/src/auth-context.tsx` | Used by mock-mode sign out. |
| `/api/workspace/profile` | GET, PUT | Research workspace | `app/api/workspace/profile/route.ts` | Load/save researcher draft. |
| `/api/workspace/profile/submit` | POST | Research workspace | `app/api/workspace/profile/submit/route.ts` | Submit draft to review. |
| `/api/review` | GET | Editorial review | `app/api/review/route.ts` | Load selected review profile. |
| `/api/review/action` | POST | Editorial review | `app/api/review/action/route.ts` | Approve, flag issue, request changes, send back, publish. |
| `/api/talent/review/action` | POST | Talent portal | `app/api/talent/review/action/route.ts` | Talent approve/request changes. |
| `/api/talent/review/decision` | POST | Talent portal | `app/api/talent/review/decision/route.ts` | Talent accepts/rejects individual changes. |
| `/api/admin/mission-control` | GET | Admin | `app/api/admin/mission-control/route.ts` | Load admin dashboard pipeline data. |
| `/api/admin/sources` | GET | Admin | `app/api/admin/sources/route.ts` | Load source citation database and optional broken-link check. |

### Manifest Entries Without Matching Direct App Route

| Manifest page | Route in manifest | Evidence | Status |
| --- | --- | --- | --- |
| `admin-dashboard` | `/admin/dashboard` | `src/next/pageManifest.js`, `app/admin/dashboard/page.jsx` | Live. |
| `workspace` | `/workspace` | `src/next/pageManifest.js`, `app/workspace/page.tsx` | Live. |
| `review` | `/review` | `src/next/pageManifest.js`, `app/review/page.tsx` | Live. |
| `talent-dash`, `talent-review`, `talent-products`, `talent-earnings`, `talent-settings` | `/portal...` | `src/next/pageManifest.js`, `app/portal/**/page.jsx` | Live. |
| `admin/sources` equivalent | not in manifest | `app/admin/sources/page.tsx`, `apps/core/auth/src/routes.ts` protected nav | Live but missing from manifest/tracking page list. |
| `not-found` | not in manifest | `app/not-found.jsx` passes `page="not-found"` to `SiteFrame` | Live fallback, but `getPageTrackingPayload` marks unknown/non-exportable. |

## SECTION C — Navigation Model

### Global Public Navigation

**Implementation:** `src/components/layout/AppShell.jsx`, `src/data/siteData.js`

The public global nav is a sticky top bar with:

- Logo link to `/`
- Primary nav from `NAV_ITEMS`: `/`, `/about`, `/how-it-works`, `/talent`, `/api`, `/contact`
- Auth CTA that changes by user role:
  - unauthenticated: Sign In and Sign up
  - admin: Admin
  - researcher: Workspace
  - editor: Review
  - talent: Portal
- Sign out button when authenticated
- Switch role button in mock mode
- Responsive tablet horizontal nav row
- Mobile compact menu overlay/dropdown controlled by `mobileMenu`

Footer navigation exposes secondary public routes not present in primary nav:

- `/apply/talent`
- `/developers/api-access`
- `/mission`
- `/security`
- `/privacy`
- `/terms`
- `/licensing`
- `/sign-in`
- `/sign-up`

### Protected Global / Role Navigation

**Implementation:** `src/next/ProtectedShell.jsx`, `apps/core/auth/src/routes.ts`

Protected pages using `ProtectedShell` receive:

- Header with role label, email/session chip, Public Site link, optional Switch Role button, Sign out button.
- Role-specific local/global protected nav:
  - admin: Dashboard, Sources, Review, Portal
  - researcher: Workspace
  - editor: Review
  - talent: Portal, Review Queue, Products, Earnings, Settings

Screens using `ProtectedShell`:

- `/admin/dashboard`
- `/admin/sources`
- `/workspace`
- `/review`

Talent portal screens use `SiteFrame` plus their own portal rail, not `ProtectedShell`, even though `/portal` routes are protected by middleware.

### Talent Portal Local Navigation

**Implementation:** `src/views/TalentPortal.jsx`, `PORTAL_ITEMS` in `src/data/siteData.js`

The portal has an in-page local nav:

- Dashboard -> `/portal`
- Review -> `/portal/review`
- Products -> `/portal/products`
- Earnings -> `/portal/earnings`
- Settings -> `/portal/settings`
- Exit Portal -> `/`

The local nav is an aside on desktop and a horizontal scroll nav on tablet/mobile.

### Tab Structures

Code evidence of tab/tab-like structures:

- `src/views/TalentPage.jsx` uses `role="tablist"` and `role="tab"` for directory filters.
- `src/views/TalentProfile.jsx` uses `role="tablist"`, `role="tab"`, and `role="tabpanel"` for profile content modules.
- `src/views/MarketplacePage.jsx` uses `role="group"` for product type filters rather than tabs.

### Nested Routes

Implemented nested route groups:

- `/talent/[talentId]`
- `/portal/*`
- `/admin/*`
- `/developers/api-access`
- `/apply/talent`
- `/figma-export/[pageId]`
- `/api/**` route handlers

### Modal Routes

No Next.js modal routes or intercepting routes were found.

### Drawers / Overlays / In-Page Modals

Implemented overlays:

- Mobile/compact nav overlay/dropdown in `src/components/layout/AppShell.jsx`.
- Back-to-top floating button in `src/components/layout/AppShell.jsx`.
- Editorial action modal in `apps/core/review/ReviewDashboard.tsx` for `Flag Issue` and `Request Changes`.

No general drawer framework or route-driven drawer was found.

### Page Tracking / Analytics-Like Naming

`src/next/PageTracker.jsx` writes:

- `window.__RICON_PAGE_MANIFEST__`
- `window.__RICON_CURRENT_PAGE__`
- `window.__RICON_PAGE_HISTORY__`
- `ricon:page-track` browser event
- `data-ricon-page`, `data-ricon-page-route`, `data-ricon-page-path`, `data-ricon-page-section`, `data-ricon-figma-frame`, `data-ricon-exportable`

The page definitions live in `src/next/pageManifest.js`. This is the strongest implemented source of product IA metadata.

## SECTION D — Key User Flows

### 1. Public Discovery -> Talent Profile -> Marketplace/API Conversion

**Status: definitely implemented**

Likely path:

1. User lands on `/`.
2. User navigates to `/talent` via global nav or homepage CTA.
3. User opens `/talent/[talentId]`.
4. Profile page exposes CTAs to `/marketplace` and `/developers/api-access`.

Evidence:

- `app/page.jsx`
- `src/views/HomePage.jsx`
- `app/talent/page.jsx`
- `src/views/TalentPage.jsx`
- `app/talent/[talentId]/page.jsx`
- `src/views/TalentProfile.jsx`

### 2. Public Education -> Lead Capture

**Status: definitely implemented as front-end flow**

Likely path:

1. User reads `/how-it-works`, `/data-licensing`, `/digital-experiences`, `/gaming-ai`, `/api`, or `/licensing`.
2. User clicks CTAs to `/apply/talent`, `/developers/api-access`, or `/talent`.
3. User submits an intake form and sees a success acknowledgement.

Evidence:

- `src/views/HowItWorksPage.jsx`
- `src/views/EcosystemVerticalPage.jsx`
- `src/views/ApiPage.jsx`
- `src/views/StaticPage.jsx`
- `app/apply/talent/page.jsx`
- `app/developers/api-access/page.jsx`
- `src/views/LeadCapturePage.jsx`

Validation needed: no server action or API route for lead capture was found, so this is a UI-only conversion flow unless persistence exists outside this repo.

### 3. Auth -> Role-Based Dashboard

**Status: definitely implemented**

Likely path:

1. User visits `/sign-in`, optionally with `?next=/protected/path`.
2. `SignInForm` submits to `app/sign-in/actions.js`.
3. Role is resolved through Supabase or mock auth.
4. `getPostSignInPath` / `getDashboardForRole` routes users to:
   - admin -> `/admin/dashboard`
   - researcher -> `/workspace`
   - editor -> `/review`
   - talent -> `/portal`

Evidence:

- `app/sign-in/page.jsx`
- `src/next/SignInForm.jsx`
- `app/sign-in/actions.js`
- `apps/core/auth/src/auth.ts`
- `apps/core/auth/src/routes.ts`
- `apps/core/auth/src/middleware.ts`

### 4. Researcher Draft -> Save -> Submit for Review

**Status: definitely implemented**

Likely path:

1. Researcher signs in and lands on `/workspace`.
2. Researcher edits profile basics, career timeline, personal history, stats/media, and citations.
3. Workspace auto-saves every 60 seconds when dirty.
4. Researcher manually saves draft or submits for review.
5. Submit calls `/api/workspace/profile/submit`, updates status, and optionally triggers email webhook.
6. Revision history records saved states.

Evidence:

- `app/workspace/page.tsx`
- `apps/core/workspace/ResearchWorkspace.tsx`
- `app/api/workspace/profile/route.ts`
- `app/api/workspace/profile/submit/route.ts`
- `apps/core/workspace/repository.ts`
- `apps/core/workspace/verification.ts`

### 5. Editor Review -> Approve / Request Changes / Flag Issue / Publish

**Status: definitely implemented**

Likely path:

1. Editor signs in and lands on `/review`.
2. Editor selects a submission from the pending queue.
3. Editor reviews fields and citations.
4. Editor approves, flags an issue, requests changes, sends back, or publishes through `/api/review/action`.
5. Audit trail updates.

Evidence:

- `app/review/page.tsx`
- `apps/core/review/ReviewDashboard.tsx`
- `app/api/review/route.ts`
- `app/api/review/action/route.ts`
- `apps/core/review/repository.ts`
- `apps/core/review/types.ts`

### 6. Talent Review -> Accept/Reject Changes -> Approve Profile

**Status: definitely implemented, with some static/mock content**

Likely path:

1. Talent signs in and lands on `/portal`.
2. Talent opens `/portal/review`.
3. Talent reviews diff cards.
4. Talent accepts/rejects individual module changes through `/api/talent/review/decision`.
5. Talent approves the profile or requests changes through `/api/talent/review/action`.

Evidence:

- `app/portal/review/page.jsx`
- `src/views/TalentPortal.jsx`
- `src/components/RevisionDiffView.tsx`
- `app/api/talent/review/decision/route.ts`
- `app/api/talent/review/action/route.ts`

Validation needed: `TalentPortal` currently hard-codes Jason Kidd and local diff items, so data binding to live profile review payloads needs validation.

### 7. Admin Mission Control -> Open Work/Review Item

**Status: definitely implemented**

Likely path:

1. Admin signs in and lands on `/admin/dashboard`.
2. Admin views pipeline stage summaries and bottleneck state.
3. Admin opens a profile.
4. Draft profiles link to `/workspace?profileId=...`; other stages link to `/review?profileId=...`.

Evidence:

- `app/admin/dashboard/page.jsx`
- `apps/core/admin/MissionControlDashboard.tsx`
- `app/api/admin/mission-control/route.ts`
- `apps/core/admin/repository.ts`

Validation needed: `/workspace/page.tsx` currently ignores query params and always loads `jason-kidd`; `/api/workspace/profile` supports `profileId`, but the page route does not consume it. This means admin links to `/workspace?profileId=...` may not open the intended profile.

### 8. Admin Source Citation Audit

**Status: definitely implemented**

Likely path:

1. Admin opens `/admin/sources` from protected nav or Mission Control button.
2. Admin reviews total, duplicate, and broken link counts.
3. Admin runs broken link detection.
4. Admin opens profile usage links into `/review?profileId=...`.

Evidence:

- `app/admin/sources/page.tsx`
- `apps/core/admin/SourceCitationManager.tsx`
- `app/api/admin/sources/route.ts`
- `apps/core/sources/repository.ts`

### 9. Design Capture / Figma Export

**Status: implemented, likely internal tooling**

Likely path:

1. Tooling reads `/api/page-manifest`.
2. Tooling opens `/figma-export/[pageId]`.
3. Page renders with stable `data-ricon-*` attributes and Figma capture script.

Evidence:

- `src/next/pageManifest.js`
- `app/api/page-manifest/route.ts`
- `app/figma-export/[pageId]/page.tsx`
- `src/next/PageTracker.jsx`
- `README.md`

## SECTION E — Screen States and Edge Cases

### Loading States

Implemented:

- Global app loading skeleton: `app/loading.tsx`.
- Review route loading skeleton: `app/review/loading.tsx`.
- Lazy route fallback skeleton: `src/components/feedback/RouteFallback.jsx`.
- Loading primitives: `src/components/feedback/LoadingState.tsx`.
- Admin mission control loading: `apps/core/admin/MissionControlDashboard.tsx`.
- Review dashboard pending action loading: `apps/core/review/ReviewDashboard.tsx`.
- Research workspace save/submit pending text: `apps/core/workspace/ResearchWorkspace.tsx`.
- Sign-in submit pending text: `src/next/SignInForm.jsx`.

### Empty States

Implemented:

- Marketplace/product filters likely produce filtered empty state via `src/views/MarketplacePage.jsx`.
- Talent portal products shows `EmptyState` when no products are queued in `src/views/TalentPortal.jsx`.
- Review queue shows “No reviews pending.” in `apps/core/review/ReviewDashboard.tsx`.
- Review selected submission pane prompts user to select a profile when no selected profile exists in `apps/core/review/ReviewDashboard.tsx`.
- Review audit trail shows no-audit copy in `apps/core/review/ReviewDashboard.tsx`.
- Research workspace revision history shows no-revisions copy in `apps/core/workspace/ResearchWorkspace.tsx`.
- Admin dashboard shows “No profiles yet.” in `apps/core/admin/MissionControlDashboard.tsx`.

### Error States

Implemented:

- Global 500 fallback: `app/global-error.tsx`.
- Review-specific error boundary: `app/review/error.tsx`.
- 404: `app/not-found.jsx`.
- Sign-in form alert: `src/next/SignInForm.jsx`.
- Contact form error status: `src/views/ContactPage.jsx`.
- Admin mission control fetch error: `apps/core/admin/MissionControlDashboard.tsx`.
- Admin source manager fetch error: `apps/core/admin/SourceCitationManager.tsx`.
- Review dashboard fetch/action error: `apps/core/review/ReviewDashboard.tsx`.
- Talent portal review/action errors: `src/views/TalentPortal.jsx`.
- Workspace save/submit errors: `apps/core/workspace/ResearchWorkspace.tsx`.
- API routes return 400/403/500 JSON errors across workspace, review, talent, and admin route handlers.

### Success States

Implemented:

- Lead capture acknowledgement in `src/views/LeadCapturePage.jsx`.
- Contact form success in `src/views/ContactPage.jsx`.
- Newsletter join status in `src/components/layout/AppShell.jsx`.
- Forgot password status in `src/views/ForgotPasswordPage.jsx`.
- Sign-up status in `src/views/SignUpPage.jsx`.
- Talent portal settings saved feedback in `src/views/TalentPortal.jsx`.
- Talent portal review decision/action success messages in `src/views/TalentPortal.jsx`.
- Workspace save/submit success messages in `apps/core/workspace/ResearchWorkspace.tsx`.
- Review dashboard action notices in `apps/core/review/ReviewDashboard.tsx`.

### Permission Denied / Auth Redirect States

Implemented mostly as redirects or null responses:

- Middleware redirects unauthenticated protected route access to `/sign-in?next=...` in `apps/core/auth/src/middleware.ts`.
- Middleware redirects authenticated users with wrong roles to their role dashboard in `apps/core/auth/src/middleware.ts`.
- `/review` redirects to `/sign-in?next=/review` if `requireEditorAccess()` fails in `app/review/page.tsx`.
- `/admin/sources` redirects to `/sign-in?next=/admin/sources` if `requireAdminAccess()` fails in `app/admin/sources/page.tsx`.
- `/workspace` returns `null` if `requireResearcherAccess()` fails in `app/workspace/page.tsx`; middleware should normally prevent this, but direct server fallback is blank.
- API routes return `{ error: "Forbidden" }` with 403 for unauthorized admin, workspace, review, and talent actions.

No dedicated user-facing “permission denied” page was found.

### Onboarding States

Implemented:

- `/sign-up` describes account creation and role selection in `src/views/SignUpPage.jsx`.
- `/apply/talent` and `/developers/api-access` are beta/wait-list intake/onboarding screens using `src/views/LeadCapturePage.jsx`.
- `/sign-in` copy references verification-aware onboarding and mock mode in `app/sign-in/page.jsx`.

Likely incomplete:

- There is no multi-step onboarding route or wizard found.
- Sign-up appears UI-oriented; persistence and email verification behavior need validation through `src/views/SignUpPage.jsx` and auth backend.

### Confirmation / Destructive / Warning States

Implemented:

- Review dashboard modal confirmation for `Flag Issue` and `Request Changes` in `apps/core/review/ReviewDashboard.tsx`.
- Workspace verification blocking and low-quality source warning banners in `apps/core/workspace/ResearchWorkspace.tsx` and `apps/core/workspace/verification.ts`.
- Talent review reject/accept states and “Request Changes” actions in `src/views/TalentPortal.jsx`.
- Admin Mission Control bottleneck warning state in `apps/core/admin/MissionControlDashboard.tsx`.
- Source manager duplicate/broken link warning chips in `apps/core/admin/SourceCitationManager.tsx`.

No explicit destructive delete confirmation flow was found. Workspace remove-item buttons exist for content arrays, but no confirmation modal was found.

## SECTION F — Flags, Permissions, and Conditional Experiences

### Role-Based Access

Implemented role model:

- Roles: `admin`, `researcher`, `editor`, `talent`
- Role dashboards:
  - admin -> `/admin/dashboard`
  - researcher -> `/workspace`
  - editor -> `/review`
  - talent -> `/portal`
- Route rules:
  - `/admin` -> admin
  - `/workspace` -> researcher
  - `/review` -> editor
  - `/portal` -> admin or talent

Evidence:

- `apps/core/auth/src/routes.ts`
- `apps/core/auth/src/permissions.ts`
- `apps/core/auth/src/middleware.ts`
- `apps/core/auth/src/role.ts`

### Admin-Only

Definitely admin-only:

- `/admin/dashboard`
- `/admin/sources`
- `/api/admin/mission-control`
- `/api/admin/sources`

Evidence:

- `apps/core/admin/repository.ts`
- `app/admin/dashboard/page.jsx`
- `app/admin/sources/page.tsx`
- `app/api/admin/mission-control/route.ts`
- `app/api/admin/sources/route.ts`

### Auth-Only / Protected

Protected by middleware and/or server access checks:

- `/admin/*`
- `/workspace`
- `/review`
- `/portal/*`

Protected action APIs:

- `/api/workspace/profile`
- `/api/workspace/profile/submit`
- `/api/review`
- `/api/review/action`
- `/api/talent/review/action`
- `/api/talent/review/decision`
- `/api/admin/mission-control`
- `/api/admin/sources`

### Feature-Flagged / Environment-Gated

No explicit feature flag framework was found.

Environment-gated behavior exists:

- Supabase auth enabled/disabled via auth env checks in `apps/core/auth/src/env.ts` and used by `app/sign-in/page.jsx`, `src/next/SignInForm.jsx`, `src/components/layout/AppShell.jsx`, and middleware.
- Mock auth mode when Supabase env is absent in `apps/core/auth/src/mock.ts`.
- Workspace persistence switches between live and mock depending on Sanity/Supabase env in `apps/core/workspace/repository.ts`, `apps/core/workspace/env.ts`, `apps/core/workspace/mock-store.ts`.
- Review payloads expose `persistenceMode: "mock" | "live"` in `apps/core/review/types.ts` and repository code.
- Optional email webhook is referenced by workspace/review notifications, with UI copy when not configured.

### Deprecated / Legacy / Partially Implemented

Likely legacy or partially implemented:

- `dist/` exists alongside the Next app. It appears to be build output/legacy artifact, not source for current routing.
- `public/_redirects` contains `/* /index.html 200`, which is SPA-style Netlify routing and likely legacy or irrelevant for the current Next App Router deployment.
- `src/views/StaticPage.jsx` contains content entries for `how-it-works` and `contact`, but the live app routes use dedicated `HowItWorksPage.jsx` and `ContactPage.jsx`. These content entries appear legacy/unused.
- `src/next/RoleDashboard.jsx` is imported in `app/figma-export/[pageId]/page.tsx` but no switch case renders it. It appears unused.
- `/admin/sources` is live but missing from `src/next/pageManifest.js`, so tracking/export metadata is incomplete for that screen.
- `/workspace?profileId=...` is linked from admin Mission Control, but `app/workspace/page.tsx` always loads `"jason-kidd"` and does not consume `searchParams`. The API route supports `profileId`, so page-level query handling appears incomplete.
- API key management is explicitly labeled mock in `src/views/ApiPage.jsx`.
- Privacy and Terms content are placeholders in `src/views/StaticPage.jsx`.
- Product approval buttons in talent portal products do not appear to call an API in `src/views/TalentPortal.jsx`.
- Talent portal is hard-coded to `TALENT[0]` and local diff items in `src/views/TalentPortal.jsx`, so live per-talent binding needs validation.

### Experimental / Beta

Evidence of beta/experimental positioning:

- Global nav displays a `beta` badge in `src/components/layout/AppShell.jsx`.
- Home page copy references “Live beta” and beta intake in `src/views/HomePage.jsx`.
- `/apply/talent` copy says “Talent beta wait-list” in `app/apply/talent/page.jsx`.
- `/developers/api-access` copy says “developer beta” in `app/developers/api-access/page.jsx`.

## SECTION G — Unknowns / Assumptions / Validation Needed

### Unknowns

- No test files or story files were found, so there is no test-backed confirmation of intended journeys.
- No explicit analytics vendor integration was found. The implemented tracking model is first-party DOM/window metadata and custom `ricon:page-track` events in `src/next/PageTracker.jsx`.
- No feature flag service or config file was found.
- No dedicated permission-denied page was found.
- No route-level modal/intercepting routes were found.
- Lead capture form persistence for `/apply/talent` and `/developers/api-access` was not found.
- Contact form persistence was not found.
- Sign-up persistence/email verification behavior needs validation in code beyond the visible `SignUpPage` component.

### Validation Needed

- Validate `/workspace?profileId=...` behavior. Admin Mission Control links draft profiles to this URL, but `app/workspace/page.tsx` does not read `searchParams`.
- Validate `/portal` data binding. `src/views/TalentPortal.jsx` uses `TALENT[0]`, static products, local diff fixtures, and `localStorage` settings.
- Validate product approval actions in `/portal/products`; approve/request buttons currently appear UI-only.
- Validate privacy/terms readiness before production because both pages contain placeholder copy.
- Validate whether `public/_redirects` and `dist/` are historical artifacts or still part of deployment.
- Decide whether `/admin/sources` should be added to `src/next/pageManifest.js` and `/figma-export/[pageId]`.
- Decide whether `src/next/RoleDashboard.jsx` should be removed, wired into export tooling, or retained as a debugging utility.
- Validate Supabase, Sanity, and webhook env configurations in deployed environments; many core flows switch between live and mock behavior based on env presence.
- Validate whether `/figma-export/[pageId]` should be protected or hidden from public deployments. It can render mock-auth versions of protected screens.

### Assumptions Made

- “User-facing route” includes routes that render pages in `app/**/page.*`; API route handlers are listed separately because they affect visible flows but do not render screens.
- “Definitely implemented” means a route/page/component exists and is reachable from the Next App Router or navigation code.
- “Likely implemented but needs validation” means code exists but there is evidence of mock/static data, env-gated persistence, missing query handling, or UI-only interaction.
- “Referenced in code but unclear if live” means a component, manifest entry, or artifact exists but is not clearly routed, navigated, or used in the current App Router.
