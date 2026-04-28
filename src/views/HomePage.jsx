"use client";

import { useState } from "react";

import { T, alpha, font } from "../config/theme.js";
import {
  asset,
  ATMOSPHERIC_OVERLAY,
  ECOSYSTEM_CARDS,
  HOW_IT_WORKS_STEPS,
  TALENT,
} from "../data/siteData.js";
import {
  Badge,
  Btn,
  Icon,
  InteractiveCard,
  MediaFrame,
  MiniBar,
  SectionTitle,
} from "../components/ui.jsx";

export default function HomePage({ viewport }) {
  const [hoveredTalent, setHoveredTalent] = useState(null);
  const { isMobile, isTablet } = viewport;
  const cardColumns = isMobile
    ? "1fr"
    : isTablet
      ? "repeat(2, minmax(0, 1fr))"
      : "repeat(auto-fit, minmax(250px, 1fr))";
  const featuredTalent = TALENT.filter(
    (talent) => talent.status === "Verified" || talent.status === "In Review"
  ).slice(0, 4);

  const sectionY = isMobile
    ? { standard: 48, band: 56, footer: 72 }
    : isTablet
      ? { standard: 56, band: 64, footer: 80 }
      : { standard: 64, band: 80, footer: 96 };
  const pageGutter = isMobile ? 16 : 24;

  return (
    <div>
      <section
        style={{
          position: "relative",
          padding: isMobile ? "72px 0 56px" : isTablet ? "88px 0 72px" : "112px 0 92px",
          overflow: "hidden",
        }}
      >
        <img
          src={asset("heroTunnel", 1800, 1100)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 36%",
            opacity: 0.22,
            filter: "brightness(0.54) saturate(0.72)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,16,24,0.48) 0%, rgba(8,16,24,0.82) 54%, var(--color-ink) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1180,
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 24px",
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 1.1fr) minmax(320px, 0.72fr)",
            gap: 28,
            alignItems: "start",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <Badge color={T.paper} bg="rgba(8,16,24,0.48)">
              Verified biographical data platform
            </Badge>
            <h1
              style={{
                fontSize: isMobile ? 40 : isTablet ? 54 : 62,
                fontWeight: 900,
                fontFamily: font.display,
                color: T.paper,
                margin: "22px 0 18px",
                lineHeight: 0.96,
                letterSpacing: "-0.05em",
                maxWidth: 840,
              }}
            >
              RICON is a verified biographical data platform where talent owns their stories.
            </h1>
            <p
              style={{
                fontSize: isMobile ? 17 : 19,
                color: T.mutedLight,
                fontFamily: font.body,
                lineHeight: 1.75,
                maxWidth: 760,
                marginBottom: 28,
              }}
            >
              Built for talent, fans, and data licensees. Talent reviews and
              approves the record, fans get a credible profile experience, and
              partners license provenance-rich data they can trust.
            </p>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 26,
              }}
            >
              <Btn
                href="/apply/talent"
                style={{
                  minWidth: isMobile ? "100%" : 196,
                  fontSize: 16,
                  minHeight: 58,
                }}
              >
                Get Verified <Icon name="arrow" size={17} />
              </Btn>
              <Btn
                href="/developers/api-access"
                variant="orange"
                style={{
                  minWidth: isMobile ? "100%" : 196,
                  fontSize: 16,
                  minHeight: 58,
                }}
              >
                Access API
              </Btn>
              <Btn href="/talent" variant="outline" style={{ minWidth: isMobile ? "100%" : 0 }}>
                Explore Profiles
              </Btn>
            </div>
          </div>

          <div
            style={{
              borderRadius: 28,
              border: `1px solid ${T.border}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.7)",
              padding: isMobile ? 20 : 24,
              boxShadow: T.shadow,
              marginTop: "11vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: T.cyan,
                    marginBottom: 6,
                    fontFamily: font.body,
                  }}
                >
                  Trust snapshot
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: T.paper,
                    fontFamily: font.display,
                  }}
                >
                  1 source of truth
                </div>
              </div>
              <Badge color={T.green} bg={T.greenDim}>
                Live beta
              </Badge>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                {
                  icon: "shield",
                  title: "Talent-reviewed biographies",
                  copy: "Profiles move from research to approval before they are distributed.",
                },
                {
                  icon: "verified",
                  title: "Versioned records",
                  copy: "Every verified module carries provenance, timestamps, and immutable audit history.",
                },
                {
                  icon: "api",
                  title: "Reusable downstream data",
                  copy: "One verified profile powers fan experiences, licensing, and API delivery.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px minmax(0, 1fr)",
                    gap: 14,
                    alignItems: "start",
                    padding: "14px 16px",
                    borderRadius: 18,
                    border: `1px solid ${T.borderLight}`,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: T.cyanDim,
                    }}
                  >
                    <Icon name={item.icon} size={20} color={T.cyan} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: T.paper,
                        marginBottom: 6,
                        fontFamily: font.body,
                      }}
                    >
                      {item.title}
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: T.mutedLight,
                        lineHeight: 1.6,
                        fontFamily: font.body,
                      }}
                    >
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${sectionY.standard}px ${pageGutter}px ${sectionY.band}px`,
        }}
      >
        <SectionTitle
          sub="Verified and in-review profiles that show how RICON packages biography, provenance, and commercial readiness."
          action={
            <Btn href="/talent" variant="ghost" style={{ minHeight: 48, padding: "0 18px", fontSize: 15 }}>
              View all <Icon name="arrow" size={16} />
            </Btn>
          }
        >
          Featured Icons
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: cardColumns, gap: isMobile ? 14 : 16 }}>
          {featuredTalent.map((talent) => {
            const isHovered = hoveredTalent === talent.id;
            return (
              <InteractiveCard
                key={talent.id}
                href={`/talent/${talent.id}`}
                onMouseEnter={() => setHoveredTalent(talent.id)}
                onMouseLeave={() => setHoveredTalent(null)}
                onFocus={() => setHoveredTalent(talent.id)}
                onBlur={() => setHoveredTalent(null)}
                ariaLabel={`Open ${talent.name}'s profile`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03)), rgba(8,16,24,0.88)",
                  border: `1px solid ${isHovered ? T.cyanMid : T.border}`,
                  borderRadius: 24,
                  padding: 20,
                  transition: "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
                  boxShadow: isHovered ? T.shadow : T.shadowSm,
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                <div style={{ position: "relative", marginBottom: 18 }}>
                  <MediaFrame
                    src={talent.imageUrl || asset(talent.imageKey, 640, 520)}
                    alt={talent.imageAlt}
                    aspectRatio="4 / 3"
                    radius={18}
                    position={talent.imagePosition}
                    overlay={ATMOSPHERIC_OVERLAY}
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
                  />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <Badge color={T.paper} bg="rgba(8,16,24,0.6)">
                      {talent.type}
                    </Badge>
                  </div>
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <Badge
                      color={talent.status === "Verified" ? T.green : T.orange}
                      bg="rgba(8,16,24,0.64)"
                    >
                      {talent.status}
                    </Badge>
                  </div>
                  <div style={{ position: "absolute", left: 12, bottom: 12 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        minHeight: 36,
                        padding: "0 12px",
                        borderRadius: 999,
                        background: "rgba(8,16,24,0.72)",
                        color: T.paper,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      View profile <Icon name="chevronRight" size={14} />
                    </div>
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: font.display,
                    color: T.paper,
                    margin: "0 0 6px",
                  }}
                >
                  {talent.name}
                </h3>
                <div style={{ fontSize: 13, color: T.mutedLight, marginBottom: 12 }}>
                  {talent.modules} modules · {talent.lastUpdated.label}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: T.mutedLight,
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  {talent.bio}
                </p>
                <MiniBar
                  value={talent.completeness}
                  max={100}
                  color={talent.status === "Verified" ? T.green : T.orange}
                  label={`${talent.completeness}% of biography modules complete`}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="info" size={13} color={T.muted} />
                  {talent.completeness}% of biography modules complete
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </section>

      <section
        style={{
          background: `linear-gradient(180deg, ${T.panel}, transparent), ${T.inkLight}`,
          padding: `${sectionY.band}px ${pageGutter}px`,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle sub="A four-step workflow that keeps research, approval, verification, and distribution visibly connected.">
            How RICON Works
          </SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: cardColumns, gap: isMobile ? 14 : 20 }}>
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  position: "relative",
                  minHeight: 270,
                  padding: "24px",
                  borderRadius: 24,
                  border: `1px solid ${T.border}`,
                  background: T.ink,
                  overflow: "hidden",
                  boxShadow: T.shadowSm,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <img
                  src={asset(step.imageKey, 440, 440)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: step.imagePosition,
                    opacity: 0.16,
                    filter: "brightness(0.48) saturate(0.68)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(8,16,24,0.08) 0%, rgba(8,16,24,0.9) 100%)",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background: alpha(step.color, 14),
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${step.color}`,
                      }}
                    >
                      <Icon name={step.icon} size={20} color={step.color} />
                    </div>
                    <div
                      style={{
                        minWidth: 48,
                        minHeight: 48,
                        borderRadius: 999,
                        display: "grid",
                        placeItems: "center",
                        color: T.paper,
                        background: "rgba(8,16,24,0.7)",
                        border: `1px solid ${T.border}`,
                        fontWeight: 800,
                        fontFamily: font.display,
                      }}
                    >
                      {step.num}
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: T.paper,
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.65, marginBottom: 12 }}>
                    {step.desc}
                  </p>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${sectionY.band}px ${pageGutter}px`,
        }}
      >
        <SectionTitle sub="One verified record supporting data delivery, fan touchpoints, and partner workflows.">
          The RICON Ecosystem
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: cardColumns, gap: isMobile ? 14 : 16 }}>
          {ECOSYSTEM_CARDS.map((item) => (
            <InteractiveCard
              key={item.title}
              href={item.href}
              ariaLabel={`Open ${item.title}`}
              style={{
                padding: "24px",
                borderRadius: 24,
                border: `1px solid ${T.border}`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.82)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                position: "relative",
                overflow: "hidden",
                boxShadow: T.shadowSm,
              }}
            >
              <img
                src={asset(item.imageKey, 480, 360)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: item.imagePosition,
                  opacity: 0.12,
                  filter: "brightness(0.5) saturate(0.7)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(8,16,24,0.22) 0%, rgba(8,16,24,0.88) 100%)",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: alpha(item.color, 14),
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 14,
                    border: `1px solid ${item.color}`,
                  }}
                >
                  <Icon name={item.icon} size={18} color={item.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: T.paper, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.65, marginBottom: 16 }}>
                  {item.desc}
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.paper, fontWeight: 700 }}>
                  Explore <Icon name="arrow" size={15} />
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </section>

      <section
        style={{
          textAlign: "center",
          padding: `${sectionY.standard}px ${pageGutter}px ${sectionY.footer}px`,
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? 30 : 38,
            fontWeight: 800,
            fontFamily: font.display,
            color: T.paper,
            marginBottom: 12,
          }}
        >
          Ready to build on trustworthy profile data?
        </h2>
        <p style={{ fontSize: 16, color: T.mutedLight, lineHeight: 1.75, marginBottom: 26 }}>
          Talent can join the beta intake queue now, and developers can request API access while key management rolls out.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn href="/apply/talent" variant="primary" style={{ minWidth: isMobile ? "100%" : 220 }}>
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
