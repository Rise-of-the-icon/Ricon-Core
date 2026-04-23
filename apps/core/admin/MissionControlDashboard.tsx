"use client";

import { useEffect, useMemo, useState } from "react";

import ProtectedShell from "@/src/next/ProtectedShell.jsx";
import { SkeletonBlock, Spinner } from "@/src/components/feedback/LoadingState";
import { Btn } from "@/src/components/ui.jsx";
import { T, alpha, font } from "@/src/config/theme.js";

import type {
  MissionControlPayload,
  PipelineStage,
} from "./repository";

const stageColor: Record<PipelineStage, string> = {
  draft: T.cyan,
  in_review: T.orange,
  needs_revision: T.orange,
  talent_review: T.green,
  talent_approved: T.green,
  published: T.violet,
};

function profileHref(profileId: string, stage: PipelineStage) {
  if (stage === "draft") {
    return `/workspace?profileId=${profileId}`;
  }
  return `/review?profileId=${profileId}`;
}

export default function MissionControlDashboard() {
  const [payload, setPayload] = useState<MissionControlPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const response = await fetch("/api/admin/mission-control", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!mounted) {
        return;
      }
      if (!response.ok || result.error) {
        setError(result.error ?? "Unable to load mission control dashboard.");
        return;
      }
      setPayload(result as MissionControlPayload);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const bottlenecks = useMemo(
    () => payload?.stageSummaries.filter((stage) => stage.isBottleneck) ?? [],
    [payload],
  );

  return (
    <ProtectedShell
      page="admin-dashboard"
      title="Mission Control"
      subtitle="Real-time pipeline health for draft-to-approval operations."
    >
      {error ? (
        <div
          style={{
            marginBottom: 16,
            padding: 14,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            background: T.orangeDim,
            color: T.paper,
          }}
        >
          {error}
        </div>
      ) : null}
      {!payload && !error ? (
        <section style={{ display: "grid", gap: 12, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.mutedLight }}>
            <Spinner />
            Loading mission control...
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <SkeletonBlock height={130} radius={16} />
            <SkeletonBlock height={130} radius={16} />
            <SkeletonBlock height={130} radius={16} />
            <SkeletonBlock height={130} radius={16} />
          </div>
          <SkeletonBlock height={280} radius={16} />
        </section>
      ) : null}

      <div style={{ marginBottom: 14, display: "flex", justifyContent: "flex-end" }}>
        <Btn href="/admin/sources" variant="secondary">
          Open Source Citation Manager
        </Btn>
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        {(payload?.stageSummaries ?? []).map((stage) => (
          <article
            key={stage.stage}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
              padding: 16,
              boxShadow: T.shadowSm,
            }}
          >
            <div style={{ color: T.mutedLight, fontSize: 12, fontFamily: font.body }}>{stage.label}</div>
            <div style={{ fontSize: 30, fontFamily: font.display, color: T.paper, fontWeight: 800 }}>
              {stage.count}
            </div>
            <div
              style={{
                marginTop: 8,
                minHeight: 24,
                display: "inline-flex",
                alignItems: "center",
                padding: "0 10px",
                borderRadius: 999,
                background: stage.isBottleneck ? T.orangeDim : alpha(stageColor[stage.stage], 14),
                color: stage.isBottleneck ? T.orange : stageColor[stage.stage],
                fontSize: 11,
              }}
            >
              {stage.isBottleneck ? "Bottleneck" : "Healthy"}
            </div>
          </article>
        ))}
      </section>

      <section
        style={{
          marginBottom: 18,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
          padding: 16,
        }}
      >
        <div style={{ color: T.paper, fontFamily: font.display, fontSize: 22, marginBottom: 8 }}>
          System Health
        </div>
        <div style={{ color: T.mutedLight, fontSize: 13, lineHeight: 1.6 }}>
          Active pipeline profiles: <strong style={{ color: T.paper }}>{payload?.totalActive ?? 0}</strong>
          {bottlenecks.length > 0 ? ` · Bottleneck stage: ${bottlenecks.map((item) => item.label).join(", ")}` : " · No bottlenecks detected"}
        </div>
      </section>

      <section
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
          padding: 16,
        }}
      >
        <div style={{ color: T.paper, fontFamily: font.display, fontSize: 20, marginBottom: 12 }}>
          Pipeline Profiles
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {(payload?.profiles ?? []).map((profile) => (
            <div
              key={profile.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 12,
                background: T.ink,
              }}
            >
              <div>
                <div style={{ color: T.paper, fontSize: 15, fontFamily: font.body }}>{profile.name}</div>
                <div style={{ color: T.muted, fontSize: 12 }}>
                  {profile.researcherName} · {new Date(profile.updatedAt).toLocaleString()}
                </div>
              </div>
              <Btn href={profileHref(profile.id, profile.stage)} small>
                Open Profile
              </Btn>
            </div>
          ))}
          {payload && payload.profiles.length === 0 ? (
            <div style={{ color: T.mutedLight, fontSize: 13 }}>
              No profiles yet.
            </div>
          ) : null}
        </div>
      </section>
    </ProtectedShell>
  );
}
