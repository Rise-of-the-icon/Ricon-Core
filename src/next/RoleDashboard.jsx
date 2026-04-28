"use client";

import { rolePermissions, useAuth } from "@/apps/core/auth/client";
import { T, font } from "@/src/config/theme.js";

import ProtectedShell from "./ProtectedShell.jsx";

export default function RoleDashboard({ page, requiredRole, subtitle, title }) {
  const { role, user } = useAuth();
  const permissions = role ? rolePermissions[role] : [];

  return (
    <ProtectedShell page={page} title={title} subtitle={subtitle}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Signed In As", value: user?.email ?? "Unknown" },
          { label: "Resolved Role", value: role ?? "none" },
          { label: "Required Role", value: requiredRole },
          { label: "Status", value: role === requiredRole || role === "admin" ? "Authorized" : "Mismatch" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: 24,
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
              boxShadow: T.shadowSm,
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: T.muted,
                fontFamily: font.body,
                marginBottom: 8,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: 20,
                color: T.paper,
                fontFamily: font.display,
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 24,
          borderRadius: 20,
          border: `1px solid ${T.border}`,
          background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
          boxShadow: T.shadowSm,
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: T.cyan,
            fontFamily: font.body,
            marginBottom: 12,
          }}
        >
          Effective Permissions
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {permissions.map((permission) => (
            <span
              key={permission}
              style={{
                minHeight: T.controlMd,
                padding: "0 16px",
                borderRadius: 999,
                background: T.cyanDim,
                border: `1px solid ${T.cyanMid}`,
                color: T.paper,
                fontFamily: font.mono,
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {permission}
            </span>
          ))}
        </div>
      </div>
    </ProtectedShell>
  );
}
