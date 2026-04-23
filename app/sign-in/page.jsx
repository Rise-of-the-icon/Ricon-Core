import { hasSupabaseEnv } from "@/apps/core/auth";
import StandalonePageNav from "@/src/components/StandalonePageNav.jsx";
import { T, font } from "@/src/config/theme.js";
import PageTracker from "@/src/next/PageTracker.jsx";
import SignInForm from "@/src/next/SignInForm.jsx";

export default async function SignInPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const isSupabaseEnabled = hasSupabaseEnv();
  const isSwitchMode = !isSupabaseEnabled && resolvedSearchParams?.switch === "1";
  const nextPath = typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : null;

  return (
    <PageTracker page="sign-in">
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
        <StandalonePageNav minimal />
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
            {nextPath ? (
              <div
                style={{
                  marginTop: 14,
                  padding: "16px",
                  borderRadius: T.radiusMd,
                  border: `1px solid ${T.border}`,
                  background: T.ink,
                  color: T.mutedLight,
                  fontSize: 12,
                  fontFamily: font.body,
                }}
              >
                Sign in to continue to <span style={{ color: T.paper }}>{nextPath}</span>.
              </div>
            ) : null}
            {isSwitchMode ? (
              <div
                style={{
                  marginTop: 14,
                  padding: "16px",
                  borderRadius: T.radiusMd,
                  border: `1px solid ${T.border}`,
                  background: T.ink,
                  color: T.mutedLight,
                  fontSize: 12,
                  fontFamily: font.body,
                }}
              >
                Switch mode is enabled. Pick a different role and sign in again to replace the
                current mock session.
              </div>
            ) : null}
          </div>

          <SignInForm isMockMode={!isSupabaseEnabled} nextPath={nextPath} />
          <div style={{ marginTop: 18, fontSize: 13, color: T.mutedLight, lineHeight: 1.7, fontFamily: font.body }}>
            New here? <a href="/sign-up" style={{ color: T.cyan, textDecoration: "none", fontWeight: 700 }}>Create an account</a>.
          </div>
        </div>
      </div>
    </PageTracker>
  );
}
