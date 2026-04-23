| Product Area | Sub-area | Screen / Experience Name | Route or Entry Point | Screen Type (page, modal, drawer, overlay, wizard step, system state, etc.) | Access Type (public, auth, admin, role-based, unknown) | Status Confidence (implemented, likely implemented, unclear, deprecated) | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Public Marketing | Home | Home | `/` | page | public | implemented | `app/page.jsx`; `src/views/HomePage.jsx`; `src/next/SiteFrame.jsx` | Primary public entry point. Uses global `AppShell`. |
| Public Marketing | Company | About | `/about` | page | public | implemented | `app/about/page.jsx`; `src/next/StaticRoute.jsx`; `src/views/StaticPage.jsx` | Static company page. |
| Public Marketing | Company | Mission | `/mission` | page | public | implemented | `app/mission/page.jsx`; `src/next/StaticRoute.jsx`; `src/views/StaticPage.jsx` | Static mission page. |
| Public Marketing | Product Education | How It Works | `/how-it-works` | page | public | implemented | `app/how-it-works/page.jsx`; `src/views/HowItWorksPage.jsx` | Dedicated page, separate from unused StaticPage content for `how-it-works`. |
| Public Marketing | Contact | Contact | `/contact` | page | public | implemented | `app/contact/page.jsx`; `src/views/ContactPage.jsx` | Client-side contact form with success/error states; persistence not found. |
| Public Marketing | Contact | Contact Form Feedback | `/contact` form submit | system state | public | implemented | `src/views/ContactPage.jsx` | Material success/error status after local validation/submission. |
| Public Marketing | Trust | Security | `/security` | page | public | implemented | `app/security/page.jsx`; `src/next/StaticRoute.jsx`; `src/views/StaticPage.jsx` | Trust/security static page. |
| Public Marketing | Legal | Privacy | `/privacy` | page | public | likely implemented | `app/privacy/page.jsx`; `src/next/StaticRoute.jsx`; `src/views/StaticPage.jsx` | Implemented route, but content says it is a placeholder while full policy is finalized. |
| Public Marketing | Legal | Terms | `/terms` | page | public | likely implemented | `app/terms/page.jsx`; `src/next/StaticRoute.jsx`; `src/views/StaticPage.jsx` | Implemented route, but content says it is a future home for full terms. |
| Public Marketing | Licensing | Licensing | `/licensing` | page | public | implemented | `app/licensing/page.jsx`; `src/next/StaticRoute.jsx`; `src/views/StaticPage.jsx` | Static licensing overview. |
| Public Marketing | Ecosystem | Data Licensing | `/data-licensing` | page | public | implemented | `app/data-licensing/page.jsx`; `src/next/EcosystemVerticalRoute.jsx`; `src/views/EcosystemVerticalPage.jsx`; `src/data/siteData.js` | Ecosystem vertical linked from `ECOSYSTEM_CARDS`. |
| Public Marketing | Ecosystem | Digital Experiences | `/digital-experiences` | page | public | implemented | `app/digital-experiences/page.jsx`; `src/next/EcosystemVerticalRoute.jsx`; `src/views/EcosystemVerticalPage.jsx`; `src/data/siteData.js` | Ecosystem vertical linked from `ECOSYSTEM_CARDS`. |
| Public Marketing | Ecosystem | Gaming + AI | `/gaming-ai` | page | public | implemented | `app/gaming-ai/page.jsx`; `src/next/EcosystemVerticalRoute.jsx`; `src/views/EcosystemVerticalPage.jsx`; `src/data/siteData.js` | Ecosystem vertical linked from `ECOSYSTEM_CARDS`. |
| Public Marketing | Marketplace | Marketplace | `/marketplace` | page | public | implemented | `app/marketplace/page.jsx`; `src/views/MarketplacePage.jsx`; `src/components/feedback/RouteFallback.jsx` | Lazy-loaded marketplace page. |
| Public Marketing | Navigation | Mobile Primary Navigation Menu | Global `AppShell` mobile/tablet nav | overlay | public/auth-aware | implemented | `src/components/layout/AppShell.jsx`; `src/data/siteData.js` | Responsive compact menu/dropdown for global nav. Auth CTAs change by session role. |
| Public Marketing | Navigation | Back to Top | Global `AppShell` scroll threshold | overlay | public/auth-aware | implemented | `src/components/layout/AppShell.jsx` | Floating button shown after scroll. |
| Public Marketing | Navigation | Newsletter Signup Feedback | Global footer newsletter form | system state | public/auth-aware | implemented | `src/components/layout/AppShell.jsx` | Local status message; no persistence/API found. |
| Talent Discovery | Directory | Talent Directory | `/talent` | page | public | implemented | `app/talent/page.jsx`; `src/views/TalentPage.jsx`; `src/data/siteData.js` | Public searchable/filterable talent list. |
| Talent Discovery | Directory | Talent Directory Filters | `/talent` tablist | system state | public | implemented | `src/views/TalentPage.jsx` | Filter tab UI is material to browsing. |
| Talent Discovery | Profile | Talent Profile | `/talent/[talentId]` | page | public | implemented | `app/talent/[talentId]/page.jsx`; `src/views/TalentProfile.jsx`; `src/data/siteData.js` | Numeric route backed by local `TALENT` data. |
| Talent Discovery | Profile | Talent Profile Tabs | `/talent/[talentId]` tablist | system state | public | implemented | `src/views/TalentProfile.jsx` | Profile module tab panels are materially different content views. |
| Talent Discovery | Profile | Unknown Talent Profile | `/talent/[talentId]` with missing ID | system state | public | implemented | `src/views/TalentProfile.jsx` | Custom not-found-like state for unknown talent ID. |
| Developer/API | API Docs | API Docs | `/api` | page | public | implemented | `app/api/page.jsx`; `src/views/ApiPage.jsx` | Public API marketing/docs surface. |
| Developer/API | API Docs | API Resource Search / Filter | `/api` search/filter UI | system state | public | implemented | `src/views/ApiPage.jsx` | Material resource browsing state. |
| Developer/API | API Docs | API Key Management Mock | `/api` API key management area | system state | public | likely implemented | `src/views/ApiPage.jsx` | UI is explicitly labeled mock. |
| Developer/API | Acquisition | API Access Request | `/developers/api-access` | page | public | implemented | `app/developers/api-access/page.jsx`; `src/views/LeadCapturePage.jsx` | Front-end intake screen. No persistence route found. |
| Developer/API | Acquisition | API Access Acknowledgement | `/developers/api-access` after submit | system state | public | implemented | `app/developers/api-access/page.jsx`; `src/views/LeadCapturePage.jsx` | Local acknowledgement after form submit. |
| Developer/API | Tooling API | Page Manifest API | `/api/page-manifest` | API/system entry point | public | implemented | `app/api/page-manifest/route.ts`; `src/next/pageManifest.js` | Does not render a UI, but is an entry point for inventory/export tooling. |
| Talent Acquisition | Intake | Apply as Talent | `/apply/talent` | page | public | implemented | `app/apply/talent/page.jsx`; `src/views/LeadCapturePage.jsx` | Talent beta wait-list/intake screen. No persistence route found. |
| Talent Acquisition | Intake | Talent Application Acknowledgement | `/apply/talent` after submit | system state | public | implemented | `app/apply/talent/page.jsx`; `src/views/LeadCapturePage.jsx` | Local acknowledgement after form submit. |
| Auth & Account | Sign In | Sign In | `/sign-in` | page | public/auth-aware | implemented | `app/sign-in/page.jsx`; `src/next/SignInForm.jsx`; `app/sign-in/actions.js` | Supports Supabase mode, mock mode, `?next=`, and `?switch=1`. |
| Auth & Account | Sign In | Mock Role Picker | `/sign-in` when Supabase env missing | system state | public/auth-aware | implemented | `app/sign-in/page.jsx`; `src/next/SignInForm.jsx`; `apps/core/auth/src/mock.ts` | Environment-gated mock auth state. |
| Auth & Account | Sign In | Sign-In Redirect Notice | `/sign-in?next=...` | system state | public/auth-aware | implemented | `app/sign-in/page.jsx`; `apps/core/auth/src/middleware.ts` | Tells user they must sign in to continue to a protected route. |
| Auth & Account | Sign In | Switch Role Mode | `/sign-in?switch=1` | system state | auth | implemented | `app/sign-in/page.jsx`; `src/next/SignInForm.jsx`; `src/components/layout/AppShell.jsx`; `src/next/ProtectedShell.jsx` | Mock-mode role switching. |
| Auth & Account | Sign In | Sign-In Error | `/sign-in` form error | system state | public/auth-aware | implemented | `src/next/SignInForm.jsx`; `app/sign-in/actions.js` | Alert state for missing credentials/auth failure/no role. |
| Auth & Account | Sign Up | Sign Up | `/sign-up` | page | public | likely implemented | `app/sign-up/page.jsx`; `src/views/SignUpPage.jsx` | UI exists; backend persistence/email verification needs validation. |
| Auth & Account | Sign Up | Sign-Up Feedback | `/sign-up` after submit | system state | public | likely implemented | `src/views/SignUpPage.jsx` | Local status state visible in component. |
| Auth & Account | Password Recovery | Forgot Password | `/forgot-password` | page | public | likely implemented | `app/forgot-password/page.jsx`; `src/views/ForgotPasswordPage.jsx` | UI exists; backend recovery integration needs validation. |
| Auth & Account | Password Recovery | Forgot Password Feedback | `/forgot-password` after submit | system state | public | likely implemented | `src/views/ForgotPasswordPage.jsx` | Local status state visible in component. |
| Talent Portal | Portal Shell | Talent Portal Dashboard | `/portal` | page | role-based | implemented | `app/portal/page.jsx`; `src/views/TalentPortal.jsx`; `apps/core/auth/src/routes.ts` | Requires `admin` or `talent`. Uses static Jason Kidd data. |
| Talent Portal | Review | Talent Content Review | `/portal/review` | page | role-based | likely implemented | `app/portal/review/page.jsx`; `src/views/TalentPortal.jsx`; `app/api/talent/review/action/route.ts`; `app/api/talent/review/decision/route.ts` | UI/action routes exist, but diff data is local fixture data. |
| Talent Portal | Review | Talent Change Decision Feedback | `/portal/review` after accept/reject/action | system state | role-based | implemented | `src/views/TalentPortal.jsx`; `app/api/talent/review/decision/route.ts`; `app/api/talent/review/action/route.ts` | Success/error status after accept, reject, approve, or request changes. |
| Talent Portal | Products | Talent Product Review | `/portal/products` | page | role-based | likely implemented | `app/portal/products/page.jsx`; `src/views/TalentPortal.jsx`; `src/data/siteData.js` | Products render from local data. Approve/request changes buttons appear UI-only. |
| Talent Portal | Products | No Products Queued | `/portal/products` empty list | system state | role-based | implemented | `src/views/TalentPortal.jsx`; `src/components/ui.jsx` | Empty state if no products match current talent. |
| Talent Portal | Earnings | Talent Earnings | `/portal/earnings` | page | role-based | likely implemented | `app/portal/earnings/page.jsx`; `src/views/TalentPortal.jsx` | Static/mock revenue values. |
| Talent Portal | Settings | Talent Settings & Privacy | `/portal/settings` | page | role-based | likely implemented | `app/portal/settings/page.jsx`; `src/views/TalentPortal.jsx` | Settings persist to `localStorage`, not backend. |
| Talent Portal | Settings | Settings Save Feedback | `/portal/settings` after save | system state | role-based | implemented | `src/views/TalentPortal.jsx` | Success/error message after localStorage save. |
| Talent Portal | Navigation | Talent Portal Local Navigation | Portal sidebar/horizontal nav | overlay/navigation state | role-based | implemented | `src/views/TalentPortal.jsx`; `src/data/siteData.js` | Local nav across portal sections; desktop sidebar, responsive horizontal nav. |
| Research Workspace | Workspace | Research Workspace | `/workspace` | page | role-based | implemented | `app/workspace/page.tsx`; `apps/core/workspace/ResearchWorkspace.tsx`; `apps/core/workspace/auth.ts` | Requires `researcher`. Page currently loads `jason-kidd`. |
| Research Workspace | Workspace | Profile Basics Editor | `/workspace` | page section | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx` | Screen-level section within single workspace page, not separate route. |
| Research Workspace | Workspace | Career Timeline Editor | `/workspace` | page section | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx` | Major editor section with add/remove events. |
| Research Workspace | Workspace | Personal History Editor | `/workspace` | page section | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx` | Major editor section with add/remove sections. |
| Research Workspace | Workspace | Stats and Media Editor | `/workspace` | page section | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx` | Major editor section with stats/media entries. |
| Research Workspace | Review Handoff | Diff Review | `/workspace` diff review section | system state | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx`; `src/components/RevisionDiffView.tsx` | Shows draft changes before handoff and supports accept/reject decisions. |
| Research Workspace | Verification | Insufficient Verification Warning | `/workspace` validation state | system state | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx`; `apps/core/workspace/verification.ts` | Blocking issues prevent submit. |
| Research Workspace | Verification | Low-Quality Source Warning | `/workspace` validation state | system state | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx`; `apps/core/workspace/verification.ts` | Warning state for low reliability sources. |
| Research Workspace | Save/Submit | Save Draft Feedback | `/workspace` after save/autosave | system state | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx`; `app/api/workspace/profile/route.ts` | Success/error/pending save states. |
| Research Workspace | Save/Submit | Submit for Review Feedback | `/workspace` after submit | system state | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx`; `app/api/workspace/profile/submit/route.ts` | Success/error and optional email-webhook-not-configured message. |
| Research Workspace | History | Revision History | `/workspace` revision history section | page section | role-based | implemented | `apps/core/workspace/ResearchWorkspace.tsx` | Includes empty state when no revisions exist. |
| Research Workspace | Auth Fallback | Researcher Access Failure Blank | `/workspace` without researcher access | system state | role-based | unclear | `app/workspace/page.tsx`; `apps/core/workspace/auth.ts`; `apps/core/auth/src/middleware.ts` | Page returns `null` if server access check fails; middleware should usually redirect first. |
| Editorial Review | Queue | Review Queue Dashboard | `/review` | page | role-based | implemented | `app/review/page.tsx`; `apps/core/review/ReviewDashboard.tsx`; `apps/core/review/auth.ts` | Requires `editor`; supports optional `?profileId=`. |
| Editorial Review | Queue | Pending Queue Empty | `/review` with empty queue | system state | role-based | implemented | `apps/core/review/ReviewDashboard.tsx`; `apps/core/review/repository.ts` | Displays “No reviews pending.” |
| Editorial Review | Queue | Selected Submission Detail | `/review?profileId=...` | page state | role-based | implemented | `apps/core/review/ReviewDashboard.tsx`; `app/api/review/route.ts` | Main detail state after selecting a queued profile. |
| Editorial Review | Queue | No Selected Submission Prompt | `/review` without selected profile | system state | role-based | implemented | `apps/core/review/ReviewDashboard.tsx` | Prompts editor to select a profile. |
| Editorial Review | Audit | Audit Trail | `/review` audit panel | page section | role-based | implemented | `apps/core/review/ReviewDashboard.tsx`; `apps/core/review/types.ts` | Includes empty state when no audit trail exists. |
| Editorial Review | Actions | Request Changes Modal | `/review` action modal | modal | role-based | implemented | `apps/core/review/ReviewDashboard.tsx`; `app/api/review/action/route.ts` | Requires comment before confirm. |
| Editorial Review | Actions | Flag Issue Modal | `/review` action modal | modal | role-based | implemented | `apps/core/review/ReviewDashboard.tsx`; `app/api/review/action/route.ts` | Requires comment before confirm. |
| Editorial Review | Actions | Review Action Feedback | `/review` after action | system state | role-based | implemented | `apps/core/review/ReviewDashboard.tsx`; `app/api/review/action/route.ts` | Success, email-not-configured notice, error, and loading states. |
| Editorial Review | System State | Review Loading | `/review` route loading | system state | role-based | implemented | `app/review/loading.tsx` | Route-local skeleton/loading state. |
| Editorial Review | System State | Review Error | `/review` route error | system state | role-based | implemented | `app/review/error.tsx` | Route-local error boundary with retry. |
| Admin Operations | Mission Control | Mission Control | `/admin/dashboard` | page | admin | implemented | `app/admin/dashboard/page.jsx`; `apps/core/admin/MissionControlDashboard.tsx`; `app/api/admin/mission-control/route.ts` | Admin pipeline dashboard. |
| Admin Operations | Mission Control | Mission Control Loading | `/admin/dashboard` initial fetch | system state | admin | implemented | `apps/core/admin/MissionControlDashboard.tsx`; `src/components/feedback/LoadingState.tsx` | Client-side loading state while fetching payload. |
| Admin Operations | Mission Control | Mission Control Error | `/admin/dashboard` fetch error | system state | admin | implemented | `apps/core/admin/MissionControlDashboard.tsx`; `app/api/admin/mission-control/route.ts` | Error banner on failed fetch. |
| Admin Operations | Mission Control | Pipeline Empty | `/admin/dashboard` no profiles | system state | admin | implemented | `apps/core/admin/MissionControlDashboard.tsx` | Displays “No profiles yet.” |
| Admin Operations | Mission Control | Pipeline Bottleneck | `/admin/dashboard` bottleneck state | system state | admin | implemented | `apps/core/admin/MissionControlDashboard.tsx`; `apps/core/admin/repository.ts` | Stage summary marks bottleneck/healthy. |
| Admin Operations | Sources | Source Citation Manager | `/admin/sources` | page | admin | implemented | `app/admin/sources/page.tsx`; `apps/core/admin/SourceCitationManager.tsx`; `app/api/admin/sources/route.ts` | Live route but missing from `PAGE_MANIFEST`. |
| Admin Operations | Sources | Source Citation Manager Error | `/admin/sources` fetch error | system state | admin | implemented | `apps/core/admin/SourceCitationManager.tsx`; `app/api/admin/sources/route.ts` | Error banner on failed source load. |
| Admin Operations | Sources | Broken Link Detection Running | `/admin/sources?checkBrokenLinks=1` action state | system state | admin | implemented | `apps/core/admin/SourceCitationManager.tsx`; `app/api/admin/sources/route.ts` | Button state changes to “Checking links...”. |
| Admin Operations | Sources | Duplicate/Broken Source Warnings | `/admin/sources` source cards | system state | admin | implemented | `apps/core/admin/SourceCitationManager.tsx`; `apps/core/sources/repository.ts` | Material warning chips on source records. |
| Protected Shell | Protected Navigation | Protected Role Navigation | `ProtectedShell` routes | navigation state | role-based | implemented | `src/next/ProtectedShell.jsx`; `apps/core/auth/src/routes.ts` | Role-based nav for admin, researcher, editor, talent. Not used by portal pages. |
| Protected Shell | Session | Protected Header Session Controls | `ProtectedShell` routes | page chrome | role-based | implemented | `src/next/ProtectedShell.jsx`; `apps/core/auth/src/routes.ts` | Role label, email chip, Public Site, Switch Role in mock mode, Sign out. |
| System/Fallback | Loading | Global App Loading | route-level suspense/loading | system state | unknown | implemented | `app/loading.tsx`; `src/components/feedback/LoadingState.tsx` | App-level loading skeleton. |
| System/Fallback | Lazy Loading | Lazy Route Fallback | lazy `StaticRoute`, `EcosystemVerticalRoute`, Marketplace | system state | public | implemented | `src/components/feedback/RouteFallback.jsx`; `src/next/StaticRoute.jsx`; `src/next/EcosystemVerticalRoute.jsx`; `app/marketplace/page.jsx` | Shared skeleton fallback for lazy pages. |
| System/Fallback | Not Found | Custom 404 | unmatched app route | system state | public | implemented | `app/not-found.jsx`; `src/next/SiteFrame.jsx` | Uses `page="not-found"` but no manifest entry, so tracking treats it as unknown. |
| System/Fallback | Error | Global Error | app render error | system state | unknown | implemented | `app/global-error.tsx` | Global 500 fallback with retry/back home. |
| Design/Tooling | Page Capture | Figma Export Page | `/figma-export/[pageId]` | tooling page | unknown/public unless deployment protects it | likely implemented | `app/figma-export/[pageId]/page.tsx`; `src/next/pageManifest.js`; `app/layout.jsx`; `README.md` | Internal capture/export route. Can render mock-auth protected screens. |
| Design/Tooling | Tracking | Page Tracking Metadata | all `PageTracker` screens | system instrumentation | public/auth/role-based | implemented | `src/next/PageTracker.jsx`; `src/next/pageManifest.js`; `README.md` | DOM/window metadata and `ricon:page-track` event; not a user-visible screen. |
| Legacy/Unclear | Legacy Build Artifact | Dist SPA Output | `dist/` | deprecated artifact | unknown | deprecated | `dist/`; `public/_redirects`; `README.md` | Current source is Next App Router. `public/_redirects` SPA fallback appears legacy. |
| Legacy/Unclear | Debug/Unused | Role Dashboard Component | `src/next/RoleDashboard.jsx` | unclear page/component | unknown | unclear | `src/next/RoleDashboard.jsx`; `app/figma-export/[pageId]/page.tsx` | Imported in Figma export file but no switch case renders it. |

## Grouped Summary by Product Area

- **Public Marketing**
  - Implemented pages: Home, About, Mission, How It Works, Contact, Security, Privacy, Terms, Licensing, Data Licensing, Digital Experiences, Gaming + AI, Marketplace.
  - Major states: contact form feedback, global mobile nav overlay, back-to-top overlay, newsletter feedback, lazy route fallback.
  - Confidence caveat: Privacy and Terms are implemented routes but contain placeholder/future-policy copy.

- **Talent Discovery**
  - Implemented pages: Talent Directory and Talent Profile.
  - Major states: directory filters, profile tabs, unknown talent profile fallback.
  - Data appears local/static through `src/data/siteData.js`.

- **Developer/API**
  - Implemented pages: API Docs and API Access Request.
  - Major states: API resource filtering/search, API key management mock, API access acknowledgement.
  - Tooling entry point: `/api/page-manifest`.
  - Confidence caveat: developer access intake and API key management need backend validation.

- **Talent Acquisition**
  - Implemented page: Apply as Talent.
  - Major state: intake acknowledgement.
  - Confidence caveat: form persistence was not found.

- **Auth & Account**
  - Implemented pages: Sign In, Sign Up, Forgot Password.
  - Major states: mock role picker, sign-in redirect notice, role switch mode, sign-in error, sign-up feedback, password recovery feedback.
  - Access and redirect logic is implemented through Supabase/mock auth and role-based middleware.

- **Talent Portal**
  - Implemented pages: Portal Dashboard, Talent Content Review, Product Review, Earnings, Settings & Privacy.
  - Major states: review decision feedback, product empty state, settings save feedback, local portal navigation.
  - Confidence caveat: portal data is largely hard-coded/static, settings are localStorage-only, and product approval buttons appear UI-only.

- **Research Workspace**
  - Implemented screen: Research Workspace at `/workspace`.
  - Major screen-level sections: Profile Basics, Career Timeline, Personal History, Stats and Media, Diff Review, Revision History.
  - Major states: insufficient verification, low-quality source warning, save draft feedback, submit for review feedback, blank access fallback.
  - Confidence caveat: admin links include `/workspace?profileId=...`, but the page currently loads `jason-kidd` and does not consume `searchParams`.

- **Editorial Review**
  - Implemented screen: Review Queue Dashboard at `/review`.
  - Major states: pending queue empty, selected submission detail, no selected prompt, audit trail, request changes modal, flag issue modal, action feedback, route loading, route error.
  - Access is editor-only.

- **Admin Operations**
  - Implemented pages: Mission Control and Source Citation Manager.
  - Major states: mission control loading/error/empty/bottleneck; source manager error, broken link detection running, duplicate/broken source warnings.
  - Confidence caveat: `/admin/sources` is live and navigable but absent from `src/next/pageManifest.js`.

- **Protected Shell**
  - Implemented protected chrome for admin, researcher, and editor pages.
  - Major navigation/session states: role-specific protected nav, session controls, mock-mode switch role.
  - Talent portal uses separate portal navigation and `SiteFrame`, not `ProtectedShell`.

- **System/Fallback**
  - Implemented states: global loading, lazy route fallback, custom 404, global error.
  - Review also has dedicated loading and error states listed under Editorial Review.

- **Design/Tooling**
  - Implemented route: `/figma-export/[pageId]`.
  - Implemented instrumentation: `PageTracker` and `/api/page-manifest`.
  - Confidence caveat: likely internal tooling, but route protection is not evident.

- **Legacy/Unclear**
  - `dist/` and `public/_redirects` appear to be legacy/static-SPA artifacts next to the current Next App Router source.
  - `src/next/RoleDashboard.jsx` appears unused or debug-only.
