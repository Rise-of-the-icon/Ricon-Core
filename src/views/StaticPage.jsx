import { T, font } from "../config/theme.js";
import { Btn, Icon } from "../components/ui.jsx";

const STATIC_PAGE_CONTENT = {
  about: {
    eyebrow: "Company",
    title: "About RICON",
    intro:
      "RICON gives talent a verified place to own the facts, milestones, and commercial context that shape their public story.",
    points: [
      "Talent-reviewed biographical records",
      "Source-backed modules for fans and partners",
      "Structured delivery for licensing and partner teams",
    ],
    ctaHref: "/contact",
    ctaLabel: "Contact us",
  },
  mission: {
    eyebrow: "Mission",
    title: "Our Mission",
    intro:
      "We are building a verification layer for biography so talent, fans, and organizations can work from one trusted record.",
    points: [
      "Reduce misinformation drift across verified profiles",
      "Give talent and representatives a durable review workflow",
      "Make provenance visible wherever verified data is used",
    ],
    ctaHref: "/how-it-works",
    ctaLabel: "See how it works",
  },
  "how-it-works": {
    eyebrow: "Workflow",
    title: "How It Works",
    intro:
      "RICON moves profile information through research, review, verification, and distribution before it reaches partner systems.",
    points: [
      "Researchers assemble claims with source context",
      "Talent teams review and approve profile modules",
      "Verified records power fan experiences, APIs, and licensing feeds",
    ],
    ctaHref: "/apply/talent",
    ctaLabel: "Apply as Talent",
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact RICON",
    intro:
      "Reach out about talent onboarding, data licensing, API access, or partner workflows for verified profile data.",
    points: [
      "Talent and representative onboarding",
      "API access and licensing conversations",
      "Security, privacy, and platform questions",
    ],
    ctaHref: "/developers/api-access",
    ctaLabel: "Request API Access",
  },
  security: {
    eyebrow: "Trust",
    title: "Security",
    intro:
      "RICON is designed around controlled review, version history, and careful handling of profile and workflow data.",
    points: [
      "Role-aware access for review and operations workflows",
      "Versioned records that preserve approval history",
      "Security reviews before broader partner distribution",
    ],
    ctaHref: "/contact",
    ctaLabel: "Ask a security question",
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy",
    intro:
      "This placeholder outlines RICON's approach to personal information while the full privacy policy is finalized.",
    points: [
      "Collect only the information needed for onboarding and verification",
      "Use profile data to support approved RICON workflows",
      "Route privacy questions to the RICON team for review",
    ],
    ctaHref: "/contact",
    ctaLabel: "Contact us",
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms",
    intro:
      "This placeholder marks the future home for RICON's terms covering site use, account access, and platform workflows.",
    points: [
      "Use the platform for authorized verification workflows",
      "Respect profile ownership, licensing rights, and partner access",
      "Check back for the full terms before production launch",
    ],
    ctaHref: "/contact",
    ctaLabel: "Contact us",
  },
  licensing: {
    eyebrow: "Licensing",
    title: "Licensing",
    intro:
      "RICON licensing helps teams build with structured, provenance-rich profile data that has moved through review.",
    points: [
      "Verified biographical modules for downstream systems",
      "Rights-aware packaging for partner use cases",
      "API delivery paths for approved licensees",
    ],
    ctaHref: "/developers/api-access",
    ctaLabel: "Get API Access",
  },
};

export function getStaticPageContent(page) {
  return STATIC_PAGE_CONTENT[page] ?? STATIC_PAGE_CONTENT.about;
}

export default function StaticPage({ page, viewport }) {
  const content = getStaticPageContent(page);
  const isMobile = viewport?.isMobile;

  return (
    <div>
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "72px 16px 48px" : "104px 24px 72px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.05fr) minmax(280px, 0.75fr)",
            gap: isMobile ? 28 : 48,
            alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                minHeight: 32,
                alignItems: "center",
                borderRadius: 999,
                border: `1px solid ${T.cyanMid}`,
                background: T.cyanDim,
                color: T.cyan,
                padding: "0 12px",
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
              <Btn href="/apply/talent" style={{ minWidth: isMobile ? "100%" : 180 }}>
                Get Verified <Icon name="arrow" size={16} />
              </Btn>
              <Btn href="/developers/api-access" variant="orange" style={{ minWidth: isMobile ? "100%" : 170 }}>
                Access API
              </Btn>
              <Btn href="/talent" variant="outline" style={{ minWidth: isMobile ? "100%" : 170 }}>
                Explore Profiles
              </Btn>
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              border: `1px solid ${T.border}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.82)",
              boxShadow: T.shadowSm,
              padding: isMobile ? 22 : 28,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: T.paper,
                marginBottom: 18,
              }}
            >
              Page snapshot
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {content.points.map((point) => (
                <div
                  key={point}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px minmax(0, 1fr)",
                    gap: 12,
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      background: T.greenDim,
                      border: `1px solid ${T.green}`,
                    }}
                  >
                    <Icon name="check" size={16} color={T.green} />
                  </div>
                  <p style={{ color: T.mutedLight, lineHeight: 1.65, fontSize: 14 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
