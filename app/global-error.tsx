"use client";

import { T, font } from "@/src/config/theme.js";
import { Btn } from "@/src/components/ui.jsx";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          padding: 24,
          background:
            "radial-gradient(circle at top left, rgba(0,183,241,0.08), transparent 28%), linear-gradient(180deg, #090B0D 0%, #11161A 100%)",
          color: T.paper,
          fontFamily: font.body,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
            background: T.inkLight,
            padding: 28,
            boxShadow: T.shadow,
          }}
        >
          <div style={{ fontSize: 12, color: T.cyan, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            500 Fallback
          </div>
          <h1 style={{ margin: 0, fontSize: 34, fontFamily: font.display }}>
            Something went wrong.
          </h1>
          <p style={{ color: T.mutedLight, lineHeight: 1.6, margin: "12px 0 16px" }}>
            We could not render this page. Try again or go back to a stable route.
          </p>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: T.ink,
              color: T.paperDim,
              fontSize: 12,
              fontFamily: font.mono,
              marginBottom: 16,
              overflowWrap: "anywhere",
            }}
          >
            {error?.message ?? "Unknown server error"}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn onClick={reset}>Retry</Btn>
            <Btn href="/" variant="secondary">
              Back Home
            </Btn>
          </div>
        </div>
      </body>
    </html>
  );
}
