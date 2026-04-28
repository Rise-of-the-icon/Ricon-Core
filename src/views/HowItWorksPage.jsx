import { T, alpha, font } from "../config/theme.js";
import { Btn, Icon } from "../components/ui.jsx";

const PIPELINE_STAGES = [
  {
    title: "Research",
    description:
      "RICON researchers build the first profile record from primary references, official databases, interviews, and reputable coverage.",
    icon: "search",
    color: T.cyan,
  },
  {
    title: "Source Citation",
    description:
      "Every claim is attached to source notes so reviewers can see where the information came from before it moves forward.",
    icon: "external",
    color: T.violet,
  },
  {
    title: "Editorial QA",
    description:
      "Editors check names, dates, statistics, context, and claim wording before a profile is shown to talent for approval.",
    icon: "shield",
    color: T.orange,
  },
  {
    title: "Talent Approval",
    description:
      "Talent or authorized representatives approve, dispute, or annotate the record before RICON marks it as verified.",
    icon: "users",
    color: T.green,
  },
  {
    title: "Verified Data",
    description:
      "Approved facts become a versioned data record that can power profile pages, licensing feeds, and partner APIs.",
    icon: "verified",
    color: T.cyan,
  },
];

const DIFFERENTIATORS = [
  {
    title: "Minimum 2 sources per claim",
    description:
      "Claims need corroboration before they are treated as ready for profile review.",
    icon: "copy",
  },
  {
    title: "Talent approval required",
    description:
      "A profile is not verified until talent or an authorized representative has reviewed the record.",
    icon: "check",
  },
  {
    title: "Immutable audit trail",
    description:
      "Each approval, dispute, citation change, and verified snapshot is preserved for accountability.",
    icon: "lock",
  },
];

const FAQS = [
  {
    question: "Who does the research?",
    answer:
      "RICON researchers and editors assemble the record from trusted public sources, official references, supplied materials, and review notes from authorized talent teams.",
  },
  {
    question: "Can talent remove facts?",
    answer:
      "Talent can dispute facts, add context, request corrections, and flag privacy or rights concerns. RICON resolves those requests through review rather than silently deleting sourced history.",
  },
  {
    question: "What happens when sources conflict?",
    answer:
      "Conflicting claims are held for editorial QA. The team compares source quality, recency, and directness, then either selects the strongest supported version or preserves the conflict as a note until it is resolved.",
  },
];

export default function HowItWorksPage({ viewport }) {
  const isMobile = viewport?.isMobile;
  const isTablet = viewport?.isTablet;
  const pipelineColumns = isMobile ? "1fr" : "repeat(5, minmax(0, 1fr))";
  const differentiatorColumns = isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))";

  return (
    <div>
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: isMobile ? "72px 16px 40px" : "104px 24px 56px",
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 32,
              padding: "0 12px",
              borderRadius: 999,
              border: `1px solid ${T.cyanMid}`,
              background: T.cyanDim,
              color: T.cyan,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Verification pipeline
          </div>
          <h1
            style={{
              fontSize: isMobile ? 40 : 68,
              fontFamily: font.display,
              fontWeight: 900,
              lineHeight: 0.96,
              letterSpacing: "-0.05em",
              color: T.paper,
              marginBottom: 20,
            }}
          >
            How RICON turns biography into verified data.
          </h1>
          <p
            style={{
              fontSize: isMobile ? 17 : 19,
              color: T.mutedLight,
              lineHeight: 1.75,
              maxWidth: 780,
              marginBottom: 28,
            }}
          >
            The trust model is simple: research is sourced, sources are checked, editors review the record, talent approves it, and only then does it become verified data.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn href="/apply/talent" style={{ minWidth: isMobile ? "100%" : 190 }}>
              Get Verified <Icon name="arrow" size={16} />
            </Btn>
            <Btn href="/developers/api-access" variant="orange" style={{ minWidth: isMobile ? "100%" : 180 }}>
              Access API
            </Btn>
            <Btn href="/talent" variant="outline" style={{ minWidth: isMobile ? "100%" : 180 }}>
              Explore Profiles
            </Btn>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: isMobile ? "0 16px 56px" : "0 24px 72px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: pipelineColumns,
            gap: isMobile ? 14 : 12,
            alignItems: "stretch",
          }}
        >
          {!isMobile ? (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 41,
                left: "8%",
                right: "8%",
                height: 2,
                background: `linear-gradient(90deg, ${T.cyanMid}, ${T.border}, ${T.greenDim})`,
              }}
            />
          ) : null}
          {PIPELINE_STAGES.map((stage, index) => (
            <article
              key={stage.title}
              style={{
                position: "relative",
                minHeight: isMobile ? 0 : 300,
                padding: isMobile ? 20 : 18,
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.9)",
                boxShadow: T.shadowSm,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    background: alpha(stage.color, 14),
                    border: `1px solid ${stage.color}`,
                  }}
                >
                  <Icon name={stage.icon} size={20} color={stage.color} />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: font.mono,
                    color: T.muted,
                  }}
                >
                  0{index + 1}
                </span>
              </div>
              <h2
                style={{
                  fontSize: 18,
                  color: T.paper,
                  fontWeight: 800,
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                {stage.title}
              </h2>
              <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.65 }}>
                {stage.description}
              </p>
            </article>
          ))}
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
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 0.8fr) minmax(0, 1.2fr)",
              gap: isMobile ? 28 : 44,
              alignItems: "start",
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
                  marginBottom: 14,
                }}
              >
                What makes RICON different?
              </h2>
              <p style={{ fontSize: 16, color: T.mutedLight, lineHeight: 1.75 }}>
                Verification is not a badge applied at the end. It is a workflow with source requirements, talent review, and a durable record of what changed.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: differentiatorColumns,
                gap: 14,
              }}
            >
              {DIFFERENTIATORS.map((item) => (
                <article
                  key={item.title}
                  style={{
                    padding: 20,
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: "rgba(8,16,24,0.68)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      background: T.greenDim,
                      border: `1px solid ${T.green}`,
                      marginBottom: 16,
                    }}
                  >
                    <Icon name={item.icon} size={18} color={T.green} />
                  </div>
                  <h3 style={{ fontSize: 17, color: T.paper, fontWeight: 800, marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.65 }}>
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: isMobile ? "56px 16px 72px" : "72px 24px 96px",
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
            marginBottom: 24,
          }}
        >
          FAQ
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {FAQS.map((faq) => (
            <article
              key={faq.question}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(220px, 0.42fr) minmax(0, 1fr)",
                gap: isMobile ? 10 : 24,
                padding: isMobile ? 20 : 24,
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.panel,
              }}
            >
              <h3 style={{ fontSize: 17, color: T.paper, fontWeight: 800, lineHeight: 1.35 }}>
                {faq.question}
              </h3>
              <p style={{ fontSize: 15, color: T.mutedLight, lineHeight: 1.75 }}>
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
