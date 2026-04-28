"use client";

import { T } from "@/src/config/theme.js";

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${T.border}`,
        borderTopColor: T.cyan,
        display: "inline-block",
        animation: "ricon-spin 0.8s linear infinite",
      }}
    />
  );
}

export function SkeletonBlock({
  height,
  width = "100%",
  radius = 12,
}: {
  height: number;
  width?: string | number;
  radius?: number;
}) {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        borderRadius: radius,
        background: "rgba(255,255,255,0.08)",
      }}
    />
  );
}
