"use client";

import { useMemo, useState } from "react";

import { T, font } from "../config/theme.js";
import {
  CORE_DATA_MODULES,
  CORE_DISTRIBUTION_DESTINATIONS,
  CORE_PIPELINE_STAGES,
  FILTER_ORDER,
  SORT_OPTIONS,
  TALENT,
} from "../data/siteData.js";
import {
  Badge,
  Btn,
  EmptyState,
  Icon,
  InteractiveCard,
  MiniBar,
  SectionTitle,
  TalentAvatar,
  VerifiedBadge,
} from "../components/ui.jsx";

const tabButtonStyle = (active) => ({
  minHeight: 48,
  padding: "0 16px",
  borderRadius: 999,
  border: `1px solid ${active ? T.cyan : T.border}`,
  background: active ? T.cyanDim : T.panel,
  color: active ? T.paper : T.paperDim,
  fontSize: 13,
  fontWeight: 700,
  fontFamily: font.body,
  cursor: "pointer",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
});

export default function TalentPage({ viewport }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("verified");
  const { isMobile } = viewport;
  const listCard =
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.88)";
  const normalizedQuery = query.trim().toLowerCase();

  const counts = useMemo(() => {
    return FILTER_ORDER.reduce((acc, status) => {
      acc[status] =
        status === "all"
          ? TALENT.length
          : TALENT.filter((talent) => talent.status === status).length;
      return acc;
    }, {});
  }, []);

  const filtered = useMemo(() => {
    let results = TALENT.filter((talent) => {
      const matchesStatus = filter === "all" ? true : talent.status === filter;
      const searchBlob = [
        talent.name,
        talent.fullName,
        talent.type,
        talent.bio,
        talent.audience,
        talent.modulesDetail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = normalizedQuery
        ? searchBlob.includes(normalizedQuery)
        : true;
      return matchesStatus && matchesQuery;
    });

    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.lastUpdated.iso) - new Date(a.lastUpdated.iso);
        case "popularity":
          return b.popularity - a.popularity;
        case "completion":
          return b.completeness - a.completeness;
        case "verified":
        default: {
          const weight = { Verified: 0, "In Review": 1, "In Progress": 2, Potential: 3 };
          return (
            (weight[a.status] ?? 99) - (weight[b.status] ?? 99) ||
            new Date(b.lastUpdated.iso) - new Date(a.lastUpdated.iso)
          );
        }
      }
    });

    return results;
  }, [filter, normalizedQuery, sortBy]);

  const moveFilter = (direction) => {
    const currentIndex = FILTER_ORDER.indexOf(filter);
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % FILTER_ORDER.length
        : (currentIndex - 1 + FILTER_ORDER.length) % FILTER_ORDER.length;
    setFilter(FILTER_ORDER[nextIndex]);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 24px" }}>
      <SectionTitle
        sub={`${TALENT.length} profiles organized around claim-level verification, eight Core data modules, and downstream distribution readiness.`}
      >
        Talent Directory
      </SectionTitle>

      <section
        aria-label="RICON Core verification pipeline"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            padding: 18,
            borderRadius: 16,
            border: `1px solid ${T.border}`,
            background: T.panel,
          }}
        >
          <div style={{ fontSize: 12, color: T.cyan, fontWeight: 800, marginBottom: 10 }}>
            Verification Pipeline
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CORE_PIPELINE_STAGES.map((stage, index) => (
              <Badge key={stage} color={index === CORE_PIPELINE_STAGES.length - 1 ? T.green : T.cyan}>
                {index + 1}. {stage}
              </Badge>
            ))}
          </div>
          <p style={{ color: T.mutedLight, fontSize: 13, lineHeight: 1.7, marginTop: 12 }}>
            Profiles move downstream only after talent approval. Every published module is built from atomic claims with citations, reliability scoring, and approval history.
          </p>
        </div>
        <div
          style={{
            padding: 18,
            borderRadius: 16,
            border: `1px solid ${T.border}`,
            background: T.panel,
          }}
        >
          <div style={{ fontSize: 12, color: T.cyan, fontWeight: 800, marginBottom: 10 }}>
            Distribution Destinations
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {CORE_DISTRIBUTION_DESTINATIONS.map((destination) => (
              <div key={destination} style={{ display: "flex", alignItems: "center", gap: 8, color: T.paper, fontSize: 13 }}>
                <Icon name="shield" size={13} color={T.green} />
                {destination}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 220px",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, color: T.paper, fontWeight: 700 }}>
            Search profiles
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 52,
              padding: "0 16px",
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              background: T.panel,
            }}
          >
            <Icon name="search" size={16} color={T.muted} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, sport, audience, or keyword"
              aria-label="Search talent directory"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: T.paper,
                outline: "none",
              }}
            />
          </div>
        </label>

        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, color: T.paper, fontWeight: 700 }}>
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            style={{
              minHeight: 52,
              padding: "0 16px",
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              background: T.panel,
              color: T.paper,
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        role="tablist"
        aria-label="Filter talent by verification status"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {FILTER_ORDER.map((status, index) => {
          const active = filter === status;
          return (
            <button
              type="button"
              key={status}
              id={`talent-filter-${status}`}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setFilter(status)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFilter("next");
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFilter("prev");
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  setFilter(FILTER_ORDER[0]);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  setFilter(FILTER_ORDER[FILTER_ORDER.length - 1]);
                }
              }}
              style={{
                ...tabButtonStyle(active),
                boxShadow: active ? T.shadowSm : "none",
              }}
            >
              {status === "all" ? "All" : status} ({counts[status]})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No profiles match that search."
          description="Try clearing the query, switching back to the All filter, or searching for a sport like basketball or music."
          action={
            <Btn small variant="secondary" onClick={() => { setQuery(""); setFilter("all"); }}>
              Reset Filters
            </Btn>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((talent) => (
            <InteractiveCard
              key={talent.id}
              href={`/talent/${talent.id}`}
              ariaLabel={`Open ${talent.name}'s profile`}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                gap: 16,
                padding: isMobile ? "16px" : "18px 22px",
                background: listCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                boxShadow: T.shadowSm,
              }}
            >
              <TalentAvatar talent={talent} size={72} radius={18} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: font.display, color: T.paper }}>
                    {talent.name}
                  </h3>
                  {talent.status === "Verified" ? <VerifiedBadge small /> : null}
                </div>
                <div style={{ fontSize: 13, color: T.mutedLight, lineHeight: 1.6 }}>
                  {talent.type} · {talent.modules}/{CORE_DATA_MODULES.length} Core modules · {talent.verifiedClaims} verified claims · Last updated {talent.lastUpdated.label}
                </div>
                <div style={{ fontSize: 14, color: T.paperDim, marginTop: 10, lineHeight: 1.7 }}>
                  {talent.bio}
                </div>
                <div style={{ marginTop: 14 }}>
                  <MiniBar
                    value={talent.completeness}
                    max={100}
                    color={talent.status === "Verified" ? T.green : T.orange}
                    label={`${talent.completeness}% of biography modules complete`}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                      color: T.muted,
                    }}
                  >
                    <Icon name="info" size={13} color={T.muted} />
                    Distribution gate: {talent.distributionGate}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {(talent.moduleStatus ?? []).slice(0, isMobile ? 4 : 8).map((module) => (
                      <span
                        key={module.name}
                        title={`${module.name}: ${module.status}`}
                        style={{
                          minHeight: 26,
                          padding: "0 8px",
                          borderRadius: 8,
                          border: `1px solid ${module.status === "Verified" ? T.green : module.status === "In Review" ? T.orange : T.border}`,
                          color: module.status === "Verified" ? T.green : module.status === "In Review" ? T.orange : T.mutedLight,
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {module.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "row" : "column",
                  alignItems: isMobile ? "center" : "flex-end",
                  justifyContent: "space-between",
                  gap: 12,
                  width: isMobile ? "100%" : "auto",
                  flexShrink: 0,
                }}
              >
                <Badge
                  color={
                    talent.status === "Verified"
                      ? T.green
                      : talent.status === "In Review"
                        ? T.orange
                        : talent.status === "In Progress"
                          ? T.violet
                          : T.paper
                  }
                  bg={
                    talent.status === "Verified"
                      ? T.greenDim
                      : talent.status === "In Review"
                        ? T.orangeDim
                        : talent.status === "In Progress"
                          ? T.violetDim
                          : T.panelStrong
                  }
                >
                  {talent.status}
                </Badge>
                <div style={{ textAlign: isMobile ? "left" : "right" }}>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 3 }}>Audience</div>
                  <div style={{ fontSize: 13, color: T.paper }}>{talent.audience}</div>
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>
      )}
    </div>
  );
}
