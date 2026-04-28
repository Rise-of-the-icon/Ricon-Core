"use client";

import { usePathname } from "next/navigation";

import { T, font } from "../config/theme.js";
import { NAV_ITEMS } from "../data/siteData.js";
import { useViewport } from "../hooks/useViewport.js";

export default function StandalonePageNav({ minimal = false }) {
  const pathname = usePathname();
  const { isMobile, isTablet } = useViewport();
  const showFullNav = !minimal && !isTablet;

  const navLinkStyle = (active) => ({
    minHeight: 42,
    padding: "0 14px",
    borderRadius: T.radiusSm,
    border: `1px solid ${active ? "rgba(107,92,255,0.4)" : "transparent"}`,
    background: active ? "rgba(107,92,255,0.12)" : "transparent",
    color: active ? "#dbd6ff" : T.mutedLight,
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    fontFamily: font.body,
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
  });

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        minHeight: isMobile ? 64 : 72,
        padding: isMobile ? "0 16px" : "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderBottom: `1px solid ${T.borderLight}`,
        background: T.glass,
        backdropFilter: "blur(20px)",
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
          flexShrink: 0,
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

      {showFullNav ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1, justifyContent: "center" }}>
          {NAV_ITEMS.map((item) => {
            const href = item.id === "home" ? "/" : `/${item.id}`;
            const isActive = pathname === href;

            return (
              <a key={item.id} href={href} aria-current={isActive ? "page" : undefined} style={navLinkStyle(isActive)}>
                {item.label}
              </a>
            );
          })}
        </div>
      ) : null}

      {!minimal ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <a href="/sign-in" style={navLinkStyle(pathname === "/sign-in")}>
            Sign in
          </a>
          {!isMobile ? (
            <a href="/sign-up" style={navLinkStyle(pathname === "/sign-up")}>
              Sign up
            </a>
          ) : null}
        </div>
      ) : (
        <div aria-hidden="true" style={{ width: 1 }} />
      )}
    </nav>
  );
}
