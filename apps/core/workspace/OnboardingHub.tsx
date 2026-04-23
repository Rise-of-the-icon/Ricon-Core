"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";

import ProtectedShell from "@/src/next/ProtectedShell.jsx";
import { T, font } from "@/src/config/theme.js";
import { useViewport } from "@/src/hooks/useViewport.js";

import { slugify } from "./constants";
import { statusAccent, statusLabels } from "./constants";
import type { ProfileStatus, WorkspacePayload } from "./types";

interface ProfileSummary {
  id: string;
  name: string;
  status: ProfileStatus;
  updatedAt: string;
  completion: number;
}

const reset: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: "none",
  background: "none",
  font: "inherit",
};

export default function OnboardingHub({
  initialProfiles,
}: {
  initialProfiles: ProfileSummary[];
}) {
  const router = useRouter();
  const { isMobile, isTablet } = useViewport();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewSlug = slugTouched ? slug : slugify(name);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || isCreating) return;
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/workspace/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slugTouched ? slug : undefined }),
      });
      const payload = (await res.json()) as WorkspacePayload & { error?: string };
      if (!res.ok || !("profile" in payload)) {
        setError(payload.error ?? "Could not start onboarding.");
        setIsCreating(false);
        return;
      }
      setProfiles((prev) => [
        {
          id: payload.profile.id,
          name: payload.profile.name.value || name.trim(),
          status: payload.profile.status,
          updatedAt: payload.profile.updatedAt,
          completion: 0,
        },
        ...prev,
      ]);
      router.push(`/workspace/${payload.profile.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setIsCreating(false);
    }
  }

  return (
    <ProtectedShell
      page="workspace"
      title="Talent onboarding"
      subtitle="Start a new player profile or continue one in progress."
    >
      <div
        style={{
          display: "grid",
          gap: 24,
          maxWidth: 960,
          width: "100%",
          minWidth: 0,
          margin: "0 auto",
          padding: "8px 0 32px",
        }}
      >
        {/* Hero / new-onboarding form */}
        <section
          style={{
            padding: isMobile ? 18 : 28,
            minWidth: 0,
            borderRadius: 22,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(160deg, rgba(107,92,255,0.18), rgba(0,183,241,0.08)), ${T.panelStrong}`,
            boxShadow: T.shadowSm,
          }}
        >
          <div
            style={{
              color: T.mutedLight,
              fontSize: 11,
              fontFamily: font.mono,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: 10,
            }}
          >
            Start
          </div>
          <h1
            style={{
              color: T.paper,
              fontFamily: font.display,
              fontSize: 28,
              lineHeight: 1.1,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Onboard a new player
          </h1>
          <p style={{ color: T.mutedLight, fontSize: 14, lineHeight: 1.55, maxWidth: 620 }}>
            Enter the player's display name to open a blank profile. You can refine the slug, add
            sources, and submit for editorial review from inside the workspace.
          </p>

          <form
            onSubmit={handleCreate}
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1.4fr) minmax(0, 1fr) auto",
              gap: 10,
              alignItems: "end",
              minWidth: 0,
            }}
          >
            <label style={{ display: "grid", gap: 6, minWidth: 0 }}>
              <span style={{ color: T.paper, fontSize: 12, fontWeight: 600, fontFamily: font.body }}>
                Player name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Victor Wembanyama"
                required
                style={inputStyle}
              />
            </label>
            <label style={{ display: "grid", gap: 6, minWidth: 0 }}>
              <span style={{ color: T.paper, fontSize: 12, fontWeight: 600, fontFamily: font.body }}>
                URL slug
              </span>
              <input
                value={slugTouched ? slug : previewSlug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="auto-generated"
                style={{ ...inputStyle, fontFamily: font.mono, fontSize: 13 }}
              />
            </label>
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              style={{
                ...reset,
                minHeight: 46,
                padding: "0 22px",
                width: isMobile || isTablet ? "100%" : "auto",
                gridColumn: isMobile || isTablet ? "1 / -1" : undefined,
                borderRadius: 12,
                background: !name.trim() ? T.inkMid : T.brandPrimary,
                color: T.paper,
                fontWeight: 800,
                cursor: !name.trim() || isCreating ? "not-allowed" : "pointer",
              }}
            >
              {isCreating ? "Creating…" : "Start onboarding →"}
            </button>
          </form>

          {error ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 12,
                border: `1px solid ${T.orange}`,
                background: "rgba(255,122,104,0.12)",
                color: T.paper,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          ) : null}
        </section>

        {/* In-progress list */}
        <section style={{ display: "grid", gap: 14 }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2
              style={{
                color: T.paper,
                fontFamily: font.display,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              In progress
            </h2>
            <span style={{ color: T.mutedLight, fontSize: 12, fontFamily: font.mono }}>
              {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
            </span>
          </header>

          {profiles.length === 0 ? (
            <div
              style={{
                padding: 28,
                borderRadius: 16,
                border: `1px dashed ${T.border}`,
                color: T.mutedLight,
                textAlign: "center",
                fontSize: 14,
              }}
            >
              No onboardings yet. Start one above to see it here.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {profiles.map((p) => (
                <Link
                  key={p.id}
                  href={`/workspace/${p.id}`}
                  style={{
                    textDecoration: "none",
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "minmax(0, 1fr) auto"
                      : isTablet
                        ? "minmax(0, 1fr) auto"
                        : "minmax(0, 1fr) 140px 180px 44px",
                    gap: isMobile ? 10 : 16,
                    alignItems: isMobile ? "start" : "center",
                    padding: "16px 18px",
                    borderRadius: 14,
                    border: `1px solid ${T.borderLight}`,
                    background: T.card,
                    color: T.paper,
                    minWidth: 0,
                    transition: "border-color 120ms ease, background 120ms ease",
                  }}
                >
                  <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, overflowWrap: "anywhere" }}>{p.name}</div>
                    <div style={{ color: T.muted, fontSize: 11, fontFamily: font.mono, overflowWrap: "anywhere" }}>/{p.id}</div>
                  </div>
                  <div style={{ justifySelf: isMobile || isTablet ? "end" : "start" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: statusAccent[p.status],
                        border: `1px solid ${T.border}`,
                        fontSize: 11,
                        color: T.paper,
                      }}
                    >
                      {statusLabels[p.status]}
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div
                      style={{
                        height: 4,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${p.completion}%`,
                          height: "100%",
                          background: p.completion === 100 ? T.green : T.brandPrimary,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: T.mutedLight, fontFamily: font.mono }}>
                      {p.completion}% complete · updated {relativeTime(p.updatedAt)}
                    </div>
                  </div>
                  <div style={{ color: T.mutedLight, fontSize: 20, textAlign: "right", alignSelf: "center" }}>→</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedShell>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 46,
  padding: "0 14px",
  borderRadius: 12,
  border: `1px solid ${T.border}`,
  background: T.ink,
  color: T.paper,
  fontFamily: font.body,
  fontSize: 14,
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
