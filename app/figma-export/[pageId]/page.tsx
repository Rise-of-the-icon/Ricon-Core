import { notFound } from "next/navigation";

import HomeRoute from "@/app/page.jsx";
import AboutRoute from "@/app/about/page.jsx";
import AdminDashboardRoute from "@/app/admin/dashboard/page.jsx";
import ApiRoute from "@/app/api/page.jsx";
import TalentApplyRoute from "@/app/apply/talent/page.jsx";
import ContactRoute from "@/app/contact/page.jsx";
import DataLicensingRoute from "@/app/data-licensing/page.jsx";
import ApiAccessRoute from "@/app/developers/api-access/page.jsx";
import DigitalExperiencesRoute from "@/app/digital-experiences/page.jsx";
import ForgotPasswordRoute from "@/app/forgot-password/page.jsx";
import GamingAiRoute from "@/app/gaming-ai/page.jsx";
import HowItWorksRoute from "@/app/how-it-works/page.jsx";
import LicensingRoute from "@/app/licensing/page.jsx";
import MissionRoute from "@/app/mission/page.jsx";
import PortalEarningsRoute from "@/app/portal/earnings/page.jsx";
import PortalDashboardRoute from "@/app/portal/page.jsx";
import PortalReviewRoute from "@/app/portal/review/page.jsx";
import PortalSettingsRoute from "@/app/portal/settings/page.jsx";
import PrivacyRoute from "@/app/privacy/page.jsx";
import SecurityRoute from "@/app/security/page.jsx";
import SignUpRoute from "@/app/sign-up/page.jsx";
import TalentProfileRoute from "@/app/talent/[talentId]/page.jsx";
import TalentRoute from "@/app/talent/page.jsx";
import TermsRoute from "@/app/terms/page.jsx";
import { AuthProvider } from "@/apps/core/auth/client";
import { createMockUser } from "@/apps/core/auth/src/mock";
import ReviewDashboard from "@/apps/core/review/ReviewDashboard";
import { getReviewDashboardPayload } from "@/apps/core/review/repository";
import SourceCitationManager from "@/apps/core/admin/SourceCitationManager";
import { getSourceCitationDatabase } from "@/apps/core/sources/repository";
import OnboardingHub from "@/apps/core/workspace/OnboardingHub";
import ResearchWorkspace from "@/apps/core/workspace/ResearchWorkspace";
import { getWorkspacePayload } from "@/apps/core/workspace/repository";
import StandalonePageNav from "@/src/components/StandalonePageNav.jsx";
import ProtectedShell from "@/src/next/ProtectedShell.jsx";
import RoleDashboard from "@/src/next/RoleDashboard.jsx";
import { PAGE_MANIFEST } from "@/src/next/pageManifest.js";
import { hasSupabaseEnv } from "@/apps/core/auth";
import { T, font } from "@/src/config/theme.js";
import SignInForm from "@/src/next/SignInForm.jsx";

function MockAuth({
  children,
  email,
  role,
}: {
  children: React.ReactNode;
  email: string;
  role: "admin" | "editor" | "researcher" | "talent";
}) {
  return (
    <AuthProvider
      initialRole={role}
      initialUser={createMockUser({
        email,
        role,
      })}
    >
      {children}
    </AuthProvider>
  );
}

function ExportSignInPage() {
  const isSupabaseEnabled = hasSupabaseEnv();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 16px",
        background:
          "radial-gradient(circle at top right, rgba(0,183,241,0.12), transparent 30%), linear-gradient(180deg, #090B0D 0%, #11161A 100%)",
      }}
    >
      <StandalonePageNav />
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          padding: 32,
          borderRadius: 24,
          border: `1px solid ${T.border}`,
          background: "rgba(17,22,26,0.94)",
          boxShadow: T.shadow,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.cyan,
              fontFamily: font.body,
              marginBottom: 10,
            }}
          >
            Secure Access
          </div>
          <h1
            style={{
              fontSize: 36,
              lineHeight: 1.05,
              fontWeight: 800,
              color: T.paper,
              fontFamily: font.display,
              marginBottom: 12,
            }}
          >
            Sign in to RICON
          </h1>
          <p style={{ color: T.mutedLight, fontFamily: font.body }}>
            {isSupabaseEnabled
              ? "Authentication is handled by Supabase with role-based routing, password recovery, and verification-aware onboarding."
              : "Mock mode is active because Supabase environment variables are not configured yet. This still exercises the real route protection and role redirects."}
          </p>
        </div>

        <SignInForm isMockMode={!isSupabaseEnabled} nextPath={null} />
        <div
          style={{
            marginTop: 18,
            fontSize: 13,
            color: T.mutedLight,
            lineHeight: 1.7,
            fontFamily: font.body,
          }}
        >
          New here?{" "}
          <a
            href="/sign-up"
            style={{ color: T.cyan, textDecoration: "none", fontWeight: 700 }}
          >
            Create an account
          </a>
          .
        </div>
      </div>
    </div>
  );
}

function PageManifestApiExport() {
  const manifestJson = JSON.stringify(PAGE_MANIFEST, null, 2);

  return (
    <ProtectedShell
      page="admin-dashboard"
      title="Page Manifest API"
      subtitle="Export and tracking inventory for scripted capture workflows."
    >
      <section
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {[
            { label: "Endpoint", value: "/api/page-manifest" },
            { label: "Exportable Pages", value: PAGE_MANIFEST.filter((page) => page.exportable).length },
            { label: "Protected Screens", value: PAGE_MANIFEST.filter((page) => page.visibility === "protected").length },
          ].map((item) => (
            <article
              key={item.label}
              style={{
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${T.border}`,
                background: T.panel,
              }}
            >
              <div style={{ color: T.mutedLight, fontSize: 12 }}>{item.label}</div>
              <div
                style={{
                  marginTop: 6,
                  color: T.paper,
                  fontSize: typeof item.value === "number" ? 32 : 18,
                  fontFamily: typeof item.value === "number" ? font.display : font.mono,
                  fontWeight: 800,
                }}
              >
                {item.value}
              </div>
            </article>
          ))}
        </div>

        <pre
          style={{
            margin: 0,
            padding: 18,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            background: T.ink,
            color: T.paperDim,
            fontFamily: font.mono,
            fontSize: 12,
            lineHeight: 1.65,
            overflow: "auto",
            maxHeight: 640,
            whiteSpace: "pre-wrap",
          }}
        >
          {manifestJson}
        </pre>
      </section>
    </ProtectedShell>
  );
}

export default async function FigmaExportPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;

  switch (pageId) {
    case "home":
      return <HomeRoute />;
    case "about":
      return <AboutRoute />;
    case "mission":
      return <MissionRoute />;
    case "how-it-works":
      return <HowItWorksRoute />;
    case "contact":
      return <ContactRoute />;
    case "security":
      return <SecurityRoute />;
    case "privacy":
      return <PrivacyRoute />;
    case "terms":
      return <TermsRoute />;
    case "licensing":
      return <LicensingRoute />;
    case "data-licensing":
      return <DataLicensingRoute />;
    case "digital-experiences":
      return <DigitalExperiencesRoute />;
    case "gaming-ai":
      return <GamingAiRoute />;
    case "talent":
      return <TalentRoute />;
    case "talent-profile":
      return <TalentProfileRoute params={{ talentId: "1" }} />;
    case "api":
      return <ApiRoute />;
    case "page-manifest-api":
      return (
        <MockAuth email="admin@ricon.local" role="admin">
          <PageManifestApiExport />
        </MockAuth>
      );
    case "talent-apply":
      return <TalentApplyRoute />;
    case "api-access":
      return <ApiAccessRoute />;
    case "sign-in":
      return <ExportSignInPage />;
    case "sign-up":
      return <SignUpRoute />;
    case "forgot-password":
      return <ForgotPasswordRoute />;
    case "talent-dash":
      return (
        <MockAuth email="talent@ricon.local" role="talent">
          <PortalDashboardRoute />
        </MockAuth>
      );
    case "talent-review":
      return (
        <MockAuth email="talent@ricon.local" role="talent">
          <PortalReviewRoute />
        </MockAuth>
      );
    case "talent-earnings":
      return (
        <MockAuth email="talent@ricon.local" role="talent">
          <PortalEarningsRoute />
        </MockAuth>
      );
    case "talent-settings":
      return (
        <MockAuth email="talent@ricon.local" role="talent">
          <PortalSettingsRoute />
        </MockAuth>
      );
    case "admin-dashboard":
      return (
        <MockAuth email="admin@ricon.local" role="admin">
          <AdminDashboardRoute />
        </MockAuth>
      );
    case "admin-sources": {
      const sources = await getSourceCitationDatabase();

      return (
        <MockAuth email="admin@ricon.local" role="admin">
          <SourceCitationManager initialSources={sources} />
        </MockAuth>
      );
    }
    case "onboarding-hub": {
      const profiles = [
        {
          id: "david-west",
          name: "David West",
          status: "draft" as const,
          updatedAt: new Date().toISOString(),
          completion: 7,
        },
      ];

      return (
        <MockAuth email="researcher@ricon.local" role="researcher">
          <OnboardingHub initialProfiles={profiles} />
        </MockAuth>
      );
    }
    case "admin-onboardings":
      return (
        <MockAuth email="admin@ricon.local" role="admin">
          <OnboardingHub initialProfiles={[]} />
        </MockAuth>
      );
    case "workspace":
    case "workspace-identity":
    case "workspace-career":
    case "workspace-stats":
    case "workspace-media":
    case "workspace-review": {
      const user = createMockUser({
        email: "researcher@ricon.local",
        role: "researcher",
      });
      const payload = await getWorkspacePayload("jason-kidd", "mock-researcher", user);
      if (!payload) return null;

      const stepMap = {
        workspace: "identity",
        "workspace-identity": "identity",
        "workspace-career": "career",
        "workspace-stats": "stats",
        "workspace-media": "media",
        "workspace-review": "review",
      } as const;

      return (
        <MockAuth email="researcher@ricon.local" role="researcher">
          <ResearchWorkspace initialPayload={payload} initialStep={stepMap[pageId]} />
        </MockAuth>
      );
    }
    case "review": {
      const payload = await getReviewDashboardPayload();

      return (
        <MockAuth email="editor@ricon.local" role="editor">
          <ReviewDashboard initialPayload={payload} />
        </MockAuth>
      );
    }
    case "review-request-changes": {
      const payload = await getReviewDashboardPayload();

      return (
        <MockAuth email="editor@ricon.local" role="editor">
          <ReviewDashboard
            initialModalAction="editor_request_changes"
            initialPayload={payload}
          />
        </MockAuth>
      );
    }
    case "review-flag-issue": {
      const payload = await getReviewDashboardPayload();

      return (
        <MockAuth email="editor@ricon.local" role="editor">
          <ReviewDashboard
            initialModalAction="editor_flag_issue"
            initialPayload={payload}
          />
        </MockAuth>
      );
    }
    default:
      notFound();
  }
}
