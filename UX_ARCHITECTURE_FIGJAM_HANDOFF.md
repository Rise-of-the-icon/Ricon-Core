# RICON UX Architecture FigJam Handoff

Use this as a direct prompt/input for FigJam generation. Naming convention: `[Product Area] / [Sub-area] / [Screen] / [State]`.

## 1. Sitemap-Style Hierarchy

```text
RICON
├── Public Marketing
│   ├── Home
│   │   └── Public Marketing / Home / Home
│   ├── Company
│   │   ├── Public Marketing / Company / About
│   │   └── Public Marketing / Company / Mission
│   ├── Product Education
│   │   └── Public Marketing / Product Education / How It Works
│   ├── Contact
│   │   ├── Public Marketing / Contact / Contact
│   │   └── Public Marketing / Contact / Contact / Feedback
│   ├── Trust and Legal
│   │   ├── Public Marketing / Trust / Security
│   │   ├── Public Marketing / Legal / Privacy / Placeholder
│   │   └── Public Marketing / Legal / Terms / Placeholder
│   ├── Licensing and Ecosystem
│   │   ├── Public Marketing / Licensing / Licensing
│   │   ├── Public Marketing / Ecosystem / Data Licensing
│   │   ├── Public Marketing / Ecosystem / Digital Experiences
│   │   └── Public Marketing / Ecosystem / Gaming + AI
│   ├── Marketplace
│   │   └── Public Marketing / Marketplace / Marketplace
│   └── Shared Public Chrome
│       ├── Public Marketing / Navigation / Global Nav
│       ├── Public Marketing / Navigation / Mobile Menu Overlay
│       ├── Public Marketing / Navigation / Back To Top Overlay
│       └── Public Marketing / Footer / Newsletter Feedback
│
├── Talent Discovery
│   ├── Talent Discovery / Directory / Talent Directory
│   ├── Talent Discovery / Directory / Talent Directory / Filtered State
│   ├── Talent Discovery / Profile / Talent Profile
│   ├── Talent Discovery / Profile / Talent Profile / Tabs
│   └── Talent Discovery / Profile / Talent Profile / Unknown Talent
│
├── Developer/API
│   ├── Developer/API / Docs / API Docs
│   ├── Developer/API / Docs / API Docs / Resource Search
│   ├── Developer/API / Docs / API Docs / API Key Management Mock
│   ├── Developer/API / Acquisition / API Access Request
│   ├── Developer/API / Acquisition / API Access Request / Acknowledgement
│   └── Developer/API / Tooling / Page Manifest API
│
├── Talent Acquisition
│   ├── Talent Acquisition / Intake / Apply As Talent
│   └── Talent Acquisition / Intake / Apply As Talent / Acknowledgement
│
├── Auth and Account
│   ├── Auth and Account / Sign In / Sign In
│   ├── Auth and Account / Sign In / Mock Role Picker
│   ├── Auth and Account / Sign In / Redirect Notice
│   ├── Auth and Account / Sign In / Switch Role Mode
│   ├── Auth and Account / Sign In / Error
│   ├── Auth and Account / Sign Up / Sign Up
│   ├── Auth and Account / Sign Up / Feedback
│   ├── Auth and Account / Password Recovery / Forgot Password
│   └── Auth and Account / Password Recovery / Feedback
│
├── Talent Portal
│   ├── Talent Portal / Dashboard / Portal Dashboard
│   ├── Talent Portal / Review / Content Review
│   ├── Talent Portal / Review / Change Decision Feedback
│   ├── Talent Portal / Products / Product Review
│   ├── Talent Portal / Products / Product Review / Empty
│   ├── Talent Portal / Earnings / Earnings
│   ├── Talent Portal / Settings / Settings and Privacy
│   ├── Talent Portal / Settings / Save Feedback
│   └── Talent Portal / Navigation / Local Portal Navigation
│
├── Research Workspace
│   ├── Research Workspace / Workspace / Research Workspace
│   ├── Research Workspace / Editor / Profile Basics
│   ├── Research Workspace / Editor / Career Timeline
│   ├── Research Workspace / Editor / Personal History
│   ├── Research Workspace / Editor / Stats and Media
│   ├── Research Workspace / Review Handoff / Diff Review
│   ├── Research Workspace / Verification / Insufficient Verification Warning
│   ├── Research Workspace / Verification / Low-Quality Source Warning
│   ├── Research Workspace / Save Submit / Save Draft Feedback
│   ├── Research Workspace / Save Submit / Submit For Review Feedback
│   ├── Research Workspace / History / Revision History
│   └── Research Workspace / Auth Fallback / Blank Access Failure
│
├── Editorial Review
│   ├── Editorial Review / Queue / Review Queue Dashboard
│   ├── Editorial Review / Queue / Pending Queue Empty
│   ├── Editorial Review / Queue / Selected Submission Detail
│   ├── Editorial Review / Queue / No Selected Submission Prompt
│   ├── Editorial Review / Audit / Audit Trail
│   ├── Editorial Review / Actions / Request Changes Modal
│   ├── Editorial Review / Actions / Flag Issue Modal
│   ├── Editorial Review / Actions / Action Feedback
│   ├── Editorial Review / System / Loading
│   └── Editorial Review / System / Error
│
├── Admin Operations
│   ├── Admin Operations / Mission Control / Mission Control
│   ├── Admin Operations / Mission Control / Loading
│   ├── Admin Operations / Mission Control / Error
│   ├── Admin Operations / Mission Control / Pipeline Empty
│   ├── Admin Operations / Mission Control / Pipeline Bottleneck
│   ├── Admin Operations / Sources / Source Citation Manager
│   ├── Admin Operations / Sources / Error
│   ├── Admin Operations / Sources / Broken Link Detection Running
│   └── Admin Operations / Sources / Duplicate Broken Source Warnings
│
├── Protected Shell
│   ├── Protected Shell / Navigation / Protected Role Navigation
│   └── Protected Shell / Session / Header Session Controls
│
├── System Fallback
│   ├── System Fallback / Loading / Global App Loading
│   ├── System Fallback / Loading / Lazy Route Fallback
│   ├── System Fallback / Not Found / Custom 404
│   └── System Fallback / Error / Global Error
│
└── Design Tooling
    ├── Design Tooling / Page Capture / Figma Export Page
    └── Design Tooling / Tracking / Page Tracking Metadata
```

## 2. Screen Inventory Grouped by Feature

### Public Marketing

- **Public Marketing / Home / Home**  
  Route: `/`  
  Access: public  
  Evidence: `app/page.jsx`, `src/views/HomePage.jsx`

- **Public Marketing / Company / About**  
  Route: `/about`  
  Access: public  
  Evidence: `app/about/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx`

- **Public Marketing / Company / Mission**  
  Route: `/mission`  
  Access: public  
  Evidence: `app/mission/page.jsx`, `src/next/StaticRoute.jsx`, `src/views/StaticPage.jsx`

- **Public Marketing / Product Education / How It Works**  
  Route: `/how-it-works`  
  Access: public  
  Evidence: `app/how-it-works/page.jsx`, `src/views/HowItWorksPage.jsx`

- **Public Marketing / Contact / Contact**  
  Route: `/contact`  
  Access: public  
  Evidence: `app/contact/page.jsx`, `src/views/ContactPage.jsx`

- **Public Marketing / Contact / Contact / Feedback**  
  Entry point: `/contact` form submit  
  Access: public  
  Evidence: `src/views/ContactPage.jsx`

- **Public Marketing / Trust / Security**  
  Route: `/security`  
  Access: public  
  Evidence: `app/security/page.jsx`, `src/views/StaticPage.jsx`

- **Public Marketing / Legal / Privacy / Placeholder**  
  Route: `/privacy`  
  Access: public  
  Evidence: `app/privacy/page.jsx`, `src/views/StaticPage.jsx`  
  Note: implemented route, placeholder policy copy.

- **Public Marketing / Legal / Terms / Placeholder**  
  Route: `/terms`  
  Access: public  
  Evidence: `app/terms/page.jsx`, `src/views/StaticPage.jsx`  
  Note: implemented route, placeholder terms copy.

- **Public Marketing / Licensing / Licensing**  
  Route: `/licensing`  
  Access: public  
  Evidence: `app/licensing/page.jsx`, `src/views/StaticPage.jsx`

- **Public Marketing / Ecosystem / Data Licensing**  
  Route: `/data-licensing`  
  Access: public  
  Evidence: `app/data-licensing/page.jsx`, `src/views/EcosystemVerticalPage.jsx`

- **Public Marketing / Ecosystem / Digital Experiences**  
  Route: `/digital-experiences`  
  Access: public  
  Evidence: `app/digital-experiences/page.jsx`, `src/views/EcosystemVerticalPage.jsx`

- **Public Marketing / Ecosystem / Gaming + AI**  
  Route: `/gaming-ai`  
  Access: public  
  Evidence: `app/gaming-ai/page.jsx`, `src/views/EcosystemVerticalPage.jsx`

- **Public Marketing / Marketplace / Marketplace**  
  Route: `/marketplace`  
  Access: public  
  Evidence: `app/marketplace/page.jsx`, `src/views/MarketplacePage.jsx`

- **Public Marketing / Navigation / Mobile Menu Overlay**  
  Entry point: global nav on compact viewport  
  Access: public/auth-aware  
  Evidence: `src/components/layout/AppShell.jsx`

- **Public Marketing / Navigation / Back To Top Overlay**  
  Entry point: scroll threshold in `AppShell`  
  Access: public/auth-aware  
  Evidence: `src/components/layout/AppShell.jsx`

- **Public Marketing / Footer / Newsletter Feedback**  
  Entry point: footer newsletter submit  
  Access: public/auth-aware  
  Evidence: `src/components/layout/AppShell.jsx`

### Talent Discovery

- **Talent Discovery / Directory / Talent Directory**  
  Route: `/talent`  
  Access: public  
  Evidence: `app/talent/page.jsx`, `src/views/TalentPage.jsx`

- **Talent Discovery / Directory / Talent Directory / Filtered State**  
  Entry point: `/talent` filters/search  
  Access: public  
  Evidence: `src/views/TalentPage.jsx`

- **Talent Discovery / Profile / Talent Profile**  
  Route: `/talent/[talentId]`  
  Access: public  
  Evidence: `app/talent/[talentId]/page.jsx`, `src/views/TalentProfile.jsx`

- **Talent Discovery / Profile / Talent Profile / Tabs**  
  Entry point: profile module tabs  
  Access: public  
  Evidence: `src/views/TalentProfile.jsx`

- **Talent Discovery / Profile / Talent Profile / Unknown Talent**  
  Entry point: `/talent/[talentId]` with missing ID  
  Access: public  
  Evidence: `src/views/TalentProfile.jsx`

### Developer/API

- **Developer/API / Docs / API Docs**  
  Route: `/api`  
  Access: public  
  Evidence: `app/api/page.jsx`, `src/views/ApiPage.jsx`

- **Developer/API / Docs / API Docs / Resource Search**  
  Entry point: API docs search/filter  
  Access: public  
  Evidence: `src/views/ApiPage.jsx`

- **Developer/API / Docs / API Docs / API Key Management Mock**  
  Entry point: API page key management area  
  Access: public  
  Evidence: `src/views/ApiPage.jsx`  
  Note: explicitly labeled mock.

- **Developer/API / Acquisition / API Access Request**  
  Route: `/developers/api-access`  
  Access: public  
  Evidence: `app/developers/api-access/page.jsx`, `src/views/LeadCapturePage.jsx`

- **Developer/API / Acquisition / API Access Request / Acknowledgement**  
  Entry point: API access form submit  
  Access: public  
  Evidence: `src/views/LeadCapturePage.jsx`

### Talent Acquisition

- **Talent Acquisition / Intake / Apply As Talent**  
  Route: `/apply/talent`  
  Access: public  
  Evidence: `app/apply/talent/page.jsx`, `src/views/LeadCapturePage.jsx`

- **Talent Acquisition / Intake / Apply As Talent / Acknowledgement**  
  Entry point: talent intake form submit  
  Access: public  
  Evidence: `src/views/LeadCapturePage.jsx`

### Auth and Account

- **Auth and Account / Sign In / Sign In**  
  Route: `/sign-in`  
  Access: public/auth-aware  
  Evidence: `app/sign-in/page.jsx`, `src/next/SignInForm.jsx`

- **Auth and Account / Sign In / Mock Role Picker**  
  Entry point: `/sign-in` when Supabase env is missing  
  Access: public/auth-aware  
  Evidence: `src/next/SignInForm.jsx`, `apps/core/auth/src/mock.ts`

- **Auth and Account / Sign In / Redirect Notice**  
  Route: `/sign-in?next=...`  
  Access: public/auth-aware  
  Evidence: `app/sign-in/page.jsx`, `apps/core/auth/src/middleware.ts`

- **Auth and Account / Sign In / Switch Role Mode**  
  Route: `/sign-in?switch=1`  
  Access: auth/mock-mode  
  Evidence: `app/sign-in/page.jsx`, `src/next/SignInForm.jsx`

- **Auth and Account / Sign In / Error**  
  Entry point: sign-in form error  
  Access: public/auth-aware  
  Evidence: `src/next/SignInForm.jsx`, `app/sign-in/actions.js`

- **Auth and Account / Sign Up / Sign Up**  
  Route: `/sign-up`  
  Access: public  
  Evidence: `app/sign-up/page.jsx`, `src/views/SignUpPage.jsx`  
  Note: backend account creation needs validation.

- **Auth and Account / Sign Up / Feedback**  
  Entry point: sign-up submit  
  Access: public  
  Evidence: `src/views/SignUpPage.jsx`

- **Auth and Account / Password Recovery / Forgot Password**  
  Route: `/forgot-password`  
  Access: public  
  Evidence: `app/forgot-password/page.jsx`, `src/views/ForgotPasswordPage.jsx`

- **Auth and Account / Password Recovery / Feedback**  
  Entry point: forgot password submit  
  Access: public  
  Evidence: `src/views/ForgotPasswordPage.jsx`

### Talent Portal

- **Talent Portal / Dashboard / Portal Dashboard**  
  Route: `/portal`  
  Access: role-based: `admin`, `talent`  
  Evidence: `app/portal/page.jsx`, `src/views/TalentPortal.jsx`, `apps/core/auth/src/routes.ts`

- **Talent Portal / Review / Content Review**  
  Route: `/portal/review`  
  Access: role-based: `admin`, `talent`  
  Evidence: `app/portal/review/page.jsx`, `src/views/TalentPortal.jsx`

- **Talent Portal / Review / Change Decision Feedback**  
  Entry point: accept/reject/approve/request changes  
  Access: role-based: `admin`, `talent`  
  Evidence: `src/views/TalentPortal.jsx`, `app/api/talent/review/action/route.ts`, `app/api/talent/review/decision/route.ts`

- **Talent Portal / Products / Product Review**  
  Route: `/portal/products`  
  Access: role-based: `admin`, `talent`  
  Evidence: `app/portal/products/page.jsx`, `src/views/TalentPortal.jsx`  
  Note: product action buttons appear UI-only.

- **Talent Portal / Products / Product Review / Empty**  
  Entry point: no products for current talent  
  Access: role-based: `admin`, `talent`  
  Evidence: `src/views/TalentPortal.jsx`

- **Talent Portal / Earnings / Earnings**  
  Route: `/portal/earnings`  
  Access: role-based: `admin`, `talent`  
  Evidence: `app/portal/earnings/page.jsx`, `src/views/TalentPortal.jsx`  
  Note: values appear static/mock.

- **Talent Portal / Settings / Settings and Privacy**  
  Route: `/portal/settings`  
  Access: role-based: `admin`, `talent`  
  Evidence: `app/portal/settings/page.jsx`, `src/views/TalentPortal.jsx`  
  Note: persistence is localStorage.

- **Talent Portal / Settings / Save Feedback**  
  Entry point: save settings  
  Access: role-based: `admin`, `talent`  
  Evidence: `src/views/TalentPortal.jsx`

- **Talent Portal / Navigation / Local Portal Navigation**  
  Entry point: portal sidebar/horizontal nav  
  Access: role-based: `admin`, `talent`  
  Evidence: `src/views/TalentPortal.jsx`, `src/data/siteData.js`

### Research Workspace

- **Research Workspace / Workspace / Research Workspace**  
  Route: `/workspace`  
  Access: role-based: `researcher`  
  Evidence: `app/workspace/page.tsx`, `apps/core/workspace/ResearchWorkspace.tsx`

- **Research Workspace / Editor / Profile Basics**  
  Entry point: `/workspace` section  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`

- **Research Workspace / Editor / Career Timeline**  
  Entry point: `/workspace` section  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`

- **Research Workspace / Editor / Personal History**  
  Entry point: `/workspace` section  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`

- **Research Workspace / Editor / Stats and Media**  
  Entry point: `/workspace` section  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`

- **Research Workspace / Review Handoff / Diff Review**  
  Entry point: `/workspace` diff section  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`, `src/components/RevisionDiffView.tsx`

- **Research Workspace / Verification / Insufficient Verification Warning**  
  Entry point: invalid submission state  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`, `apps/core/workspace/verification.ts`

- **Research Workspace / Verification / Low-Quality Source Warning**  
  Entry point: warning validation state  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`, `apps/core/workspace/verification.ts`

- **Research Workspace / Save Submit / Save Draft Feedback**  
  Entry point: save/autosave  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`, `app/api/workspace/profile/route.ts`

- **Research Workspace / Save Submit / Submit For Review Feedback**  
  Entry point: submit for review  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`, `app/api/workspace/profile/submit/route.ts`

- **Research Workspace / History / Revision History**  
  Entry point: `/workspace` history panel  
  Access: role-based: `researcher`  
  Evidence: `apps/core/workspace/ResearchWorkspace.tsx`

### Editorial Review

- **Editorial Review / Queue / Review Queue Dashboard**  
  Route: `/review`  
  Access: role-based: `editor`  
  Evidence: `app/review/page.tsx`, `apps/core/review/ReviewDashboard.tsx`

- **Editorial Review / Queue / Pending Queue Empty**  
  Entry point: `/review` with empty queue  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`

- **Editorial Review / Queue / Selected Submission Detail**  
  Route: `/review?profileId=...` or queue selection  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`, `app/api/review/route.ts`

- **Editorial Review / Queue / No Selected Submission Prompt**  
  Entry point: no selected profile  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`

- **Editorial Review / Audit / Audit Trail**  
  Entry point: `/review` audit panel  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`

- **Editorial Review / Actions / Request Changes Modal**  
  Entry point: Request Changes action  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`

- **Editorial Review / Actions / Flag Issue Modal**  
  Entry point: Flag Issue action  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`

- **Editorial Review / Actions / Action Feedback**  
  Entry point: approve/request/flag action result  
  Access: role-based: `editor`  
  Evidence: `apps/core/review/ReviewDashboard.tsx`, `app/api/review/action/route.ts`

- **Editorial Review / System / Loading**  
  Entry point: `/review` route loading  
  Access: role-based: `editor`  
  Evidence: `app/review/loading.tsx`

- **Editorial Review / System / Error**  
  Entry point: `/review` route error  
  Access: role-based: `editor`  
  Evidence: `app/review/error.tsx`

### Admin Operations

- **Admin Operations / Mission Control / Mission Control**  
  Route: `/admin/dashboard`  
  Access: admin  
  Evidence: `app/admin/dashboard/page.jsx`, `apps/core/admin/MissionControlDashboard.tsx`

- **Admin Operations / Mission Control / Loading**  
  Entry point: initial fetch  
  Access: admin  
  Evidence: `apps/core/admin/MissionControlDashboard.tsx`

- **Admin Operations / Mission Control / Error**  
  Entry point: failed fetch  
  Access: admin  
  Evidence: `apps/core/admin/MissionControlDashboard.tsx`

- **Admin Operations / Mission Control / Pipeline Empty**  
  Entry point: no profiles  
  Access: admin  
  Evidence: `apps/core/admin/MissionControlDashboard.tsx`

- **Admin Operations / Mission Control / Pipeline Bottleneck**  
  Entry point: bottleneck stage state  
  Access: admin  
  Evidence: `apps/core/admin/MissionControlDashboard.tsx`, `apps/core/admin/repository.ts`

- **Admin Operations / Sources / Source Citation Manager**  
  Route: `/admin/sources`  
  Access: admin  
  Evidence: `app/admin/sources/page.tsx`, `apps/core/admin/SourceCitationManager.tsx`

- **Admin Operations / Sources / Error**  
  Entry point: source fetch error  
  Access: admin  
  Evidence: `apps/core/admin/SourceCitationManager.tsx`

- **Admin Operations / Sources / Broken Link Detection Running**  
  Entry point: run broken link detection  
  Access: admin  
  Evidence: `apps/core/admin/SourceCitationManager.tsx`

- **Admin Operations / Sources / Duplicate Broken Source Warnings**  
  Entry point: source warning chips  
  Access: admin  
  Evidence: `apps/core/admin/SourceCitationManager.tsx`, `apps/core/sources/repository.ts`

### System and Tooling

- **Protected Shell / Navigation / Protected Role Navigation**  
  Entry point: protected pages using `ProtectedShell`  
  Access: role-based  
  Evidence: `src/next/ProtectedShell.jsx`, `apps/core/auth/src/routes.ts`

- **Protected Shell / Session / Header Session Controls**  
  Entry point: protected pages using `ProtectedShell`  
  Access: role-based  
  Evidence: `src/next/ProtectedShell.jsx`

- **System Fallback / Loading / Global App Loading**  
  Entry point: app route loading  
  Access: unknown  
  Evidence: `app/loading.tsx`

- **System Fallback / Loading / Lazy Route Fallback**  
  Entry point: lazy routes  
  Access: public  
  Evidence: `src/components/feedback/RouteFallback.jsx`

- **System Fallback / Not Found / Custom 404**  
  Entry point: unmatched route  
  Access: public  
  Evidence: `app/not-found.jsx`

- **System Fallback / Error / Global Error**  
  Entry point: app render error  
  Access: unknown  
  Evidence: `app/global-error.tsx`

- **Design Tooling / Page Capture / Figma Export Page**  
  Route: `/figma-export/[pageId]`  
  Access: unclear  
  Evidence: `app/figma-export/[pageId]/page.tsx`

- **Design Tooling / Tracking / Page Tracking Metadata**  
  Entry point: tracked pages  
  Access: public/auth/role-based  
  Evidence: `src/next/PageTracker.jsx`, `src/next/pageManifest.js`

## 3. Top Core User Flows

### Flow 1: Public Discovery to Talent Profile

- **Goal:** find verified talent and inspect a profile.
- **Sequence:**  
  `Public Marketing / Home / Home` -> `Talent Discovery / Directory / Talent Directory` -> `Talent Discovery / Directory / Talent Directory / Filtered State` -> `Talent Discovery / Profile / Talent Profile` -> `Talent Discovery / Profile / Talent Profile / Tabs`
- **Branches:** filter/search; choose profile; unknown ID fallback.
- **Outcomes:** profile viewed; user goes to Marketplace or API Access; unknown talent state.
- **Confidence:** high for UI, medium for live data.

### Flow 2: Public Education to Lead Capture

- **Goal:** convert a visitor into a talent/developer/general lead.
- **Sequence:**  
  `Public Marketing / Product Education / How It Works` or ecosystem/API/licensing pages -> `Talent Acquisition / Intake / Apply As Talent` or `Developer/API / Acquisition / API Access Request` or `Public Marketing / Contact / Contact` -> acknowledgement/feedback state
- **Branches:** talent vs developer vs contact; success vs error/acknowledgement.
- **Outcomes:** local acknowledgement; contact feedback.
- **Confidence:** high for UI, medium for backend completion.

### Flow 3: Sign In and Role-Based Dashboard Routing

- **Goal:** authenticate and land in correct work area.
- **Sequence:**  
  `Auth and Account / Sign In / Sign In` -> optional `Auth and Account / Sign In / Mock Role Picker` -> submit -> role dashboard:
  - admin: `Admin Operations / Mission Control / Mission Control`
  - researcher: `Research Workspace / Workspace / Research Workspace`
  - editor: `Editorial Review / Queue / Review Queue Dashboard`
  - talent: `Talent Portal / Dashboard / Portal Dashboard`
- **Branches:** Supabase vs mock mode; valid role vs missing role; `next` path allowed vs dashboard fallback.
- **Outcomes:** protected dashboard, sign-in error, switch role mode.
- **Confidence:** high.

### Flow 4: Protected Route Access Recovery

- **Goal:** recover when entering a protected route unauthenticated or with the wrong role.
- **Sequence:**  
  protected route -> middleware/server check -> `Auth and Account / Sign In / Redirect Notice` -> sign in -> requested path or role dashboard
- **Branches:** unauthenticated vs authenticated wrong role; safe `next` path vs ignored; API request vs page request.
- **Outcomes:** protected screen, role dashboard fallback, API 403, sign-in error.
- **Confidence:** high, except workspace blank fallback is unclear.

### Flow 5: Researcher Draft to Editorial Review

- **Goal:** create/update a sourced profile and submit it.
- **Sequence:**  
  `Research Workspace / Workspace / Research Workspace` -> `Research Workspace / Editor / Profile Basics` -> `Career Timeline` -> `Personal History` -> `Stats and Media` -> `Research Workspace / Review Handoff / Diff Review` -> verification states -> save/submit feedback -> `Editorial Review / Queue / Review Queue Dashboard`
- **Branches:** valid vs insufficient verification; warnings vs no warnings; save vs autosave vs submit; email webhook configured vs not configured.
- **Outcomes:** draft saved, submitted to review, blocked by validation, save/submit error.
- **Confidence:** high for task flow, medium for live persistence and profile deep links.

### Flow 6: Editor Reviews Submission

- **Goal:** inspect researcher submission and decide next status.
- **Sequence:**  
  `Editorial Review / Queue / Review Queue Dashboard` -> `Editorial Review / Queue / Selected Submission Detail` -> `Editorial Review / Audit / Audit Trail` -> approve or modal action -> `Editorial Review / Actions / Action Feedback`
- **Branches:** queue empty vs populated; approve vs request changes vs flag issue; modal comment provided vs disabled; API success vs error.
- **Outcomes:** moved to talent review, changes requested, issue flagged, action error, empty queue.
- **Confidence:** high.

### Flow 7: Talent Reviews and Approves Profile Changes

- **Goal:** talent accepts/rejects changes and approves profile or requests revisions.
- **Sequence:**  
  `Talent Portal / Dashboard / Portal Dashboard` -> `Talent Portal / Review / Content Review` -> accept/reject module changes -> `Talent Portal / Review / Change Decision Feedback` -> approve or request changes
- **Branches:** accept vs reject; approve vs request changes; API success vs error.
- **Outcomes:** change decision saved, profile approved, changes requested, error feedback.
- **Confidence:** medium because visible diff data is fixture/static.

### Flow 8: Talent Manages Profile Settings

- **Goal:** control visibility, sharing, delegate access, and notifications.
- **Sequence:**  
  `Talent Portal / Settings / Settings and Privacy` -> edit toggles/fields -> save -> `Talent Portal / Settings / Save Feedback`
- **Branches:** localStorage available vs save error; toggles on/off.
- **Outcomes:** settings saved locally, unable-to-save message.
- **Confidence:** medium because persistence is local-only.

### Flow 9: Admin Monitors Pipeline and Opens Work Items

- **Goal:** monitor operational status and open profiles requiring action.
- **Sequence:**  
  `Admin Operations / Mission Control / Mission Control` -> loading/error/empty/bottleneck state -> profile link -> `/workspace?profileId=...` or `/review?profileId=...` -> optional `Admin Operations / Sources / Source Citation Manager`
- **Branches:** stage draft vs non-draft; payload loaded vs error; profiles exist vs empty; bottleneck vs healthy.
- **Outcomes:** opened workspace/review item; opened source manager; error/empty state.
- **Confidence:** high for dashboard, medium for `/workspace?profileId=...` deep link.

### Flow 10: Admin Audits Source Citations

- **Goal:** inspect source reliability, duplicates, broken links, and profile usage.
- **Sequence:**  
  `Admin Operations / Sources / Source Citation Manager` -> source metrics/cards -> optional `Admin Operations / Sources / Broken Link Detection Running` -> duplicate/broken warnings -> open profile in review
- **Branches:** fetch success vs error; run link check vs not; source healthy vs duplicate/broken/unchecked.
- **Outcomes:** source audit completed; review profile opened; error state.
- **Confidence:** high.

## 4. Edge Cases / System States

- **Auth and Account / Sign In / Error**  
  Missing credentials, failed auth, or authenticated user without assigned role.

- **Auth and Account / Sign In / Redirect Notice**  
  Unauthenticated user enters a protected path and is redirected with `?next=`.

- **Auth and Account / Sign In / Switch Role Mode**  
  Mock-mode role switching via `/sign-in?switch=1`.

- **Research Workspace / Verification / Insufficient Verification Warning**  
  Blocking validation state that disables submit.

- **Research Workspace / Verification / Low-Quality Source Warning**  
  Warning state for low-reliability sources.

- **Research Workspace / Save Submit / Save Draft Feedback**  
  Save/autosave success or failure.

- **Research Workspace / Save Submit / Submit For Review Feedback**  
  Submit success, submit error, or email webhook not configured.

- **Editorial Review / Queue / Pending Queue Empty**  
  No submissions in review queue.

- **Editorial Review / Queue / No Selected Submission Prompt**  
  Queue view has no selected profile.

- **Editorial Review / Actions / Request Changes Modal**  
  Comment required before confirming.

- **Editorial Review / Actions / Flag Issue Modal**  
  Comment required before confirming.

- **Editorial Review / System / Loading**  
  Route-local loading skeleton.

- **Editorial Review / System / Error**  
  Route-local error recovery with retry.

- **Talent Portal / Products / Product Review / Empty**  
  No products queued for current talent.

- **Talent Portal / Settings / Save Feedback**  
  localStorage save success or failure.

- **Admin Operations / Mission Control / Loading**  
  Client fetch loading state.

- **Admin Operations / Mission Control / Error**  
  Mission control API load failure.

- **Admin Operations / Mission Control / Pipeline Empty**  
  No active profiles in pipeline.

- **Admin Operations / Mission Control / Pipeline Bottleneck**  
  Stage count marked as bottleneck.

- **Admin Operations / Sources / Error**  
  Source citation database fetch failure.

- **Admin Operations / Sources / Broken Link Detection Running**  
  Link health check in progress.

- **Admin Operations / Sources / Duplicate Broken Source Warnings**  
  Per-source warning chips.

- **Talent Discovery / Profile / Talent Profile / Unknown Talent**  
  Unknown numeric profile ID fallback.

- **System Fallback / Loading / Global App Loading**  
  App-level loading skeleton.

- **System Fallback / Loading / Lazy Route Fallback**  
  Lazy public route fallback skeleton.

- **System Fallback / Not Found / Custom 404**  
  Unmatched route fallback.

- **System Fallback / Error / Global Error**  
  App-level 500 fallback.

## 5. Ambiguities to Validate Against Prototype or Live Product

1. **Lead capture persistence**  
   `Apply As Talent`, `API Access Request`, and `Contact` show UI feedback, but no server-side lead/contact persistence was found.

2. **Sign-up backend behavior**  
   Sign-up UI and feedback exist, but account creation, email verification, and role provisioning need live validation.

3. **Forgot password backend behavior**  
   Recovery UI exists, but Supabase recovery flow integration needs validation.

4. **Talent portal data binding**  
   Portal screens use `TALENT[0]`, static values, local review diffs, and localStorage settings. Validate whether live talent-specific payloads exist elsewhere.

5. **Talent product actions**  
   Product Approve and Request Changes buttons appear UI-only. Validate whether product review is intended to be transactional.

6. **Talent earnings data**  
   Earnings values appear hard-coded/static. Validate live revenue source and update cadence.

7. **Workspace profile deep links**  
   Admin Mission Control links drafts to `/workspace?profileId=...`, but `app/workspace/page.tsx` currently loads `jason-kidd` and does not read query params.

8. **Review publish/send-back exposure**  
   Review API supports `publish` and `editor_send_back`, but primary visible dashboard actions are Approve, Request Changes, and Flag Issue. Validate intended UI exposure.

9. **Permission denied UX**  
   Wrong-role access generally redirects to role dashboard or returns API 403; no dedicated permission-denied page was found.

10. **`/admin/sources` manifest coverage**  
    Source Citation Manager is live and navigable, but it is missing from `src/next/pageManifest.js` and Figma export route.

11. **Figma export route exposure**  
    `/figma-export/[pageId]` can render mock-auth protected screens. Validate whether this route should be protected/disabled in production.

12. **Privacy and Terms readiness**  
    Both routes are implemented but contain placeholder/future-home copy.

13. **Legacy artifacts**  
    `dist/` and `public/_redirects` appear legacy/static-SPA related. Validate whether they affect deployment.

14. **Unused RoleDashboard component**  
    `src/next/RoleDashboard.jsx` appears imported but not rendered in export switch cases. Validate whether it is debug-only, deprecated, or intended for future use.

15. **Tests and stories absent**  
    No test/story files were found, so flows are inferred from implementation rather than product acceptance tests.

## Recommended FigJam Structure

### Board Section 1: Product Map / Sitemap

- Create one top-level frame named **RICON UX Architecture**.
- Add grouped columns for:
  - Public Marketing
  - Talent Discovery
  - Developer/API
  - Talent Acquisition
  - Auth and Account
  - Talent Portal
  - Research Workspace
  - Editorial Review
  - Admin Operations
  - System Fallback
  - Design Tooling

### Board Section 2: Screen Inventory by Product Area

- Create one frame per Product Area.
- Use cards named with `[Product Area] / [Sub-area] / [Screen] / [State]`.
- Color-code access:
  - Public: green
  - Auth-aware: blue
  - Role-based: purple
  - Admin: red
  - Unknown/tooling: gray
- Add a confidence badge:
  - Implemented
  - Likely implemented
  - Unclear
  - Deprecated

### Board Section 3: Navigation Model

- Diagram global public nav:
  - Home, About, How It Works, Talent Directory, API Docs, Contact
  - Auth CTA state: Sign In/Sign Up vs role dashboard
  - Footer-only pages
- Diagram protected nav by role:
  - Admin: Dashboard, Sources, Review, Portal
  - Researcher: Workspace
  - Editor: Review
  - Talent: Portal, Review Queue, Products, Earnings, Settings
- Diagram Talent Portal local nav separately.

### Board Section 4: Core User Flows

- Create swimlanes for:
  - Visitor
  - Talent
  - Researcher
  - Editor
  - Admin
  - System/API
- Add the top 10 flows as paths with decision diamonds:
  1. Public Discovery to Talent Profile
  2. Public Education to Lead Capture
  3. Sign In and Role-Based Dashboard Routing
  4. Protected Route Access Recovery
  5. Researcher Draft to Editorial Review
  6. Editor Reviews Submission
  7. Talent Reviews and Approves Profile Changes
  8. Talent Manages Profile Settings
  9. Admin Monitors Pipeline and Opens Work Items
  10. Admin Audits Source Citations

### Board Section 5: States and Recovery

- Group states into:
  - Loading
  - Empty
  - Error
  - Success
  - Warning/Blocking
  - Auth/Permission
  - Mock/Beta/Placeholder
- Link each state back to its parent screen card.

### Board Section 6: Validation Questions

- Create a “Needs Validation” frame with sticky notes for:
  - Lead persistence
  - Sign-up/recovery backend
  - Portal live data
  - Product review actions
  - Earnings live source
  - Workspace profile deep links
  - Review publish/send-back UI
  - Permission denied UX
  - Admin Sources manifest/export coverage
  - Figma export route protection
  - Privacy/Terms readiness
  - Legacy artifacts

### Board Section 7: Suggested Designer Follow-Ups

- Define canonical portal data model and live states.
- Resolve role and permission UX for wrong-role users.
- Specify empty-state recovery actions for every operational dashboard.
- Decide whether admin/reviewer/talent workflows need route-level breadcrumbs.
- Confirm which protected screens need Figma export coverage.
- Turn placeholder legal pages into final content states or mark as launch blockers.
