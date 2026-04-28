import { T, alpha, font } from "../config/theme.js";
import { Btn, Icon } from "../components/ui.jsx";

const VERTICALS = {
  "data-licensing": {
    eyebrow: "Data licensing",
    title: "Verified profile data for teams that cannot afford drift.",
    intro:
      "License structured biographical records with source context, approval state, and provenance metadata attached to every profile module.",
    useCase:
      "Use RICON as the trust layer behind media databases, analytics systems, knowledge graphs, and profile-driven editorial workflows.",
    marker: "API",
    icon: "api",
    color: T.cyan,
    ctaHref: "/developers/api-access",
    ctaLabel: "Request API Access",
    outputs: [
      "Profile API payload with verified biography, stats, milestones, and rights metadata",
      "Source-backed JSON export for search, discovery, and internal enrichment",
      "Licensee-ready data feed with approval status and last verified date",
    ],
  },
  "digital-experiences": {
    eyebrow: "Digital experiences",
    title: "Profile hubs, fan touchpoints, and storefronts powered by one verified record.",
    intro:
      "Build digital experiences around talent stories without rebuilding the same biography, milestone, and rights checks for every channel.",
    useCase:
      "Use RICON to power profile pages, timelines, and fan storytelling experiences from the same approved source.",
    marker: "UX",
    icon: "globe",
    color: T.violet,
    ctaHref: "/contact",
    ctaLabel: "Plan an Experience",
    outputs: [
      "Verified profile hub with biography, milestones, stats, and provenance",
      "Rights-aware fan modules tied to approved talent records",
      "Fan timeline component with source-backed moments and audit history",
    ],
  },
  "gaming-ai": {
    eyebrow: "Gaming and AI",
    title: "Identity-safe talent data for simulations, agents, and interactive media.",
    intro:
      "Give AI and gaming teams clean, rights-aware profile context so talent representations stay accurate, approved, and traceable.",
    useCase:
      "Use RICON as a verified data foundation for simulation rosters, sports games, conversational agents, licensing checks, and generated fan experiences.",
    marker: "AI",
    icon: "play",
    color: T.pink,
    ctaHref: "/contact",
    ctaLabel: "Discuss Gaming and AI",
    outputs: [
      "Approved identity packet for character, roster, and agent context",
      "Rights-aware metadata bundle for generated media workflows",
      "Conflict notes and reliability scores for model grounding and moderation",
    ],
  },
};

export default function EcosystemVerticalPage({ page, viewport }) {
  const content = VERTICALS[page] ?? VERTICALS["data-licensing"];
  const isMobile = viewport?.isMobile;
  const isTablet = viewport?.isTablet;
  const outputColumns = isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))";

  return (
    <div>
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: isMobile ? "72px 16px 48px" : "104px 24px 72px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 1fr) minmax(300px, 0.72fr)",
            gap: isMobile ? 32 : 48,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 32,
                padding: "0 12px",
                borderRadius: 999,
                border: `1px solid ${content.color}`,
                background: alpha(content.color, 14),
                color: content.color,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              {content.eyebrow}
            </div>
            <h1
              style={{
                fontSize: isMobile ? 40 : 64,
                fontFamily: font.display,
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: "-0.05em",
                color: T.paper,
                marginBottom: 20,
              }}
            >
              {content.title}
            </h1>
            <p
              style={{
                fontSize: isMobile ? 17 : 19,
                color: T.mutedLight,
                lineHeight: 1.75,
                maxWidth: 760,
                marginBottom: 28,
              }}
            >
              {content.intro}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn href="/apply/talent" style={{ minWidth: isMobile ? "100%" : 190 }}>
                Get Verified <Icon name="arrow" size={16} />
              </Btn>
              <Btn href="/developers/api-access" variant="orange" style={{ minWidth: isMobile ? "100%" : 190 }}>
                Access API
              </Btn>
              <Btn href="/talent" variant="outline" style={{ minWidth: isMobile ? "100%" : 190 }}>
                Explore Profiles
              </Btn>
            </div>
          </div>

          <div
            style={{
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.9)",
              boxShadow: T.shadowSm,
              padding: isMobile ? 22 : 28,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 8,
                display: "grid",
                placeItems: "center",
                border: `1px solid ${content.color}`,
                background: alpha(content.color, 14),
                marginBottom: 18,
              }}
            >
              <Icon name={content.icon} size={24} color={content.color} />
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: content.color,
                marginBottom: 10,
              }}
            >
              Use case
            </div>
            <p style={{ fontSize: 15, color: T.mutedLight, lineHeight: 1.75 }}>
              {content.useCase}
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          background: `linear-gradient(180deg, ${T.panel}, rgba(255,255,255,0.02)), ${T.inkLight}`,
          padding: isMobile ? "56px 16px" : "72px 24px",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
              alignItems: "flex-end",
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: isMobile ? 30 : 42,
                  fontFamily: font.display,
                  fontWeight: 900,
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                  color: T.paper,
                  marginBottom: 10,
                }}
              >
                Example outputs
              </h2>
              <p style={{ fontSize: 16, color: T.mutedLight, lineHeight: 1.7, maxWidth: 720 }}>
                Product-ready artifacts a team can build from the same verified RICON record.
              </p>
            </div>
            <div
              style={{
                minWidth: 64,
                minHeight: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 8,
                border: `1px solid ${content.color}`,
                background: alpha(content.color, 14),
                color: content.color,
                fontFamily: font.mono,
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              {content.marker}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: outputColumns, gap: 14 }}>
            {content.outputs.map((output, index) => (
              <article
                key={output}
                style={{
                  padding: 22,
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: "rgba(8,16,24,0.72)",
                  minHeight: 180,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    border: `1px solid ${content.color}`,
                    background: alpha(content.color, 14),
                    color: content.color,
                    fontFamily: font.mono,
                    fontSize: 12,
                    fontWeight: 900,
                    marginBottom: 18,
                  }}
                >
                  0{index + 1}
                </div>
                <p style={{ fontSize: 15, color: T.mutedLight, lineHeight: 1.75 }}>
                  {output}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: isMobile ? "56px 16px 72px" : "72px 24px 96px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? 30 : 42,
            fontFamily: font.display,
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            color: T.paper,
            marginBottom: 14,
          }}
        >
          Build from verified biography, not scraped fragments.
        </h2>
        <p style={{ fontSize: 16, color: T.mutedLight, lineHeight: 1.75, marginBottom: 26 }}>
          RICON gives partner teams a source-backed record, approval status, and provenance model before data reaches the experience.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn href="/apply/talent" style={{ minWidth: isMobile ? "100%" : 220 }}>
            Get Verified
          </Btn>
          <Btn href="/developers/api-access" variant="orange" style={{ minWidth: isMobile ? "100%" : 220 }}>
            Access API
          </Btn>
          <Btn href="/talent" variant="outline" style={{ minWidth: isMobile ? "100%" : 220 }}>
            Explore Profiles
          </Btn>
        </div>
      </section>
    </div>
  );
}
