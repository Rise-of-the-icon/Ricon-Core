"use client";

import { T } from "@/src/config/theme.js";

export default function RouteFallback({ viewport, lines = 3 }) {
  const isMobile = viewport?.isMobile;
  const skeletonLines = Array.from({ length: lines });

  return (
    <section
      aria-label="Loading content"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: isMobile ? "32px 16px" : "48px 24px",
      }}
    >
      <div
        style={{
          borderRadius: 20,
          border: `1px solid ${T.border}`,
          background: T.panel,
          padding: isMobile ? 18 : 24,
          display: "grid",
          gap: 12,
        }}
      >
        <div className="skeleton" style={{ height: 18, width: "34%", borderRadius: 8, background: "rgba(255,255,255,0.08)" }} />
        <div className="skeleton" style={{ height: 44, width: "72%", borderRadius: 10, background: "rgba(255,255,255,0.08)" }} />
        {skeletonLines.map((_line, index) => (
          <div
            key={index}
            className="skeleton"
            style={{
              height: 14,
              width: index === skeletonLines.length - 1 ? "58%" : "100%",
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
