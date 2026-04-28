"use client";

import { usePathname } from "next/navigation";

import {
  getProtectedNavigationItems,
  hasSupabaseEnv,
  useAuth,
} from "@/apps/core/auth/client";
import { T, buttonReset, font } from "@/src/config/theme.js";
import { useViewport } from "@/src/hooks/useViewport.js";

import PageTracker from "./PageTracker.jsx";

function formatRole(role) {
  if (!role) {
    return "Unknown";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * @param {{
 *   children: import("react").ReactNode;
 *   headerContent?: import("react").ReactNode;
 *   page: string;
 *   routeParams?: Record<string, string | number>;
 *   subtitle: string;
 *   title: string;
 * }} props
 */
export default function ProtectedShell({
  children,
  headerContent = null,
  page,
  routeParams,
  subtitle,
  title,
}) {
  const pathname = usePathname();
  const { role, signOut, user } = useAuth();
  const { isMobile, isTablet } = useViewport();
  const isMockMode = !hasSupabaseEnv();
  const protectedNavItems = getProtectedNavigationItems(role);

  async function handleSignOut() {
    await signOut();
    if (typeof window !== "undefined") {
      window.location.assign("/sign-in");
    }
  }

  return (
    <PageTracker page={page} routeParams={routeParams}>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
          background:
            `radial-gradient(circle at top left, ${T.cyanDim}, transparent 28%), radial-gradient(circle at bottom right, rgba(59,130,246,0.08), transparent 24%), linear-gradient(180deg, ${T.ink} 0%, ${T.inkLight} 100%)`,
        }}
      >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 16,
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "14px 16px" : "16px 24px",
          borderBottom: `1px solid ${T.borderLight}`,
          background: T.glass,
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: T.paperDim,
              fontFamily: font.body,
              marginBottom: 4,
            }}
          >
            {formatRole(role)} Access
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              fontFamily: font.display,
              color: T.paper,
              letterSpacing: "-0.04em",
            }}
          >
            RICON Core
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", width: isMobile ? "100%" : "auto", minWidth: 0 }}>
          {headerContent}
          <div
            style={{
              minHeight: T.controlMd,
              padding: "0 16px",
              borderRadius: 999,
              border: `1px solid ${T.border}`,
              background: T.panel,
              color: T.paperDim,
              fontSize: 12,
              fontFamily: font.mono,
              maxWidth: isMobile ? "100%" : 260,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {user?.email ?? "No active session"}
          </div>
          <a
            href="/"
            style={{
              color: T.paper,
              textDecoration: "none",
              minHeight: T.controlMd,
              padding: "0 16px",
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
              display: "inline-flex",
              alignItems: "center",
              boxShadow: T.shadowSm,
            }}
          >
            Public Site
          </a>
          {isMockMode ? (
            <a
              href="/sign-in?switch=1"
              style={{
                color: T.paper,
                textDecoration: "none",
                minHeight: T.controlMd,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${T.border}`,
                background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
                display: "inline-flex",
                alignItems: "center",
                boxShadow: T.shadowSm,
              }}
            >
              Switch Role
            </a>
          ) : null}
          <button
            type="button"
            onClick={handleSignOut}
            style={{
              ...buttonReset,
              cursor: "pointer",
              minHeight: T.controlMd,
              padding: "0 16px",
              borderRadius: 12,
              background: T.brandGradient,
              color: T.paper,
              fontWeight: 700,
              boxShadow: T.shadowSm,
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1100,
          width: "100%",
          minWidth: 0,
          margin: "0 auto",
          padding: isMobile ? "28px 16px 56px" : isTablet ? "36px 20px 72px" : "48px 24px 80px",
        }}
      >
        {protectedNavItems.length ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: isMobile ? "nowrap" : "wrap",
              marginBottom: 24,
              overflowX: isMobile ? "auto" : "visible",
              paddingBottom: isMobile ? 4 : 0,
            }}
          >
            {protectedNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    padding: "8px 12px",
                    minHeight: T.controlMd,
                    borderRadius: 999,
                    border: `1px solid ${isActive ? T.cyanMid : T.border}`,
                    background: isActive ? T.cyanDim : `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
                    color: isActive ? T.paper : T.paperDim,
                    textDecoration: "none",
                    fontSize: 12,
                    fontFamily: font.body,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        ) : null}

        <div style={{ maxWidth: 720, minWidth: 0, marginBottom: 28 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: T.cyan,
              fontFamily: font.body,
              marginBottom: 10,
            }}
          >
            Protected Route
          </div>
          <h1
            style={{
              fontSize: isMobile ? 32 : isTablet ? 38 : 44,
              lineHeight: 1.05,
              fontWeight: 800,
              color: T.paper,
              fontFamily: font.display,
              marginBottom: 12,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </h1>
          <p style={{ color: T.mutedLight, fontFamily: font.body, fontSize: 16, overflowWrap: "anywhere" }}>
            {subtitle}
          </p>
        </div>

        {children}
      </main>
      </div>
    </PageTracker>
  );
}
