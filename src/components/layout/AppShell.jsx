"use client";

import { useEffect, useRef, useState } from "react";

import {
  getDashboardForRole,
  hasSupabaseEnv,
  useAuth,
} from "@/apps/core/auth/client";

import { T, buttonReset, font } from "../../config/theme.js";
import { NAV_ITEMS, SOCIAL_LINKS } from "../../data/siteData.js";
import { Btn, Icon } from "../ui.jsx";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Talent Directory", href: "/talent" },
      { label: "API Docs", href: "/api" },
      { label: "Apply as Talent", href: "/apply/talent" },
      { label: "Get API Access", href: "/developers/api-access" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Mission", href: "/mission" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "Security", href: "/security" },
      { label: "Sign in", href: "/sign-in" },
      { label: "Create account", href: "/sign-up" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Licensing", href: "/licensing" },
    ],
  },
];

export default function AppShell({
  children,
  page,
  nav,
  mobileMenu,
  setMobileMenu,
  isPortal,
  showCompactNav,
  viewport,
}) {
  const { isMobile, isTabletOnly, isTablet } = viewport;
  const mainRef = useRef(null);
  const previousPageRef = useRef(page);
  const mobileMenuId = "primary-navigation-menu";
  const { role, signOut, user } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isMockMode = !hasSupabaseEnv();
  const dashboardRoute = getDashboardForRole(role);
  const authLabel = user
    ? role === "admin"
      ? "Admin"
      : role === "researcher"
        ? "Workspace"
        : role === "editor"
          ? "Review"
          : "Portal"
    : "Sign In";
  const authTarget = user
    ? dashboardRoute === "/admin/dashboard"
      ? "admin-dashboard"
      : dashboardRoute === "/workspace"
        ? "workspace"
        : dashboardRoute === "/review"
          ? "review"
          : "portal"
    : "sign-in";

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 520);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (previousPageRef.current === page) {
      return;
    }

    mainRef.current?.focus?.({ preventScroll: true });
    previousPageRef.current = page;
    setMobileMenu(false);
  }, [page, setMobileMenu]);

  const navHeight = isMobile ? 68 : 72;

  const navigateTo = (target, id) => {
    setMobileMenu(false);
    nav(target, id);
  };

  async function handleSignOut() {
    await signOut();
    if (typeof window !== "undefined") {
      window.location.assign("/sign-in");
    }
  }

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterMessage(
      newsletterEmail
        ? "Thanks. We will send verification updates to your inbox."
        : "Enter an email address to join the newsletter."
    );
  };

  const actionButtons = (
    <>
      {user && isMockMode ? (
        <Btn small variant="secondary" onClick={() => navigateTo("sign-in-switch")}>
          Switch role
        </Btn>
      ) : null}
      <Btn small variant={user ? "primary" : "secondary"} onClick={() => navigateTo(authTarget)}>
        {authLabel}
      </Btn>
      {!user ? (
        <Btn small variant="outline" href="/sign-up">
          Sign up
        </Btn>
      ) : null}
      {user ? (
        <Btn small variant="secondary" onClick={handleSignOut}>
          Sign out
        </Btn>
      ) : null}
    </>
  );

  return (
    <div
      style={{
        fontFamily: font.body,
        background: T.ink,
        minHeight: "100vh",
        color: T.paper,
        backgroundImage:
          "radial-gradient(800px 360px at 80% -10%, rgba(107,92,255,0.16), transparent 60%), radial-gradient(640px 300px at 110% 110%, rgba(60,200,255,0.1), transparent 65%)",
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: T.glass,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.borderLight}`,
          padding: isMobile ? "0 16px" : "0 24px",
          minHeight: navHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a
          href="/"
          aria-label="Go to the RICON home page"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <img
            src="/Ricon_logo.svg"
            alt="RICON logo"
            style={{
              height: 26,
              width: "auto",
              filter: "invert(1)",
              display: "block",
            }}
          />
          {!isTablet ? (
            <span
              style={{
                fontSize: 10,
                fontFamily: font.mono,
                color: T.muted,
                padding: "4px 8px",
                background: "rgba(107,92,255,0.14)",
                border: "1px solid rgba(107,92,255,0.32)",
                borderRadius: T.radiusFull,
              }}
            >
              beta
            </span>
          ) : null}
        </a>

        {!isTablet ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1, justifyContent: "center" }}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "/" : `/${item.id}`}
                aria-current={!isPortal && page === item.id ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 42,
                  padding: "0 16px",
                  border: "1px solid transparent",
                  borderRadius: T.radiusSm,
                  background: page === item.id ? "rgba(107,92,255,0.12)" : "transparent",
                  color: page === item.id ? "#dbd6ff" : T.mutedLight,
                  boxShadow: page === item.id ? `inset 2px 0 0 ${T.brandPrimary}` : "none",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Icon name={item.icon} size={16} color={page === item.id ? T.cyan : T.muted} />
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {!isTablet ? (
            actionButtons
          ) : isTabletOnly ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {actionButtons}
            </div>
          ) : (
            <button
              type="button"
              aria-label={mobileMenu ? "Close navigation menu" : "Open navigation menu"}
              aria-controls={mobileMenuId}
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((open) => !open)}
              style={{
                ...buttonReset,
                width: 44,
                height: 44,
                borderRadius: 10,
                background: T.card,
                border: `1px solid ${T.borderLight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.paper,
                cursor: "pointer",
              }}
            >
              <Icon name={mobileMenu ? "x" : "menu"} size={18} color={T.paper} />
            </button>
          )}
        </div>
      </nav>

      {isTabletOnly ? (
        <div
          style={{
            position: "sticky",
            top: navHeight,
            zIndex: 99,
            padding: "8px 24px 16px",
            background: "rgba(10,11,16,0.92)",
            backdropFilter: "blur(18px)",
            borderBottom: `1px solid ${T.borderLight}`,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 2,
              scrollbarWidth: "none",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "/" : `/${item.id}`}
                aria-current={!isPortal && page === item.id ? "page" : undefined}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                  minHeight: 42,
                  padding: "0 16px",
                  border: page === item.id ? "1px solid rgba(107,92,255,0.4)" : `1px solid ${T.borderLight}`,
                  borderRadius: T.radiusSm,
                  background: page === item.id ? "rgba(107,92,255,0.18)" : T.card,
                  color: page === item.id ? "#dbd6ff" : T.mutedLight,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Icon name={item.icon} size={15} color={page === item.id ? T.cyan : T.muted} />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {showCompactNav && mobileMenu ? (
        <div
          id={mobileMenuId}
          style={{
            position: "sticky",
            top: navHeight,
            zIndex: 99,
            padding: "8px 16px 16px",
            background: "rgba(10,11,16,0.96)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.borderLight}`,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "/" : `/${item.id}`}
                aria-current={!isPortal && page === item.id ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  minHeight: 52,
                  padding: "0 16px",
                  border: page === item.id ? "1px solid rgba(107,92,255,0.4)" : `1px solid ${T.borderLight}`,
                  borderRadius: T.radiusSm,
                  background: page === item.id ? "rgba(107,92,255,0.18)" : T.card,
                  color: page === item.id ? "#dbd6ff" : T.mutedLight,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Icon name={item.icon} size={16} color={page === item.id ? T.cyan : T.muted} />
                {item.label}
              </a>
            ))}
            <div
              style={{
                display: "grid",
                gap: 10,
                paddingTop: 4,
                borderTop: `1px solid ${T.borderLight}`,
              }}
            >
              {actionButtons}
            </div>
          </div>
        </div>
      ) : null}

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {children}
      </main>

      {!isPortal ? (
        <footer
          style={{
            borderTop: `1px solid ${T.borderLight}`,
            padding: isMobile ? "32px 16px" : "44px 24px",
            marginTop: 40,
            background: T.inkLight,
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.1fr) minmax(0, 0.9fr)",
              gap: isMobile ? 28 : 36,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <img
                  src="/Ricon_logo.svg"
                  alt="RICON logo"
                  style={{
                    height: 22,
                    width: "auto",
                    filter: "invert(1)",
                    display: "block",
                  }}
                />
              </div>
              <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.8, maxWidth: 420, marginBottom: 18 }}>
                RICON exists to give talent an authoritative way to own their stories while helping organizations build on trustworthy biographical information.
              </p>
              <form onSubmit={handleNewsletterSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.paper }}>Newsletter</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: 10,
                    }}
                  >
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                      placeholder="you@example.com"
                      aria-label="Email address"
                      style={{
                        flex: 1,
                        minHeight: 48,
                        padding: "0 16px",
                        borderRadius: 10,
                        border: `1px solid ${T.border}`,
                        background: T.card,
                        color: T.paper,
                      }}
                    />
                    <Btn variant="primary" style={{ minWidth: isMobile ? "100%" : 150 }}>
                      Join newsletter
                    </Btn>
                  </div>
                </label>
                {newsletterMessage ? (
                  <div role="status" aria-live="polite" style={{ fontSize: 13, color: T.green }}>
                    {newsletterMessage}
                  </div>
                ) : null}
              </form>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, minmax(120px, 1fr))", gap: isMobile ? 20 : 28 }}>
              {footerColumns.map((col) => (
                <div key={col.title} style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: T.paper, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    {col.title}
                  </div>
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        display: "block",
                        fontSize: 13,
                        color: T.mutedLight,
                        lineHeight: 1.8,
                        textDecoration: "none",
                        marginBottom: 4,
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.paper, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  Follow
                </div>
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      fontSize: 13,
                      color: T.mutedLight,
                      lineHeight: 1.8,
                      textDecoration: "none",
                      marginBottom: 4,
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              maxWidth: 1100,
              margin: "24px auto 0",
              paddingTop: 24,
              borderTop: `1px solid ${T.borderLight}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 11, color: T.muted, fontFamily: font.body }}>
              © 2026 Rise of the Icon, Inc. All rights reserved.
            </span>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: font.body }}>
              Verification-first profiles for talent, fans, and partners.
            </span>
          </div>
        </footer>
      ) : null}

      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{
            ...buttonReset,
            position: "fixed",
            right: 18,
            bottom: 18,
            width: 52,
            height: 52,
            borderRadius: 999,
            background: T.brandPrimary,
            color: T.paper,
            boxShadow: T.shadow,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            zIndex: 110,
          }}
        >
          <Icon name="arrowUp" size={18} color={T.paper} />
        </button>
      ) : null}
    </div>
  );
}
