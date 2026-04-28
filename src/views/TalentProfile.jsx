"use client";

import { useEffect, useMemo, useState } from "react";

import { T, font } from "../config/theme.js";
import {
  CORE_DATA_MODULES,
  CORE_DISTRIBUTION_DESTINATIONS,
  CORE_PIPELINE_STAGES,
  TALENT,
  asset,
} from "../data/siteData.js";
import {
  Badge,
  Btn,
  CopyButton,
  Icon,
  ProgressRing,
  TalentAvatar,
} from "../components/ui.jsx";

const shareTargets = (url, talentName) => [
  {
    label: "Share on X",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Explore ${talentName}'s verified RICON profile`)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: "Share on LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

const DEFAULT_SOURCE_ACCESS_DATE = "2026-04-10";

const PROFILE_SOURCES = {
  "jason-kidd": [
    {
      publication: "NBA.com Stats",
      url: "https://www.nba.com/stats/player/467/career",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 96,
    },
    {
      publication: "Naismith Memorial Basketball Hall of Fame",
      url: "https://www.hoophall.com/hall-of-famers/jason-kidd/",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 94,
    },
    {
      publication: "Basketball Reference",
      url: "https://www.basketball-reference.com/players/k/kiddja01.html",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 91,
    },
  ],
  "jr-rider": [
    {
      publication: "NBA.com Stats",
      url: "https://www.nba.com/stats/player/375/career",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 92,
    },
    {
      publication: "Basketball Reference",
      url: "https://www.basketball-reference.com/players/r/rideris01.html",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 90,
    },
    {
      publication: "NBA History",
      url: "https://www.nba.com/history",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 86,
    },
  ],
  "ray-allen": [
    {
      publication: "NBA.com Stats",
      url: "https://www.nba.com/stats/player/951/career",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 96,
    },
    {
      publication: "Naismith Memorial Basketball Hall of Fame",
      url: "https://www.hoophall.com/hall-of-famers/ray-allen/",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 94,
    },
    {
      publication: "Basketball Reference",
      url: "https://www.basketball-reference.com/players/a/allenra02.html",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 91,
    },
  ],
  "brian-blue": [
    {
      publication: "RICON Talent Intake",
      url: "/portal/review",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 88,
    },
    {
      publication: "Label Metadata Packet",
      url: "/workspace",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 84,
    },
    {
      publication: "Representative Review Notes",
      url: "/portal",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 82,
    },
  ],
  "cooper-flagg": [
    {
      publication: "NBA.com Stats",
      url: "https://www.nba.com/stats/player/1642843/career",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 93,
    },
    {
      publication: "Basketball Reference",
      url: "https://www.basketball-reference.com/players/f/flaggco01.html",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 88,
    },
    {
      publication: "Official Team Bio",
      url: "https://www.mavs.com/team/players/",
      accessed: DEFAULT_SOURCE_ACCESS_DATE,
      reliability: 86,
    },
  ],
};

const FALLBACK_SOURCES = [
  {
    publication: "RICON Research Workspace",
    url: "/workspace",
    accessed: DEFAULT_SOURCE_ACCESS_DATE,
    reliability: 82,
  },
  {
    publication: "Talent Review Portal",
    url: "/portal/review",
    accessed: DEFAULT_SOURCE_ACCESS_DATE,
    reliability: 80,
  },
];

const sourceCopies = {
  bio: "Biography module",
  career: "Career milestone",
  stats: "Statistics module",
  modules: "Core module record",
};

function getTalentSources(talent) {
  return PROFILE_SOURCES[talent.slug] ?? FALLBACK_SOURCES;
}

function getModuleSources(talent, module, index = 0) {
  const sources = getTalentSources(talent);
  const rotated = sources.map((_, offset) => sources[(index + offset) % sources.length]);

  return rotated.slice(0, Math.max(2, Math.min(3, rotated.length))).map((source) => ({
    ...source,
    module: sourceCopies[module] ?? "Verified profile record",
  }));
}

function getApprovalStatus(talent) {
  if (talent.status === "Verified") {
    return "Approved";
  }

  if (talent.status === "In Review") {
    return "Talent review active";
  }

  if (talent.status === "In Progress") {
    return "Editorial QA active";
  }

  return "Research intake";
}

function formatAccessedDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function RiconVerificationBadge() {
  return (
    <span
      title="Verified through multi-source validation and talent approval"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 34,
        padding: "0 12px 0 8px",
        borderRadius: 8,
        border: `1px solid ${T.cyanMid}`,
        background:
          "linear-gradient(135deg, rgba(60,200,255,0.18), rgba(47,211,138,0.14)), rgba(8,16,24,0.72)",
        color: T.paper,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        boxShadow: "0 10px 28px rgba(60,200,255,0.16)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 22,
          height: 22,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${T.cyan}, ${T.green})`,
          clipPath: "polygon(50% 0%, 92% 24%, 92% 76%, 50% 100%, 8% 76%, 8% 24%)",
          color: T.ink,
          fontFamily: font.display,
          fontSize: 12,
          fontWeight: 900,
        }}
      >
        R
      </span>
      RICON Verified
    </span>
  );
}

export default function TalentProfile({ talentId, viewport }) {
  const talent = TALENT.find((item) => item.id === talentId) || TALENT[0];
  const [activeTab, setActiveTab] = useState("bio");
  const [expandedCareer, setExpandedCareer] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [openSources, setOpenSources] = useState({});
  const { isMobile, isTablet } = viewport;
  const profileSurface =
    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.88)";
  const provenanceSources = getTalentSources(talent);
  const approvalStatus = getApprovalStatus(talent);
  const auditTrail = [
    {
      label: "Created",
      detail: "Initial research record opened",
      date: talent.lastUpdated.label,
    },
    {
      label: "Reviewed",
      detail: talent.status === "Potential" ? "Editorial QA pending" : "Editorial QA completed",
      date: talent.lastUpdated.label,
    },
    {
      label: "Approved",
      detail: talent.status === "Verified" ? "Talent approval captured" : approvalStatus,
      date: talent.status === "Verified" ? talent.lastUpdated.label : "Pending",
    },
  ];
  const tabs = [
    { id: "bio", label: "Biography" },
    { id: "career", label: "Career" },
    { id: "stats", label: "Statistics" },
  ];

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `https://ricon.example/talent/${talent.id}`;
    }

    return window.location.href;
  }, [talent.id]);

  useEffect(() => {
    setActiveTab("bio");
    setExpandedCareer(0);
    setFeedback("");
    setOpenSources({});
  }, [talent.id]);

  const toggleSources = (key) => {
    setOpenSources((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const renderSourcesToggle = (key, label, sources) => {
    const isOpen = Boolean(openSources[key]);

    return (
      <div style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={() => toggleSources(key)}
          aria-expanded={isOpen}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 38,
            padding: "0 12px",
            borderRadius: 8,
            border: `1px solid ${isOpen ? T.cyanMid : T.borderLight}`,
            background: isOpen ? T.cyanDim : "rgba(255,255,255,0.03)",
            color: T.paper,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Icon name={isOpen ? "chevDown" : "external"} size={14} color={isOpen ? T.cyan : T.muted} />
          View Sources
        </button>
        {isOpen ? (
          <div
            aria-label={`${label} sources`}
            style={{
              marginTop: 10,
              display: "grid",
              gap: 10,
            }}
          >
            {sources.map((source) => (
              <div
                key={`${key}-${source.publication}-${source.url}`}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `1px solid ${T.borderLight}`,
                  background: "rgba(8,16,24,0.72)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    marginBottom: 6,
                  }}
                >
                  <a
                    href={source.url}
                    target={source.url.startsWith("/") ? undefined : "_blank"}
                    rel={source.url.startsWith("/") ? undefined : "noreferrer"}
                    style={{
                      color: T.paper,
                      fontSize: 13,
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    {source.publication}
                  </a>
                  <span
                    style={{
                      color: source.reliability >= 90 ? T.green : T.orange,
                      fontSize: 12,
                      fontWeight: 900,
                      fontFamily: font.mono,
                    }}
                  >
                    {source.reliability}/100
                  </span>
                </div>
                <div style={{ fontSize: 12, color: T.mutedLight, lineHeight: 1.65, wordBreak: "break-word" }}>
                  Source URL: {source.url}
                </div>
                <div style={{ fontSize: 12, color: T.mutedLight, lineHeight: 1.65 }}>
                  Publication: {source.publication} · Date accessed: {formatAccessedDate(source.accessed)} · Reliability score: {source.reliability}/100
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const flashMessage = (message) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      flashMessage("Profile link copied.");
    } catch {
      flashMessage("Unable to copy link.");
    }
  };

  const handleFollow = () => {
    setIsFollowing((value) => !value);
    flashMessage(isFollowing ? "Removed from favourites." : "Added to favourites.");
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px 40px" : "40px 24px 56px" }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          marginBottom: 28,
        }}
      >
        <img
          src={talent.bannerUrl || asset(talent.bannerKey, 1600, 900)}
          alt={talent.bannerAlt || ""}
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: talent.bannerPosition,
            opacity: 0.22,
            filter: "brightness(0.52) saturate(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,16,24,0.18) 0%, rgba(8,16,24,0.76) 52%, rgba(8,16,24,0.94) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: isMobile ? 18 : 24,
            alignItems: "flex-start",
            flexWrap: "wrap",
            padding: isMobile ? 18 : 24,
          }}
        >
          <TalentAvatar
            talent={talent}
            size={isMobile ? 96 : 128}
            radius={isMobile ? 20 : 24}
            border={`2px solid ${T.cyanMid}`}
          />

          <div style={{ flex: 1, minWidth: isMobile ? 0 : 320 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              <Badge color={talent.status === "Verified" ? T.green : T.orange} bg="rgba(8,16,24,0.6)">
                {talent.status}
              </Badge>
              {talent.status === "Verified" ? <RiconVerificationBadge /> : null}
            </div>
            <h1
              style={{
                fontSize: isMobile ? 32 : isTablet ? 40 : 48,
                fontWeight: 900,
                fontFamily: font.display,
                color: T.paper,
                lineHeight: 0.96,
                letterSpacing: "-0.05em",
                marginBottom: 10,
              }}
            >
              {talent.name}
            </h1>
            <div style={{ fontSize: 14, color: T.mutedLight, marginBottom: 16 }}>
              {talent.type} · {talent.modules}/{CORE_DATA_MODULES.length} Core modules · {talent.verifiedClaims} verified claims · Updated {talent.lastUpdated.label}
            </div>
            <p
              style={{
                fontSize: 16,
                color: T.mutedLight,
                lineHeight: 1.8,
                marginBottom: 18,
                maxWidth: 680,
              }}
            >
              {talent.longBio}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <Badge color={T.cyan}>
                <Icon name="shield" size={12} color={T.cyan} /> {talent.modules} Core modules
              </Badge>
              <Badge color={T.green}>
                <Icon name="lock" size={12} color={T.green} /> Versioned audit trail
              </Badge>
              <Badge color={T.orange}>
                <Icon name="users" size={12} color={T.orange} /> {talent.audience}
              </Badge>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant={isFollowing ? "secondary" : "primary"} onClick={handleFollow}>
                <Icon name="star" size={15} /> {isFollowing ? "Following" : "Follow"}
              </Btn>
              <Btn variant="outline" onClick={handleShare}>
                <Icon name="share" size={15} /> Share profile
              </Btn>
              <CopyButton value={shareUrl} label="Copy profile link" />
              {shareTargets(shareUrl, talent.name).map((item) => (
                <Btn key={item.label} href={item.href} variant="ghost">
                  {item.label}
                </Btn>
              ))}
            </div>
            {feedback ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  color: T.green,
                  fontWeight: 700,
                }}
              >
                {feedback}
              </div>
            ) : null}
          </div>

          <div
            style={{
              marginLeft: isMobile ? 0 : "auto",
              width: isMobile ? "100%" : "auto",
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: 18,
                background: "rgba(8,16,24,0.62)",
                border: `1px solid ${T.border}`,
                borderRadius: 22,
                minWidth: isMobile ? "100%" : 180,
              }}
            >
              <ProgressRing
                percent={talent.completeness}
                size={isMobile ? 92 : 110}
                stroke={isMobile ? 7 : 8}
                color={talent.status === "Verified" ? T.green : T.orange}
                label={`${talent.name} profile completeness ${talent.completeness}%`}
              />
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: T.mutedLight,
                  lineHeight: 1.6,
                }}
                title={`${talent.completeness}% of biography modules complete`}
              >
                <Icon name="info" size={13} color={T.muted} />
                {talent.completeness}% of biography modules complete
              </div>
            </div>
            <div
              style={{
                padding: "16px 18px",
                background: "rgba(8,16,24,0.62)",
                border: `1px solid ${T.border}`,
                borderRadius: 22,
              }}
            >
              <div style={{ fontSize: 12, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Distribution readiness
              </div>
              <div style={{ fontSize: 18, color: T.paper, fontWeight: 700, marginBottom: 6 }}>
                {talent.modulesDetail}
              </div>
              <div style={{ fontSize: 13, color: T.mutedLight, lineHeight: 1.6 }}>
                {talent.distributionGate}. Core never pushes unverified data downstream.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label={`${talent.name} provenance and audit trail`}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.05fr) minmax(280px, 0.95fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            padding: isMobile ? 18 : 22,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            background: profileSurface,
            boxShadow: T.shadowSm,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            <RiconVerificationBadge />
            <span style={{ fontSize: 12, color: T.mutedLight }}>
              Verified through multi-source validation and talent approval
            </span>
          </div>
          <h2 style={{ fontSize: 20, color: T.paper, fontWeight: 800, marginBottom: 14 }}>
            Provenance Panel
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              ["Sources used", `${provenanceSources.length} primary records`],
              ["Approval status", approvalStatus],
              ["Last verified date", talent.lastUpdated.label],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: `1px solid ${T.borderLight}`,
                  background: "rgba(8,16,24,0.72)",
                }}
              >
                <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  {label}
                </div>
                <div style={{ fontSize: 15, color: T.paper, fontWeight: 800, lineHeight: 1.35 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {provenanceSources.map((source) => (
              <div
                key={`provenance-${source.publication}-${source.url}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto",
                  gap: 8,
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <a
                  href={source.url}
                  target={source.url.startsWith("/") ? undefined : "_blank"}
                  rel={source.url.startsWith("/") ? undefined : "noreferrer"}
                  style={{ color: T.paper, textDecoration: "none", fontSize: 13, fontWeight: 800 }}
                >
                  {source.publication}
                </a>
                <span style={{ color: T.mutedLight, fontSize: 12 }}>
                  Reliability {source.reliability}/100
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? 18 : 22,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            background: profileSurface,
            boxShadow: T.shadowSm,
          }}
        >
          <h2 style={{ fontSize: 20, color: T.paper, fontWeight: 800, marginBottom: 18 }}>
            Audit Trail Preview
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            {auditTrail.map((event, index) => (
              <div
                key={event.label}
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
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    border: `1px solid ${index === auditTrail.length - 1 && event.date === "Pending" ? T.orange : T.green}`,
                    background: index === auditTrail.length - 1 && event.date === "Pending" ? T.orangeDim : T.greenDim,
                    color: T.paper,
                    fontFamily: font.mono,
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ color: T.paper, fontSize: 15, fontWeight: 800 }}>{event.label}</span>
                    <span style={{ color: event.date === "Pending" ? T.orange : T.green, fontSize: 12, fontWeight: 800 }}>
                      {event.date}
                    </span>
                  </div>
                  <p style={{ color: T.mutedLight, fontSize: 13, lineHeight: 1.6 }}>
                    {event.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label={`${talent.name} Core data modules`}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(280px, 0.72fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            padding: isMobile ? 18 : 22,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            background: profileSurface,
            boxShadow: T.shadowSm,
          }}
        >
          <h2 style={{ fontSize: 20, color: T.paper, fontWeight: 800, marginBottom: 14 }}>
            Core Module Readiness
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {(talent.moduleStatus ?? []).map((module) => (
              <div
                key={module.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `1px solid ${module.status === "Verified" ? T.green : module.status === "In Review" ? T.orange : T.borderLight}`,
                  background: "rgba(8,16,24,0.72)",
                }}
              >
                <div style={{ color: T.paper, fontSize: 14, fontWeight: 800, marginBottom: 4 }}>
                  {module.name}
                </div>
                <div style={{ color: module.status === "Verified" ? T.green : module.status === "In Review" ? T.orange : T.mutedLight, fontSize: 12, fontWeight: 800 }}>
                  {module.status} · {module.phase}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: isMobile ? 18 : 22,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            background: profileSurface,
            boxShadow: T.shadowSm,
          }}
        >
          <h2 style={{ fontSize: 20, color: T.paper, fontWeight: 800, marginBottom: 14 }}>
            Publishing Gate
          </h2>
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {CORE_PIPELINE_STAGES.map((stage, index) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 10, color: T.paper, fontSize: 13 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    background: index < CORE_PIPELINE_STAGES.length - 1 ? T.cyanDim : T.greenDim,
                    color: index < CORE_PIPELINE_STAGES.length - 1 ? T.cyan : T.green,
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </span>
                {stage}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: T.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Downstream
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {CORE_DISTRIBUTION_DESTINATIONS.map((destination) => (
              <div key={destination} style={{ color: T.mutedLight, fontSize: 13 }}>
                {destination}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isMobile ? (
        <label style={{ display: "grid", gap: 8, marginBottom: 22 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.paper }}>
            Profile section
          </span>
          <select
            value={activeTab}
            onChange={(event) => setActiveTab(event.target.value)}
            style={{
              minHeight: 50,
              padding: "0 16px",
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              background: T.panel,
              color: T.paper,
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div
          role="tablist"
          aria-label={`${talent.name} profile sections`}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                minHeight: 48,
                padding: "0 18px",
                border: `1px solid ${activeTab === tab.id ? T.cyan : T.borderLight}`,
                borderRadius: 999,
                background: activeTab === tab.id ? T.cyanDim : "transparent",
                color: activeTab === tab.id ? T.paper : T.mutedLight,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: font.body,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === "bio" ? (
        <section
          role="tabpanel"
          style={{
            background: profileSurface,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            padding: isMobile ? 18 : 24,
            boxShadow: T.shadowSm,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <Icon name="verified" size={18} color={T.cyan} />
            <span style={{ fontSize: 13, color: T.cyan, fontWeight: 700 }}>
              Talent-ready biography module
            </span>
            <span style={{ fontSize: 12, color: T.muted, marginLeft: "auto" }}>
              Signed snapshot · {talent.lastUpdated.label}
            </span>
          </div>
          <p style={{ fontSize: 16, color: T.paper, lineHeight: 1.9, marginBottom: 18 }}>
            {talent.bio}
          </p>
          {renderSourcesToggle("bio", "Biography module", getModuleSources(talent, "bio"))}
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "16px 18px",
                background: T.ink,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: T.paper, fontWeight: 700, marginBottom: 6 }}>
                What verification means
              </div>
              <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>
                Facts in this module have source notes and a visible review state, so licensees know what is final and what is still pending.
              </div>
            </div>
            <div
              style={{
                padding: "16px 18px",
                background: T.ink,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: T.paper, fontWeight: 700, marginBottom: 6 }}>
                Provenance summary
              </div>
              <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>
                Primary research, audit history, and talent review checkpoints stay attached to the record throughout distribution.
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "career" ? (
        <section role="tabpanel" style={{ display: "grid", gap: 14 }}>
          {talent.career.map((item, index) => {
            const isOpen = expandedCareer === index;
            return (
              <div
                key={`${item.title}-${item.period}`}
                style={{
                  background: profileSurface,
                  borderRadius: 24,
                  border: `1px solid ${T.border}`,
                  boxShadow: T.shadowSm,
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedCareer(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "44px minmax(0, 1fr) 28px",
                    gap: 14,
                    alignItems: "center",
                    padding: "18px 20px",
                    background: "transparent",
                    border: "none",
                    color: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
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
                      color: T.cyan,
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, color: T.paper, fontWeight: 700, marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 13, color: T.mutedLight }}>
                      {item.period}
                    </div>
                  </div>
                  <Icon name="chevDown" size={18} color={T.paper} />
                </button>
                {isOpen ? (
                  <div
                    style={{
                      padding: "0 20px 20px 78px",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <p style={{ fontSize: 15, color: T.mutedLight, lineHeight: 1.8 }}>
                      {item.significance}
                    </p>
                    {renderSourcesToggle(
                      `career-${index}`,
                      item.title,
                      getModuleSources(talent, "career", index)
                    )}
                    <div style={{ display: "grid", gap: 10 }}>
                      <div
                        style={{
                          padding: "14px 16px",
                          borderRadius: 16,
                          background: T.ink,
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        <div style={{ fontSize: 12, color: T.paper, fontWeight: 700, marginBottom: 4 }}>
                          Context
                        </div>
                        <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>
                          {item.stats}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "14px 16px",
                          borderRadius: 16,
                          background: T.ink,
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        <div style={{ fontSize: 12, color: T.paper, fontWeight: 700, marginBottom: 4 }}>
                          Why it matters
                        </div>
                        <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>
                          {item.quote}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>
      ) : null}

      {activeTab === "stats" ? (
        <section
          role="tabpanel"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {talent.stats.map((stat, index) => (
            <div
              key={stat.key}
              style={{
                background: profileSurface,
                borderRadius: 24,
                border: `1px solid ${T.border}`,
                padding: 22,
                boxShadow: T.shadowSm,
              }}
              title={stat.context}
            >
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 34, fontWeight: 800, fontFamily: font.display, color: T.cyan, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: T.paperDim, marginBottom: 10 }}>{stat.unit}</div>
              <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>
                {stat.context}
              </div>
              {renderSourcesToggle(
                `stat-${stat.key}`,
                stat.label,
                getModuleSources(talent, "stats", index)
              )}
            </div>
          ))}
        </section>
      ) : null}

      <section
        style={{
          marginTop: 32,
          padding: isMobile ? "18px" : "22px 24px",
          borderRadius: 24,
          border: `1px solid ${T.border}`,
          background: profileSurface,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.paper, marginBottom: 6 }}>
            Need the API version of this record?
          </div>
          <div style={{ fontSize: 14, color: T.mutedLight, lineHeight: 1.7 }}>
            Authenticated consumers can request access to structured endpoints, usage dashboards, and key management from the developer intake flow.
          </div>
        </div>
        <Btn href="/developers/api-access" variant="outline">
          Request API access
        </Btn>
      </section>

      <div className="visually-hidden" aria-live="polite">
        {feedback}
      </div>
    </div>
  );
}
