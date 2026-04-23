"use client";

import { useEffect } from "react";

import { T, font } from "@/src/config/theme.js";
import { Btn } from "@/src/components/ui.jsx";

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top left, rgba(0,183,241,0.08), transparent 28%), linear-gradient(180deg, #090B0D 0%, #11161A 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 28,
          borderRadius: 20,
          border: `1px solid ${T.border}`,
          background: T.inkLight,
          boxShadow: T.shadow,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: T.cyan,
            fontFamily: font.body,
            marginBottom: 10,
          }}
        >
          Review Dashboard Error
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 36,
            lineHeight: 1.05,
            fontWeight: 800,
            color: T.paper,
            fontFamily: font.display,
          }}
        >
          The editor workspace could not be rendered.
        </h1>
        <p
          style={{
            margin: "12px 0 18px",
            color: T.mutedLight,
            fontFamily: font.body,
            lineHeight: 1.6,
          }}
        >
          This is usually caused by malformed review data or an incomplete Supabase role/configuration setup.
        </p>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 14,
            border: `1px solid ${T.border}`,
            background: T.ink,
            color: T.paperDim,
            fontFamily: font.mono,
            fontSize: 12,
            marginBottom: 18,
            overflowWrap: "anywhere",
          }}
        >
          {error.message || "Unknown review error"}
        </div>
        <Btn onClick={reset} small={false}>
          Retry
        </Btn>
      </div>
    </div>
  );
}
