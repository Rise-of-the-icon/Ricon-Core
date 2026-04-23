# Codebase vs Prototype UX Architecture Reconciliation

Status: **provisional / prototype source not available in this workspace**

This reconciliation compares the codebase-derived screen inventory against the requested “prototype-derived intended experience.” I could not find a prototype-derived screen list, Figma export, design spec, or intended-experience document in the repository. Because of that, this document is conservative:

- It does **not** claim any screen is in both code and prototype unless there is prototype evidence.
- It treats all code-confirmed screens as **prototype-unverified**.
- It leaves “prototype only” empty until a prototype source is supplied.
- It identifies likely missing design coverage from hidden/code-only states.
- It identifies likely missing engineering implementation from code gaps that commonly correspond to intended product behavior, but marks those as validation candidates.

## Sources Used

### Codebase-Derived Sources

- `UX_ARCHITECTURE_AUDIT.md`
- `NORMALIZED_SCREEN_INVENTORY.md`
- `PRIMARY_USER_FLOWS.md`
- `UX_ARCHITECTURE_FIGJAM_HANDOFF.md`
- Route files under `app/**/page.*`
- Route handlers under `app/api/**/route.*`
- Navigation and route metadata in `src/next/pageManifest.js`, `src/components/layout/AppShell.jsx`, `src/next/ProtectedShell.jsx`, `apps/core/auth/src/routes.ts`

### Prototype-Derived Sources

- **Not available in repository search.**
- No file or artifact matching prototype/design/Figma intended screen inventory was found beyond code-generated Figma export support and the code-derived markdown artifacts created during this audit.

## Comparison Buckets

### 1. In Code and in Prototype

**Current status: cannot confirm.**

No prototype-derived source was available, so no parity can be asserted. The following screens are strong candidates for parity review because they are primary product surfaces in code and should normally be represented in a prototype:

| Candidate Screen | Code Evidence | Prototype Evidence | Reconciliation Status | Notes |
| --- | --- | --- | --- | --- |
| Public Marketing / Home / Home | `app/page.jsx`, `src/views/HomePage.jsx` | Not provided | Needs validation | Primary public entry point. |
| Talent Discovery / Directory / Talent Directory | `app/talent/page.jsx`, `src/views/TalentPage.jsx` | Not provided | Needs validation | Search/browse/detail loop begins here. |
| Talent Discovery / Profile / Talent Profile | `app/talent/[talentId]/page.jsx`, `src/views/TalentProfile.jsx` | Not provided | Needs validation | Core public profile detail. |
| Auth and Account / Sign In / Sign In | `app/sign-in/page.jsx`, `src/next/SignInForm.jsx` | Not provided | Needs validation | Includes mock-role and next-path states. |
| Talent Portal / Dashboard / Portal Dashboard | `app/portal/page.jsx`, `src/views/TalentPortal.jsx` | Not provided | Needs validation | Role-protected talent surface. |
| Research Workspace / Workspace / Research Workspace | `app/workspace/page.tsx`, `apps/core/workspace/ResearchWorkspace.tsx` | Not provided | Needs validation | Core researcher workflow. |
| Editorial Review / Queue / Review Queue Dashboard | `app/review/page.tsx`, `apps/core/review/ReviewDashboard.tsx` | Not provided | Needs validation | Core editor workflow. |
| Admin Operations / Mission Control / Mission Control | `app/admin/dashboard/page.jsx`, `apps/core/admin/MissionControlDashboard.tsx` | Not provided | Needs validation | Admin operations hub. |
| Admin Operations / Sources / Source Citation Manager | `app/admin/sources/page.tsx`, `apps/core/admin/SourceCitationManager.tsx` | Not provided | Needs validation | Live admin route but missing from page manifest/export. |

### 2. In Code Only

These are implemented or referenced in code, but prototype coverage is unverified. Treat as **code-only until prototype evidence is supplied**.

| Code-Confirmed Screen / State | Code Evidence | Why It May Be Code-Only | Reconciliation Status |
| --- | --- | --- | --- |
| Public Marketing / Legal / Privacy / Placeholder | `app/privacy/page.jsx`, `src/views/StaticPage.jsx` | Placeholder policy content is likely not final design intent. | Code only / needs validation |
| Public Marketing / Legal / Terms / Placeholder | `app/terms/page.jsx`, `src/views/StaticPage.jsx` | Placeholder terms content is likely not final design intent. | Code only / needs validation |
| Developer/API / Docs / API Docs / API Key Management Mock | `src/views/ApiPage.jsx` | Explicitly labeled mock; likely not final implementation/design. | Code only / likely partial |
| Auth and Account / Sign In / Mock Role Picker | `src/next/SignInForm.jsx`, `apps/core/auth/src/mock.ts` | Environment-gated dev/mock behavior may not be intended production UX. | Code only / hidden complexity |
| Auth and Account / Sign In / Switch Role Mode | `app/sign-in/page.jsx`, `src/next/SignInForm.jsx`, `src/next/ProtectedShell.jsx` | Mock-mode utility; likely absent from public prototype. | Code only / hidden complexity |
| Talent Portal / Review / Content Review fixture diffs | `src/views/TalentPortal.jsx` | Uses hard-coded diff items rather than live payload. | Code only / likely partial |
| Talent Portal / Products / Product Review | `src/views/TalentPortal.jsx` | Product actions appear UI-only; no API action found. | Code only / likely partial |
| Talent Portal / Earnings / Earnings | `src/views/TalentPortal.jsx` | Values appear static/mock. | Code only / likely partial |
| Talent Portal / Settings / Save Feedback | `src/views/TalentPortal.jsx` | Saves to `localStorage`, not backend. | Code only / likely partial |
| Research Workspace / Auth Fallback / Blank Access Failure | `app/workspace/page.tsx` | Failed access returns `null`; likely not an intended designed state. | Code only / mismatch candidate |
| Editorial Review / System / Loading | `app/review/loading.tsx` | Route-specific skeleton may be engineering-only unless represented in prototype. | Code only / hidden state |
| Editorial Review / System / Error | `app/review/error.tsx` | Dedicated error boundary may not be in prototype. | Code only / hidden state |
| Admin Operations / Mission Control / Loading | `apps/core/admin/MissionControlDashboard.tsx` | Client loading skeleton state. | Code only / hidden state |
| Admin Operations / Sources / Broken Link Detection Running | `apps/core/admin/SourceCitationManager.tsx` | Operational state likely easy to miss in design. | Code only / hidden state |
| System Fallback / Not Found / Custom 404 | `app/not-found.jsx` | Often absent from prototypes. | Code only / hidden state |
| System Fallback / Error / Global Error | `app/global-error.tsx` | Often absent from prototypes. | Code only / hidden state |
| Design Tooling / Page Capture / Figma Export Page | `app/figma-export/[pageId]/page.tsx` | Internal tooling route, not product UX. | Code only / tooling |
| Design Tooling / Tracking / Page Tracking Metadata | `src/next/PageTracker.jsx` | Instrumentation, not visible product UX. | Code only / tooling |
| Legacy/Unclear / Debug/Unused / RoleDashboard | `src/next/RoleDashboard.jsx` | Imported but not rendered by export switch. | Code only / unclear or stale |
| Legacy/Unclear / Dist SPA Output | `dist/`, `public/_redirects` | Current app is Next App Router; artifact appears legacy. | Code only / stale candidate |

### 3. In Prototype Only

**Current status: cannot identify.**

No prototype-derived source was available. This bucket should be populated after reviewing a Figma/prototype screen list, FigJam board, clickable prototype, or product requirements artifact.

| Prototype Screen / Intended Experience | Prototype Evidence | Code Evidence | Reconciliation Status |
| --- | --- | --- | --- |
| Unknown | Not provided | Not assessed | Blocked pending prototype source |

High-priority prototype-only checks once a prototype is supplied:

- Any onboarding wizard beyond `/sign-up`, `/apply/talent`, and `/developers/api-access`.
- Any dedicated permission-denied page.
- Any talent profile edit experience outside Research Workspace.
- Any product approval transaction flow beyond current portal buttons.
- Any developer dashboard/API key management production flow.
- Any live earnings/reporting detail screens.
- Any profile ownership/delegate invitation flow.
- Any notifications center or message inbox.
- Any admin user/role management screen.
- Any final legal/privacy/terms content screens.

### 4. Similar but Mismatched

These are code-derived mismatch candidates. They require prototype comparison before final classification.

| Experience | Code Behavior | Potential Prototype / Intended Behavior to Validate | Reconciliation Status |
| --- | --- | --- | --- |
| Workspace profile deep link | Admin dashboard links drafts to `/workspace?profileId=...`, but `app/workspace/page.tsx` always loads `"jason-kidd"`. | Prototype may imply admin can open the selected draft profile. | Similar but mismatched candidate |
| Talent portal review | Portal displays hard-coded Jason Kidd diffs and uses API actions for review decisions. | Prototype may intend a live, per-profile review queue/detail. | Similar but mismatched candidate |
| Talent portal products | Product cards show Approve and Request Changes, but no product action API was found. | Prototype may show transactional product review. | Similar but mismatched candidate |
| Talent settings | Settings save to localStorage only. | Prototype may imply account/profile settings persist server-side. | Similar but mismatched candidate |
| API key management | API page describes key management mock behavior. | Prototype may show production key creation/rotation dashboard. | Similar but mismatched candidate |
| Review actions | API supports `publish` and `editor_send_back`; visible dashboard emphasizes Approve, Request Changes, Flag Issue. | Prototype may include publish/send-back controls. | Similar but mismatched candidate |
| Access denied | Middleware redirects wrong-role users to role dashboard; `/workspace` failed access can return blank. | Prototype may show a designed permission-denied state. | Similar but mismatched candidate |
| Admin Sources | Route exists and protected nav includes it, but page manifest/Figma export omit it. | Prototype may omit this admin tool, or code manifest may be incomplete. | Similar but mismatched candidate |
| Privacy and Terms | Implemented as placeholder static pages. | Prototype/live product may expect finalized legal screens. | Similar but mismatched candidate |
| Figma export route | Export route can render mock-auth protected screens. | Prototype tooling may expect this, but live product likely should hide/protect it. | Similar but mismatched candidate |

### 5. Needs Validation

These items should be validated against the prototype and live product before design/engineering parity is claimed.

| Area | Validation Question | Current Code Evidence | Risk |
| --- | --- | --- | --- |
| Prototype source | What is the authoritative prototype screen list? | No prototype artifact found in repo. | Cannot classify in-prototype vs prototype-only. |
| Lead capture | Are `/apply/talent`, `/developers/api-access`, and `/contact` intended to persist submissions? | `LeadCapturePage`, `ContactPage`; no lead/contact API found. | UI may overstate task completion. |
| Sign-up | Is account creation fully implemented or only UI/status? | `app/sign-up/page.jsx`, `src/views/SignUpPage.jsx`. | Onboarding may be incomplete. |
| Password recovery | Is Supabase recovery wired to `/forgot-password`? | `app/forgot-password/page.jsx`, `src/views/ForgotPasswordPage.jsx`. | Recovery may be UI-only. |
| Role-based auth | Should wrong-role users see permission denied or dashboard redirect? | `apps/core/auth/src/middleware.ts`, `apps/core/auth/src/routes.ts`. | Prototype may not account for role-specific redirects. |
| Talent portal data | Should portal be per-authenticated talent rather than `TALENT[0]`? | `src/views/TalentPortal.jsx`. | Static data may diverge from intended product. |
| Product review | Should product approve/request changes mutate backend state? | `src/views/TalentPortal.jsx`; no product action route found. | Transactional flow missing in engineering. |
| Earnings | What is source of truth for earnings values? | Static values in `src/views/TalentPortal.jsx`. | Reporting flow may be mock. |
| Workspace deep links | Should `/workspace?profileId=...` open selected profile? | Link generated in admin dashboard; page ignores query. | Admin-to-research flow broken/incomplete. |
| Review action scope | Should publish/send-back be visible? | Supported in `app/api/review/action/route.ts`; not primary visible buttons. | Prototype may include omitted controls. |
| Source manager | Should `/admin/sources` be in manifest/export/prototype? | Route exists; manifest omits it. | Missing design coverage or manifest bug. |
| Legal pages | Are Privacy/Terms launch-ready? | Placeholder copy in `src/views/StaticPage.jsx`. | Launch/legal risk. |
| Figma export | Should `/figma-export/[pageId]` be public? | Route exists, no protection seen. | Internal screens may be exposed. |
| Legacy artifacts | Are `dist/` and `_redirects` still used? | `dist/`, `public/_redirects`. | Deployment confusion/stale experience. |

## Likely Missing Design Coverage

These are code-confirmed surfaces/states that are commonly absent from prototypes and should be checked.

1. **Role-specific protected navigation**
   - Admin, researcher, editor, and talent see different protected nav items.
   - Evidence: `src/next/ProtectedShell.jsx`, `apps/core/auth/src/routes.ts`.

2. **Mock-mode auth states**
   - Mock role picker and Switch Role mode.
   - Evidence: `src/next/SignInForm.jsx`, `app/sign-in/page.jsx`.

3. **Protected route recovery**
   - `/sign-in?next=...`, wrong-role dashboard redirect, API 403.
   - Evidence: `apps/core/auth/src/middleware.ts`.

4. **Route-level loading and error states**
   - Global loading, global error, review loading, review error, lazy route fallback.
   - Evidence: `app/loading.tsx`, `app/global-error.tsx`, `app/review/loading.tsx`, `app/review/error.tsx`, `src/components/feedback/RouteFallback.jsx`.

5. **Admin operational states**
   - Mission control loading/error/empty/bottleneck.
   - Source manager broken-link-running, duplicate, broken, unchecked link states.
   - Evidence: `apps/core/admin/MissionControlDashboard.tsx`, `apps/core/admin/SourceCitationManager.tsx`.

6. **Research validation states**
   - Insufficient verification and low-quality source warnings.
   - Evidence: `apps/core/workspace/ResearchWorkspace.tsx`, `apps/core/workspace/verification.ts`.

7. **Review modal states**
   - Request Changes and Flag Issue require comments.
   - Evidence: `apps/core/review/ReviewDashboard.tsx`.

8. **Talent portal local states**
   - Change decision feedback, product empty state, settings localStorage save failure.
   - Evidence: `src/views/TalentPortal.jsx`.

9. **Custom 404 and unknown talent fallback**
   - Evidence: `app/not-found.jsx`, `src/views/TalentProfile.jsx`.

10. **Design tooling route**
   - `/figma-export/[pageId]` renders protected screens under mock auth.
   - Evidence: `app/figma-export/[pageId]/page.tsx`.

## Likely Missing Engineering Implementation

These are not confirmed prototype-only items. They are engineering gaps suggested by implemented UI copy/actions and should be validated against the prototype or product requirements.

1. **Lead/contact form persistence**
   - UI exists; persistence route not found.

2. **Production API key management**
   - API key management is explicitly mock.

3. **Sign-up and password recovery backend completion**
   - Screens exist; live auth workflow needs validation.

4. **Portal live data binding**
   - Portal hard-codes `TALENT[0]` and local diffs.

5. **Portal product approval transactions**
   - Buttons exist; no action route found.

6. **Portal earnings source**
   - Values appear static.

7. **Server-side portal settings persistence**
   - Settings save to localStorage.

8. **Workspace `profileId` routing**
   - Admin links include query param; workspace page ignores it.

9. **Permission denied screen**
   - Redirect/blank/API 403 exist; no designed denied page.

10. **Admin Sources manifest/export coverage**
   - Live route missing from `PAGE_MANIFEST` and Figma export switch.

11. **Final legal pages**
   - Privacy and Terms are placeholders.

## Stale or Deprecated Experience Candidates

| Candidate | Evidence | Why It May Be Stale |
| --- | --- | --- |
| `dist/` build output | `dist/` directory exists next to Next app | Current app source is App Router; may be old SPA output. |
| SPA redirect file | `public/_redirects` contains `/* /index.html 200` | Looks like static SPA fallback, not Next routing. |
| `src/next/RoleDashboard.jsx` | Component exists; imported in Figma export file but not rendered in switch | Debug/placeholder component may be unused. |
| StaticPage `how-it-works` and `contact` content entries | `src/views/StaticPage.jsx`; live routes use dedicated pages | Legacy static content entries likely unused. |
| Mock API key management | `src/views/ApiPage.jsx` | Explicitly mock; likely not final. |
| Placeholder Privacy/Terms | `src/views/StaticPage.jsx` | Content says placeholder/future home. |

## Hidden Complexity: Role-Specific or State-Specific Variations

### Role-Specific Variations

- **Admin**
  - Dashboard: `/admin/dashboard`
  - Sources: `/admin/sources`
  - Can access Review and Portal from protected nav.

- **Researcher**
  - Workspace only from protected nav.
  - Can edit drafts, save, submit for review.

- **Editor**
  - Review dashboard only from protected nav.
  - Can approve, request changes, flag issues; API supports additional actions.

- **Talent**
  - Portal dashboard, review queue, products, earnings, settings.
  - Can approve/request changes and accept/reject review diffs.

### Environment-Specific Variations

- Supabase auth enabled vs mock auth mode.
- Sanity/Supabase workspace persistence vs mock store.
- Review payload `persistenceMode` live vs mock.
- Optional email webhook configured vs not configured.

### State-Specific Variations

- Auth: signed out, signed in, wrong role, missing role, mock switch role.
- Workspace: dirty, saving, saved, autosaving, submit disabled, verification blocked, warning only, submitted.
- Review: empty queue, selected profile, no selected profile, pending action, modal open, action success, action error.
- Admin: loading, empty, bottleneck, fetch error, broken link detection running.
- Portal: review pending, approved, decision accepted/rejected, products empty, settings save success/failure.
- Public: lazy loading, unknown talent, 404, global error, contact success/error, lead acknowledgement.

## Recommended Next Step

Provide one authoritative prototype-derived source, such as:

- Figma file or frame list
- FigJam IA board
- exported prototype screen inventory
- product requirements doc with intended screens and states
- screenshots or screen names from the prototype

Then rerun this reconciliation with actual prototype evidence to populate:

- In code and in prototype
- Prototype only
- Confirmed similar-but-mismatched items
- Confirmed missing design coverage
- Confirmed missing engineering implementation

