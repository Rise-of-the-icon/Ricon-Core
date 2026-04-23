# RICON Primary User Flows and Task Flows

Scope: evidence-supported flows inferred from the implemented Next.js routes, navigation components, auth middleware, protected shells, API actions, and screen composition in this repository.

Confidence scale:

- **High**: route, UI sequence, and action/state handling are all present in code.
- **Medium**: route and UI are present, but data persistence, query handling, or live integration is partial/static/mock.
- **Low**: referenced in code but unclear whether it is live or complete.

## 1. Public Discovery to Talent Profile

**User Goal**  
Find verified talent records and inspect an individual profile.

**Start Point**  
`/`, `/talent`, or global nav “Talent Directory”.

**Steps / Screens in Sequence**

1. User lands on Home at `/`.
2. User selects “Talent Directory” from global nav or a homepage CTA.
3. User reaches `/talent`.
4. User searches/filters/browses talent cards.
5. User opens a profile route: `/talent/[talentId]`.
6. User reviews profile tabs/modules, source context, and CTAs.

**Key Branching Decisions**

- User chooses a talent card from the directory.
- User changes directory filters/search state.
- User switches profile tabs/modules.
- User follows CTA to Marketplace or API access.

**Alternate Paths**

- Direct entry to `/talent`.
- Direct entry to `/talent/[talentId]`.
- Home page talent cards link directly to `/talent/[id]`.

**Exit Points / Outcomes**

- User exits after reading a profile.
- User navigates to `/marketplace`.
- User navigates to `/developers/api-access`.
- User returns to `/talent` or global marketing nav.
- Unknown talent ID produces the profile-level fallback state.

**Dependencies or Assumptions**

- Talent data comes from local `TALENT` records in `src/data/siteData.js`.
- Profile route expects numeric IDs; data is not fetched from a live profile API in the visible code.

**Evidence**

- `app/page.jsx`
- `src/views/HomePage.jsx`
- `app/talent/page.jsx`
- `src/views/TalentPage.jsx`
- `app/talent/[talentId]/page.jsx`
- `src/views/TalentProfile.jsx`
- `src/data/siteData.js`

**Confidence Level**  
High for UI flow; Medium for live data completeness.

## 2. Public Education to Lead Capture

**User Goal**  
Understand the product and submit interest as a talent, developer, or partner.

**Start Point**  
Marketing routes: `/`, `/how-it-works`, `/api`, `/licensing`, `/data-licensing`, `/digital-experiences`, `/gaming-ai`, `/contact`.

**Steps / Screens in Sequence**

1. User reads product/vertical/education content.
2. User selects a CTA such as “Apply as Talent”, “Access API”, “Get API Access”, or “Contact”.
3. User lands on:
   - `/apply/talent`
   - `/developers/api-access`
   - `/contact`
4. User fills the relevant form.
5. User receives a local acknowledgement or success/error message.

**Key Branching Decisions**

- Talent-side path: `/apply/talent`.
- Developer/API path: `/developers/api-access`.
- General inquiry path: `/contact`.
- User may abandon and browse `/talent` instead.

**Alternate Paths**

- Footer links expose `/apply/talent`, `/developers/api-access`, and `/contact`.
- Ecosystem vertical pages link back into intake CTAs.
- API docs page links to sign-in or API access.

**Exit Points / Outcomes**

- Lead capture acknowledgement.
- Contact form success/error feedback.
- User returns to marketing navigation.

**Dependencies or Assumptions**

- `LeadCapturePage` and `ContactPage` show local UI feedback.
- No persistence API route or server action was found for lead capture/contact submission.
- Therefore, form completion is implemented as a front-end UX, but backend workflow is uncertain.

**Evidence**

- `src/views/HowItWorksPage.jsx`
- `src/views/EcosystemVerticalPage.jsx`
- `src/views/StaticPage.jsx`
- `src/views/ApiPage.jsx`
- `app/apply/talent/page.jsx`
- `app/developers/api-access/page.jsx`
- `src/views/LeadCapturePage.jsx`
- `app/contact/page.jsx`
- `src/views/ContactPage.jsx`

**Confidence Level**  
High for UI flow; Medium for task completion because persistence is not evident.

## 3. Sign In and Role-Based Routing

**User Goal**  
Authenticate and land in the correct dashboard for their role.

**Start Point**  
`/sign-in`, global auth CTA, protected-route redirect, or `/sign-in?next=...`.

**Steps / Screens in Sequence**

1. User opens `/sign-in`.
2. Page renders secure access copy and `SignInForm`.
3. User enters email/password.
4. In mock mode, user can choose a role or select a mock profile.
5. Form submits to `signInAction`.
6. Auth resolves through Supabase or mock auth.
7. User is redirected to role dashboard:
   - `admin` -> `/admin/dashboard`
   - `researcher` -> `/workspace`
   - `editor` -> `/review`
   - `talent` -> `/portal`

**Key Branching Decisions**

- Supabase env exists vs. mock mode.
- User has a valid role vs. missing role.
- User arrived with safe `next` path vs. no `next` path.
- Requested `next` path is allowed for user role vs. disallowed.

**Alternate Paths**

- User follows “Forgot password?” to `/forgot-password`.
- User follows “Create account” to `/sign-up`.
- Authenticated user visiting `/sign-in` is redirected away by middleware unless `?switch=1` is allowed in mock mode.
- In mock mode, signed-in users can choose “Switch role”.

**Exit Points / Outcomes**

- Successful dashboard redirect.
- Sign-in error alert.
- Missing-role error alert.
- User navigates to sign-up or password recovery.

**Dependencies or Assumptions**

- Supabase mode depends on Supabase env vars.
- Mock mode is active when Supabase env is absent.
- Role resolution checks user metadata and `public.user_roles`.

**Evidence**

- `app/sign-in/page.jsx`
- `src/next/SignInForm.jsx`
- `app/sign-in/actions.js`
- `apps/core/auth/src/auth.ts`
- `apps/core/auth/src/mock.ts`
- `apps/core/auth/src/routes.ts`
- `apps/core/auth/src/middleware.ts`
- `middleware.ts`

**Confidence Level**  
High.

## 4. Account Creation / Sign-Up

**User Goal**  
Create an account and begin onboarding.

**Start Point**  
`/sign-up`, sign-in “Create account”, global unauthenticated “Sign up” CTA, footer link.

**Steps / Screens in Sequence**

1. User opens `/sign-up`.
2. User fills sign-up fields.
3. User chooses or confirms a role, with Talent positioned as default.
4. User submits.
5. Page displays a status message.

**Key Branching Decisions**

- User selects Talent vs. another role.
- Submission succeeds vs. local validation/error state.

**Alternate Paths**

- User returns to `/sign-in`.
- User uses `/apply/talent` instead of account creation for beta wait-list intake.

**Exit Points / Outcomes**

- Sign-up feedback/status message.
- User navigates to sign-in.

**Dependencies or Assumptions**

- The visible code supports the sign-up screen and feedback UI.
- Backend account creation details are uncertain from the reviewed files.

**Evidence**

- `app/sign-up/page.jsx`
- `src/views/SignUpPage.jsx`
- `src/next/SignInForm.jsx`
- `src/components/layout/AppShell.jsx`

**Confidence Level**  
Medium.

## 5. Password Recovery

**User Goal**  
Recover account access after forgetting a password.

**Start Point**  
`/forgot-password`, linked from sign-in form.

**Steps / Screens in Sequence**

1. User opens `/sign-in`.
2. User selects “Forgot password?”.
3. User lands on `/forgot-password`.
4. User enters email.
5. Page displays local status feedback.
6. User can return to sign-in.

**Key Branching Decisions**

- Email provided vs. missing/invalid local state.
- User returns to sign-in vs. exits.

**Alternate Paths**

- Direct entry to `/forgot-password`.

**Exit Points / Outcomes**

- Password recovery status message.
- Return to `/sign-in`.

**Dependencies or Assumptions**

- Recovery UI exists.
- Backend password recovery integration is not clearly evidenced in the visible page component.

**Evidence**

- `app/forgot-password/page.jsx`
- `src/views/ForgotPasswordPage.jsx`
- `src/next/SignInForm.jsx`

**Confidence Level**  
Medium.

## 6. Protected Route Redirect and Access Recovery

**User Goal**  
Access a protected screen, authenticate if needed, and recover from wrong-role access.

**Start Point**  
Any protected route:

- `/admin/*`
- `/workspace`
- `/review`
- `/portal/*`

**Steps / Screens in Sequence**

1. User opens protected route.
2. Middleware checks auth and required roles.
3. If unauthenticated, user is redirected to `/sign-in?next=<requestedPath>`.
4. Sign-in page displays “Sign in to continue to...” message.
5. User signs in.
6. Middleware/action redirects user to requested path if role allows it, otherwise to their role dashboard.

**Key Branching Decisions**

- Unauthenticated vs. authenticated.
- User role matches route rule vs. does not match.
- Requested `next` path is safe internal path vs. unsafe/ignored.

**Alternate Paths**

- Authenticated user with wrong role is redirected to their role dashboard.
- User can switch role in mock mode.
- API requests receive JSON `403 Forbidden` instead of page redirect.

**Exit Points / Outcomes**

- Successful protected screen access.
- Role dashboard fallback.
- Sign-in error.
- API 403.

**Dependencies or Assumptions**

- Middleware matcher covers `/admin/:path*`, `/workspace/:path*`, `/portal/:path*`, `/login`, `/sign-in`.
- `/review` is role-protected by route rules and the server page access check, though it is not listed in the middleware `matcher` shown in code. The page itself redirects if `requireEditorAccess()` fails.
- `/workspace` page returns `null` on failed server access check, relying on middleware for normal redirect behavior.

**Evidence**

- `apps/core/auth/src/middleware.ts`
- `apps/core/auth/src/routes.ts`
- `app/sign-in/page.jsx`
- `app/review/page.tsx`
- `app/workspace/page.tsx`
- `apps/core/admin/repository.ts`
- API route files under `app/api/**/route.ts`

**Confidence Level**  
High for middleware/page behavior; Medium for `/workspace` failed-access UX.

## 7. Researcher Draft Profile and Submit for Review

**User Goal**  
Build a verified biographical profile with citations and submit it for editorial review.

**Start Point**  
Researcher dashboard route `/workspace`.

**Steps / Screens in Sequence**

1. Researcher signs in and lands on `/workspace`.
2. Workspace loads initial payload for a profile.
3. Researcher edits Profile Basics.
4. Researcher edits Career Timeline.
5. Researcher edits Personal History.
6. Researcher edits Stats and Media.
7. Researcher adds citations, reliability scores, notes, and additional sources.
8. Researcher reviews diff entries against the saved baseline.
9. Researcher resolves or notes validation issues.
10. Researcher saves draft manually or waits for autosave.
11. Researcher submits for review.
12. Workspace updates status and shows submit feedback.

**Key Branching Decisions**

- Draft has unsaved changes vs. clean state.
- Profile passes verification vs. blocking issues.
- Low-quality source warnings exist vs. no warnings.
- Submit notification webhook configured vs. not configured.
- Save/submit request succeeds vs. returns error.

**Alternate Paths**

- Researcher can add or remove career/history/stat/media items.
- Researcher can accept/reject diff entries before saving.
- Autosave runs every 60 seconds while dirty.
- Admin Mission Control can link to `/workspace?profileId=...`, but page-level query handling appears incomplete.

**Exit Points / Outcomes**

- Draft saved.
- Autosave saved.
- Submit for review completed.
- Submit blocked by verification issues.
- Save/submit error shown.

**Dependencies or Assumptions**

- Requires `researcher` role.
- Page currently calls `getWorkspacePayload("jason-kidd", ...)`; it does not consume `searchParams`.
- Persistence is environment-gated: Sanity/Supabase live mode or mock store fallback.
- Email webhook is optional.

**Evidence**

- `app/workspace/page.tsx`
- `apps/core/workspace/ResearchWorkspace.tsx`
- `apps/core/workspace/auth.ts`
- `apps/core/workspace/repository.ts`
- `apps/core/workspace/verification.ts`
- `app/api/workspace/profile/route.ts`
- `app/api/workspace/profile/submit/route.ts`
- `README.md`

**Confidence Level**  
High for core workspace task flow; Medium for multi-profile routing and live persistence.

## 8. Editor Review Submission and Decide Outcome

**User Goal**  
Review researcher-submitted profiles, inspect citations, and move profiles through editorial workflow.

**Start Point**  
Editor dashboard route `/review`.

**Steps / Screens in Sequence**

1. Editor signs in and lands on `/review`.
2. Review dashboard loads queue payload.
3. Editor selects a queue item.
4. Editor inspects selected submission fields:
   - name
   - date of birth
   - career timeline
   - personal history
   - stats
   - media
   - source citations
5. Editor reviews audit trail.
6. Editor chooses an action:
   - Approve
   - Request Changes
   - Flag Issue
7. Request Changes and Flag Issue open a modal requiring a comment.
8. Action submits to `/api/review/action`.
9. Dashboard updates payload and shows notice/error/loading state.

**Key Branching Decisions**

- Queue has items vs. empty queue.
- Selected profile exists vs. no selection.
- Profile status is `in_review` vs. action disabled.
- Editor approves directly vs. opens modal for request/flag.
- Email notification configured vs. not configured for change requests.
- API succeeds vs. fails.

**Alternate Paths**

- Direct entry with `/review?profileId=...`.
- Admin Source Citation Manager links to `/review?profileId=...`.
- Admin Mission Control links non-draft profiles to `/review?profileId=...`.
- API supports `editor_send_back` and `publish`, though the visible dashboard buttons are Approve, Request Changes, and Flag Issue.

**Exit Points / Outcomes**

- Profile approved and moved to talent review.
- Changes requested from researcher.
- Issue flagged in audit trail.
- Profile published if action is triggered through supported API path.
- Error banner shown.
- Empty queue state.

**Dependencies or Assumptions**

- Requires `editor` role.
- Review data comes from live or mock repository depending on environment.
- Some action types are supported in API/repository but not necessarily exposed as primary visible buttons.

**Evidence**

- `app/review/page.tsx`
- `apps/core/review/ReviewDashboard.tsx`
- `apps/core/review/auth.ts`
- `apps/core/review/repository.ts`
- `apps/core/review/types.ts`
- `app/api/review/route.ts`
- `app/api/review/action/route.ts`
- `app/review/loading.tsx`
- `app/review/error.tsx`

**Confidence Level**  
High.

## 9. Talent Reviews Profile Changes and Approves or Requests Changes

**User Goal**  
Review proposed profile changes and approve the profile or request revisions.

**Start Point**  
Talent portal route `/portal/review`.

**Steps / Screens in Sequence**

1. Talent signs in and lands on `/portal` or navigates to `/portal/review`.
2. Portal local nav highlights Review.
3. User reviews diff cards for Biography and Career Timeline.
4. User accepts or rejects individual module changes.
5. UI shows decision status badges.
6. User approves profile or requests changes.
7. Portal shows success/error status.

**Key Branching Decisions**

- Accept individual field/module change vs. reject it.
- Approve whole profile vs. request changes.
- API succeeds vs. returns error.
- Review already approved vs. action disabled.

**Alternate Paths**

- Admin role can access `/portal` according to route rules.
- User can move to Products, Earnings, Settings, or exit portal.

**Exit Points / Outcomes**

- Individual change decision saved.
- Profile approved.
- Changes requested and profile sent back to draft.
- Review error shown.

**Dependencies or Assumptions**

- Requires `talent` or `admin` route role.
- `TalentPortal` hard-codes `TALENT[0]` and local diff fixture data.
- API routes are real and protected, but the visible diff payload does not appear to be dynamically loaded from review repository data.

**Evidence**

- `app/portal/review/page.jsx`
- `src/views/TalentPortal.jsx`
- `src/components/RevisionDiffView.tsx`
- `app/api/talent/review/decision/route.ts`
- `app/api/talent/review/action/route.ts`
- `apps/core/talent/auth.ts`
- `apps/core/auth/src/routes.ts`

**Confidence Level**  
Medium.

## 10. Talent Manages Portal Settings and Privacy Controls

**User Goal**  
Control profile visibility, data sharing, delegate access, and notifications.

**Start Point**  
`/portal/settings`.

**Steps / Screens in Sequence**

1. Talent opens `/portal/settings`.
2. User edits Module Visibility toggles.
3. User edits Data Sharing Controls.
4. User enters Delegate Access emails and approval requirement.
5. User edits Notification Preferences.
6. User clicks Save Settings.
7. UI shows saved or unable-to-save feedback.

**Key Branching Decisions**

- Browser localStorage is available vs. unavailable/corrupt.
- User toggles each permission on/off.
- User enters delegate emails or leaves blank.

**Alternate Paths**

- User can navigate among portal sections via local portal nav.
- User can exit portal to public home.

**Exit Points / Outcomes**

- Settings saved locally.
- Save error if localStorage write fails.

**Dependencies or Assumptions**

- Settings persist only in browser `localStorage`.
- No backend settings API was found.
- Portal is tied to hard-coded `TALENT[0]`.

**Evidence**

- `app/portal/settings/page.jsx`
- `src/views/TalentPortal.jsx`
- `src/data/siteData.js`
- `apps/core/auth/src/routes.ts`

**Confidence Level**  
Medium.

## 11. Talent Reviews Products and Earnings

**User Goal**  
Review products built from verified data and understand earnings.

**Start Point**  
`/portal/products` or `/portal/earnings`.

**Steps / Screens in Sequence**

1. Talent opens `/portal/products`.
2. User sees pending/approved/live product summary badges.
3. User reviews product cards.
4. User can click Approve or Request Changes on product cards.
5. User opens `/portal/earnings`.
6. User reviews revenue stats and revenue by module.

**Key Branching Decisions**

- Products exist for current talent vs. empty product queue.
- User clicks product Approve/Request Changes vs. only browses.

**Alternate Paths**

- User navigates from dashboard notifications into Review/Products conceptually, though notification cards are not linked in the visible code.
- User switches to Settings or exits portal.

**Exit Points / Outcomes**

- Product review action button clicked.
- Empty product state shown.
- Earnings reviewed.

**Dependencies or Assumptions**

- Product and earnings data appear static/local.
- Product approve/request buttons do not call APIs in the reviewed code.

**Evidence**

- `app/portal/products/page.jsx`
- `app/portal/earnings/page.jsx`
- `src/views/TalentPortal.jsx`
- `src/data/siteData.js`

**Confidence Level**  
Medium for UI browsing; Low for transactional product actions.

## 12. Admin Monitors Pipeline and Opens Work Items

**User Goal**  
Understand operational pipeline health and open profiles requiring action.

**Start Point**  
Admin dashboard route `/admin/dashboard`.

**Steps / Screens in Sequence**

1. Admin signs in and lands on `/admin/dashboard`.
2. Dashboard fetches `/api/admin/mission-control`.
3. Admin reviews stage summaries: Draft, In Review, Talent Review, Approved.
4. Admin reviews bottleneck/healthy state.
5. Admin reviews system health and active profiles.
6. Admin opens a profile:
   - Draft -> `/workspace?profileId=<id>`
   - Other stages -> `/review?profileId=<id>`
7. Admin can open Source Citation Manager.

**Key Branching Decisions**

- Payload loads vs. error.
- Pipeline has profiles vs. empty state.
- Stage is `draft` vs. other stage.
- Bottleneck exists vs. no bottlenecks.

**Alternate Paths**

- Protected admin nav can take admin to Sources, Review, or Portal.

**Exit Points / Outcomes**

- Admin opens workspace/review route.
- Admin opens `/admin/sources`.
- Loading/error/empty state shown.

**Dependencies or Assumptions**

- Requires `admin` role.
- Data comes from Supabase/Sanity-backed workspace sources or mock store depending on env.
- `/workspace?profileId=...` may not load intended profile because page route ignores query params.

**Evidence**

- `app/admin/dashboard/page.jsx`
- `apps/core/admin/MissionControlDashboard.tsx`
- `apps/core/admin/repository.ts`
- `app/api/admin/mission-control/route.ts`
- `apps/core/auth/src/routes.ts`

**Confidence Level**  
High for dashboard; Medium for work-item deep link to workspace.

## 13. Admin Audits Source Citations

**User Goal**  
Find duplicate/broken/low-quality citations and trace source usage to profiles.

**Start Point**  
`/admin/sources`, protected admin nav “Sources”, or Mission Control button.

**Steps / Screens in Sequence**

1. Admin opens `/admin/sources`.
2. Page fetches source citation database from `/api/admin/sources`.
3. Admin reviews total sources, duplicate sources, broken links.
4. Admin reviews each source card and usage list.
5. Admin optionally runs broken link detection.
6. Admin opens profile usage in `/review?profileId=...`.

**Key Branching Decisions**

- Source payload loads vs. error.
- Broken link detection is run vs. not run.
- Source has duplicate count > 1 vs. not duplicate.
- Source link is healthy, broken, or unchecked.

**Alternate Paths**

- Admin returns to Mission Control.
- Admin opens review dashboard from usage link.

**Exit Points / Outcomes**

- Source audit completed.
- Broken link status updated.
- Review profile opened.
- Error shown.

**Dependencies or Assumptions**

- Requires `admin` role.
- Broken link detection depends on repository behavior and network/runtime environment.
- `/admin/sources` is live but missing from `PAGE_MANIFEST`.

**Evidence**

- `app/admin/sources/page.tsx`
- `apps/core/admin/SourceCitationManager.tsx`
- `apps/core/sources/repository.ts`
- `app/api/admin/sources/route.ts`
- `apps/core/admin/repository.ts`

**Confidence Level**  
High.

## 14. Empty-State Recovery Loops

**User Goal**  
Recover productively when there is no work or no matching content.

**Start Point**  
Empty states across review, workspace, admin, portal, and discovery screens.

**Steps / Screens in Sequence**

1. User lands on a page with no relevant items.
2. UI presents an empty state or prompt.
3. User chooses recovery path:
   - Review queue: wait/no action or select another profile if available.
   - Review selected pane: select a profile from queue.
   - Research revision history: save/autosave to create first revision.
   - Admin pipeline: no profiles yet.
   - Portal products: wait for new product requests.
   - Talent directory/marketplace filters: adjust filters/search.

**Key Branching Decisions**

- Empty due to no data vs. filtered search state.
- User can create data vs. must wait for external workflow.
- User has alternate nav available vs. dead-end.

**Alternate Paths**

- Navigate to global/protected nav.
- Change filters/search.
- Create or save content where creation controls exist.

**Exit Points / Outcomes**

- Empty state remains.
- User finds/selects content.
- User creates first revision or content item.
- User leaves screen.

**Dependencies or Assumptions**

- Some empty states are explicit; search/filter empty recovery is inferred from UI patterns and should be validated in the specific page components.

**Evidence**

- `apps/core/review/ReviewDashboard.tsx`
- `apps/core/workspace/ResearchWorkspace.tsx`
- `apps/core/admin/MissionControlDashboard.tsx`
- `src/views/TalentPortal.jsx`
- `src/views/TalentPage.jsx`
- `src/views/MarketplacePage.jsx`

**Confidence Level**  
Medium.

## 15. Error Recovery Loops

**User Goal**  
Recover from failed page render, failed data load, failed action, or invalid route.

**Start Point**  
Any failed route/action; explicit states exist for global app, review route, admin, source manager, workspace, portal, auth, contact, and 404.

**Steps / Screens in Sequence**

1. Failure occurs:
   - route render error
   - review route error
   - API/action error
   - auth error
   - unknown route
2. User sees relevant error UI:
   - global error fallback
   - review error boundary
   - inline error banner/status
   - sign-in alert
   - custom 404
3. User recovers:
   - Retry
   - Back Home
   - fix form input
   - re-run action
   - navigate to a stable route

**Key Branching Decisions**

- Error is route-level vs. inline action-level.
- Retry is available vs. only navigation/error banner.
- Auth/API error is permission-related vs. validation/data failure.

**Alternate Paths**

- Protected route errors may redirect to sign-in.
- API 403 errors produce JSON responses consumed by client components.
- Review route has a dedicated error boundary separate from global error.

**Exit Points / Outcomes**

- Retry succeeds.
- User returns home.
- User corrects input and resubmits.
- User signs in or switches role.
- User abandons task.

**Dependencies or Assumptions**

- Error boundaries are implemented for global and review-specific render errors.
- Inline errors depend on client fetch/action response handling.
- No dedicated permission-denied page was found.

**Evidence**

- `app/global-error.tsx`
- `app/not-found.jsx`
- `app/review/error.tsx`
- `app/review/loading.tsx`
- `src/next/SignInForm.jsx`
- `apps/core/review/ReviewDashboard.tsx`
- `apps/core/workspace/ResearchWorkspace.tsx`
- `apps/core/admin/MissionControlDashboard.tsx`
- `apps/core/admin/SourceCitationManager.tsx`
- `src/views/TalentPortal.jsx`
- `src/views/ContactPage.jsx`
- `app/api/**/route.ts`

**Confidence Level**  
High.

## 16. Figma/Page Capture Workflow

**User Goal**  
Capture implemented screens for design/export workflows.

**Start Point**  
`/api/page-manifest` or `/figma-export/[pageId]`.

**Steps / Screens in Sequence**

1. Tooling reads `/api/page-manifest`.
2. Tooling selects a page ID.
3. Tooling opens `/figma-export/[pageId]`.
4. Export route renders the selected page.
5. Protected pages are rendered with mock auth wrappers where implemented.
6. `PageTracker` stamps stable DOM metadata for capture.

**Key Branching Decisions**

- Page ID exists in switch case vs. `notFound()`.
- Page is public vs. protected mock export.
- Payload is fetched successfully vs. export page errors.

**Alternate Paths**

- Direct page capture through normal product routes using `PageTracker`.
- Export route supports a subset of manifest pages.

**Exit Points / Outcomes**

- Page captured/exported.
- Unknown export page ID returns not found.

**Dependencies or Assumptions**

- This appears to be internal tooling, not a customer-facing flow.
- Route protection for `/figma-export/[pageId]` is not evident.
- `/admin/sources` is not included in the export switch or page manifest.

**Evidence**

- `app/figma-export/[pageId]/page.tsx`
- `app/api/page-manifest/route.ts`
- `src/next/pageManifest.js`
- `src/next/PageTracker.jsx`
- `app/layout.jsx`
- `README.md`

**Confidence Level**  
Medium.

