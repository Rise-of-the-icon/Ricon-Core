"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/apps/core/auth/client";

import { T, font } from "../config/theme.js";
import { API_METRICS } from "../data/siteData.js";
import { Btn, CopyButton, Icon, SectionTitle } from "../components/ui.jsx";

const endpoints = [
  {
    method: "GET",
    resource: "Talent",
    navLabel: "Get Talent Profile",
    path: "/v1/talent/{id}",
    desc: "Retrieve a verified talent profile with provenance metadata and module status.",
    request: `curl --request GET \\
  --url https://api.ricon.com/v1/talent/jk_001 \\
  --header "Authorization: Bearer rk_sbx_7e18...5fd1"`,
    response: `{
  "id": "jk_001",
  "name": "Jason Kidd",
  "status": "verified",
  "modules": [
    {
      "type": "biography",
      "version": "3.2",
      "signed_at": "2026-03-12",
      "hash": "0x7f3a..."
    }
  ]
}`,
  },
  {
    method: "GET",
    resource: "Statistics",
    navLabel: "Get Talent Stats",
    path: "/v1/talent/{id}/stats",
    desc: "Return labeled statistics, units, peer context, and source citations for the selected profile.",
    request: `curl --request GET \\
  --url https://api.ricon.com/v1/talent/jk_001/stats \\
  --header "Authorization: Bearer rk_sbx_7e18...5fd1"`,
    response: `{
  "games_played": 1391,
  "career_assists": 12091,
  "citations": [
    {
      "source": "NBA.com",
      "verified": true
    }
  ]
}`,
  },
  {
    method: "GET",
    resource: "Talent",
    navLabel: "List Talent",
    path: "/v1/talent",
    desc: "List talent records with filters for verification state, recency, and audience.",
    request: `curl --request GET \\
  --url "https://api.ricon.com/v1/talent?status=verified&limit=20" \\
  --header "Authorization: Bearer rk_sbx_7e18...5fd1"`,
    response: `{
  "total": 5,
  "talent": [
    { "id": "jk_001", "name": "Jason Kidd", "status": "verified" },
    { "id": "ra_003", "name": "Ray Allen", "status": "in_review" }
  ]
}`,
  },
  {
    method: "POST",
    resource: "Licensing",
    navLabel: "Create License Request",
    path: "/v1/license/request",
    desc: "Submit an intake form for data licensing or premium access requests.",
    request: `curl --request POST \\
  --url https://api.ricon.com/v1/license/request \\
  --header "Authorization: Bearer rk_sbx_7e18...5fd1" \\
  --header "Content-Type: application/json" \\
  --data '{
    "consumer_name": "Acme Insights",
    "use_case": "analytics",
    "requested_profiles": ["jk_001"]
  }'`,
    response: `{
  "request_id": "lic_2026_0042",
  "status": "pending_review",
  "estimated_review": "48h"
}`,
  },
];

const methodStyles = {
  GET: { color: T.green, background: T.greenDim },
  POST: { color: T.orange, background: T.orangeDim },
  PUT: { color: T.violet, background: T.violetDim },
  DELETE: { color: "#ff7f7f", background: "rgba(255,127,127,0.18)" },
};

export default function ApiPage({ viewport }) {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [query, setQuery] = useState("");
  const [includeProvenance, setIncludeProvenance] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(false);
  const [showCompactResponse, setShowCompactResponse] = useState(false);
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = viewport;
  const apiSurface =
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.88)";

  const filteredEndpoints = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return endpoints.filter((endpoint) => {
      const haystack =
        `${endpoint.method} ${endpoint.resource} ${endpoint.path} ${endpoint.desc}`.toLowerCase();
      return normalized ? haystack.includes(normalized) : true;
    });
  }, [query]);

  const endpoint = filteredEndpoints[activeEndpoint] || filteredEndpoints[0];

  const liveResponse = useMemo(() => {
    if (!endpoint) {
      return "";
    }

    let parsed;
    try {
      parsed = JSON.parse(endpoint.response);
    } catch {
      return endpoint.response;
    }

    if (!includeProvenance && parsed.modules) {
      parsed.modules = parsed.modules.map((item) => {
        const { hash, signed_at, ...rest } = item;
        return rest;
      });
    }

    if (includeAuditTrail) {
      parsed.audit = {
        reviewed_by: "editor_12",
        reviewed_at: "2026-04-10T10:34:00Z",
        review_state: "verified",
      };
    }

    return JSON.stringify(parsed, null, showCompactResponse ? 0 : 2);
  }, [endpoint, includeAuditTrail, includeProvenance, showCompactResponse]);

  const selectEndpoint = (index) => {
    setActiveEndpoint(index);
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 24px" }}>
      <SectionTitle sub="Verified biographical data via REST API. Every response is structured for provenance, reviewability, and downstream partner trust.">
        API Documentation
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(2, minmax(0, 1fr))"
            : isTablet
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          { label: "API calls / month", value: API_METRICS.calls, color: T.cyan },
          { label: "Uptime", value: API_METRICS.uptime, color: T.green },
          { label: "Avg latency", value: API_METRICS.latency, color: T.violet },
          { label: "Active consumers", value: API_METRICS.consumers, color: T.orange },
        ].map((metric) => (
          <div
            key={metric.label}
            style={{
              padding: "18px 20px",
              background: apiSurface,
              borderRadius: 22,
              border: `1px solid ${T.border}`,
              boxShadow: T.shadowSm,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                fontFamily: font.display,
                color: metric.color,
              }}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.paper }}>Search endpoints</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 50,
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
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveEndpoint(0);
              }}
              placeholder="Search by resource, method, or keyword"
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
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "320px minmax(0, 1fr)" : "1fr",
          gap: 16,
          minHeight: 520,
        }}
      >
        <aside
          style={{
            background: apiSurface,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            padding: 10,
            overflow: "hidden",
            boxShadow: T.shadowSm,
            alignSelf: isDesktop ? "start" : "stretch",
            position: isDesktop ? "sticky" : "static",
            top: isDesktop ? 96 : "auto",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "12px 12px 4px",
            }}
          >
            API Navigation
          </div>
          <div style={{ fontSize: 12, color: T.mutedLight, padding: "0 12px 10px" }}>
            Select an endpoint to inspect request examples and live JSON output.
          </div>
          <div
            style={{
              display: isDesktop ? "grid" : "flex",
              gap: 6,
              overflowX: isDesktop ? "visible" : "auto",
              paddingBottom: isDesktop ? 0 : 4,
            }}
          >
            {filteredEndpoints.map((item, index) => {
              const active = item.path === endpoint?.path;
              const methodStyle = methodStyles[item.method] || methodStyles.GET;
              return (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => selectEndpoint(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: isDesktop ? "100%" : "min(82vw, 320px)",
                    flexShrink: 0,
                    minHeight: 58,
                    padding: "0 14px",
                    border: `1px solid ${active ? T.cyan : "transparent"}`,
                    borderRadius: 16,
                    background: active ? T.cyanDim : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      minWidth: 48,
                      minHeight: 28,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: font.mono,
                      color: methodStyle.color,
                      background: methodStyle.background,
                    }}
                  >
                    {item.method}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: T.paper,
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      {item.navLabel}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.mutedLight,
                        fontFamily: font.mono,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section
          style={{
            background: apiSurface,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            overflow: "hidden",
            boxShadow: T.shadowSm,
          }}
        >
          {endpoint ? (
            <>
              <div
                style={{
                  padding: isMobile ? "16px" : "18px 20px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      minHeight: 30,
                      padding: "0 10px",
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: font.mono,
                      color: methodStyles[endpoint.method].color,
                      background: methodStyles[endpoint.method].background,
                    }}
                  >
                    {endpoint.method}
                  </span>
                  <span
                    style={{
                      fontSize: isMobile ? 12 : 14,
                      fontFamily: font.mono,
                      color: T.paper,
                      wordBreak: "break-word",
                    }}
                  >
                    {endpoint.path}
                  </span>
                </div>
                <CopyButton value={`${endpoint.method} ${endpoint.path}`} label="Copy endpoint path" />
              </div>
              <div
                style={{
                  padding: isMobile ? "14px 16px" : "16px 20px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>{endpoint.desc}</p>
              </div>
              <div style={{ padding: isMobile ? 16 : 20 }}>
                <div
                  style={{
                    marginBottom: 14,
                    padding: "14px",
                    borderRadius: 14,
                    border: `1px solid ${T.border}`,
                    background: T.ink,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: T.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Example request
                    </div>
                    <CopyButton value={endpoint.request} label="Copy request example" />
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontFamily: font.mono,
                      color: T.paper,
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {endpoint.request}
                  </pre>
                </div>

                <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: T.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Live JSON Preview Controls
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      {
                        checked: includeProvenance,
                        label: "Include provenance",
                        onChange: setIncludeProvenance,
                      },
                      {
                        checked: includeAuditTrail,
                        label: "Include audit block",
                        onChange: setIncludeAuditTrail,
                      },
                      {
                        checked: showCompactResponse,
                        label: "Compact JSON",
                        onChange: setShowCompactResponse,
                      },
                    ].map((item) => (
                      <label
                        key={item.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: T.mutedLight,
                          fontSize: 12,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(event) => item.onChange(event.target.checked)}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: T.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Live JSON preview
                  </div>
                  <CopyButton value={liveResponse} label="Copy live JSON preview" />
                </div>
                <pre
                  style={{
                    fontSize: isMobile ? 11 : 12,
                    fontFamily: font.mono,
                    color: T.cyan,
                    background: T.ink,
                    borderRadius: 18,
                    padding: isMobile ? 14 : 16,
                    margin: 0,
                    overflowX: "auto",
                    lineHeight: 1.7,
                    border: `1px solid ${T.border}`,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {liveResponse}
                </pre>
              </div>
            </>
          ) : (
            <div style={{ padding: 24, color: T.mutedLight }}>
              No endpoints match that search yet.
            </div>
          )}
        </section>
      </div>

      <section
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
          gap: 16,
        }}
      >
        <div
          style={{
            background: apiSurface,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            padding: isMobile ? 18 : 22,
            boxShadow: T.shadowSm,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: T.paper, marginBottom: 8 }}>
            API key management (mock)
          </div>
          <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7, marginBottom: 18 }}>
            Mock key flow mirrors production patterns: generate scoped keys, store securely, rotate regularly, and monitor endpoint-level usage for abuse.
          </p>
          {user ? (
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { name: "Sandbox key", value: "rk_sbx_7e18...5fd1", usage: "14.2k calls this month" },
                { name: "Production key", value: "rk_prod_a113...19bd", usage: "412k calls this month" },
              ].map((key) => (
                <div
                  key={key.name}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 18,
                    border: `1px solid ${T.border}`,
                    background: T.ink,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontSize: 15, color: T.paper, fontWeight: 700 }}>{key.name}</div>
                    <BadgePill>Active</BadgePill>
                  </div>
                  <div style={{ fontSize: 13, color: T.paperDim, fontFamily: font.mono }}>{key.value}</div>
                  <div style={{ fontSize: 13, color: T.mutedLight }}>{key.usage}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn variant="primary">Create new key</Btn>
                <Btn variant="secondary">Rotate selected key</Btn>
                <Btn variant="outline">View usage dashboard</Btn>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "18px",
                borderRadius: 18,
                background: T.ink,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7, marginBottom: 14 }}>
                Sign in to manage keys, provision environments, and inspect usage by endpoint.
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn href="/sign-in" variant="primary">
                  Sign in
                </Btn>
                <Btn href="/developers/api-access" variant="outline">
                  Request access
                </Btn>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: apiSurface,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            padding: isMobile ? 18 : 22,
            boxShadow: T.shadowSm,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: T.paper, marginBottom: 8 }}>
            Usage and integration model
          </div>
          <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7, marginBottom: 18 }}>
            RICON API responses are designed for verified content systems. Build clients around source-aware objects, review states, and explicit version boundaries.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              "Send API key in Authorization header: Bearer <key>",
              "Cache list endpoints for 60s and fetch profile endpoints on-demand",
              "Persist module version/hash to detect upstream updates",
              "Display source and reliability metadata in downstream UIs",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  border: `1px solid ${T.border}`,
                  background: T.ink,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Icon name="check" size={14} color={T.green} />
                <span style={{ color: T.paperDim, fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <Btn href="/developers/api-access" variant="outline" style={{ width: "100%" }}>
              Open API access form
            </Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

function BadgePill({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 28,
        padding: "0 10px",
        borderRadius: 999,
        background: T.greenDim,
        color: T.green,
        fontSize: 11,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </span>
  );
}
