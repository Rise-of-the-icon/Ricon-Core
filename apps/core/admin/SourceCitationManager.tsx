"use client";

import { useEffect, useMemo, useState } from "react";

import ProtectedShell from "@/src/next/ProtectedShell.jsx";
import { Btn } from "@/src/components/ui.jsx";
import { T, font } from "@/src/config/theme.js";
import type { SourceRecord } from "@/apps/core/sources/repository";

export default function SourceCitationManager({
  initialSources = [],
}: {
  initialSources?: SourceRecord[];
}) {
  const [sources, setSources] = useState<SourceRecord[]>(initialSources);
  const [error, setError] = useState<string | null>(null);
  const [checkingLinks, setCheckingLinks] = useState(false);

  async function loadSources(checkBrokenLinks = false) {
    setError(null);
    if (checkBrokenLinks) {
      setCheckingLinks(true);
    }

    const response = await fetch(
      `/api/admin/sources${checkBrokenLinks ? "?checkBrokenLinks=1" : ""}`,
      {
        cache: "no-store",
      },
    );
    const payload = await response.json();
    if (!response.ok || payload.error) {
      setError(payload.error ?? "Unable to load source citation database.");
      setCheckingLinks(false);
      return;
    }

    setSources(payload.sources ?? []);
    setCheckingLinks(false);
  }

  useEffect(() => {
    if (initialSources.length === 0) {
      void loadSources(false);
    }
  }, [initialSources.length]);

  const duplicateSources = useMemo(
    () => sources.filter((source) => source.duplicateCount > 1).length,
    [sources],
  );
  const brokenLinks = useMemo(
    () => sources.filter((source) => source.brokenLink === true).length,
    [sources],
  );

  return (
    <ProtectedShell
      page="admin-dashboard"
      title="Source Citation Manager"
      subtitle="Centralized source database with reliability, duplication, link health, and profile usage."
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <Btn href="/admin/dashboard" variant="secondary">
          Back to Mission Control
        </Btn>
        <Btn onClick={() => void loadSources(true)} disabled={checkingLinks}>
          {checkingLinks ? "Checking links..." : "Run Broken Link Detection"}
        </Btn>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Total Sources", value: sources.length },
          { label: "Duplicate Sources", value: duplicateSources },
          { label: "Broken Links", value: brokenLinks },
        ].map((item) => (
          <article
            key={item.label}
            style={{
              padding: 14,
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
            }}
          >
            <div style={{ fontSize: 12, color: T.mutedLight }}>{item.label}</div>
            <div style={{ fontSize: 28, color: T.paper, fontFamily: font.display, fontWeight: 800 }}>
              {item.value}
            </div>
          </article>
        ))}
      </section>

      {error ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: T.orangeDim,
            border: `1px solid ${T.border}`,
            color: T.paper,
          }}
        >
          {error}
        </div>
      ) : null}

      <section style={{ display: "grid", gap: 10 }}>
        {sources.map((source) => (
          <article
            key={source.id}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              background: T.ink,
              padding: 14,
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: T.paper, fontSize: 14, fontWeight: 700 }}>{source.publication}</div>
                <div style={{ color: T.mutedLight, fontSize: 12, overflowWrap: "anywhere" }}>{source.url}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: T.cyan, background: T.cyanDim, borderRadius: 999, padding: "2px 8px" }}>
                  {source.type}
                </span>
                <span style={{ fontSize: 11, color: T.paper, background: T.panel, borderRadius: 999, padding: "2px 8px" }}>
                  Reliability {source.reliabilityScore}/5
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color:
                      source.brokenLink === null
                        ? T.mutedLight
                        : source.brokenLink
                          ? T.orange
                          : T.green,
                    background: T.panel,
                    borderRadius: 999,
                    padding: "2px 8px",
                  }}
                >
                  {source.brokenLink === null
                    ? "Link not checked"
                    : source.brokenLink
                      ? "Broken link"
                      : "Link healthy"}
                </span>
                {source.duplicateCount > 1 ? (
                  <span style={{ fontSize: 11, color: T.orange, background: T.orangeDim, borderRadius: 999, padding: "2px 8px" }}>
                    Duplicate x{source.duplicateCount}
                  </span>
                ) : null}
              </div>
            </div>
            <div style={{ color: T.muted, fontSize: 12 }}>Used by:</div>
            <div style={{ display: "grid", gap: 6 }}>
              {source.usages.map((usage, index) => (
                <div
                  key={`${usage.profileId}-${usage.fieldPath}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                    color: T.mutedLight,
                    fontSize: 12,
                  }}
                >
                  <span>{usage.profileName}</span>
                  <span>{usage.fieldPath}</span>
                  <a href={`/review?profileId=${usage.profileId}`} style={{ color: T.cyan, textDecoration: "none" }}>
                    Open Profile
                  </a>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </ProtectedShell>
  );
}
