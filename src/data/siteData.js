import { T } from "../config/theme.js";

const IMAGE_IDS = {
  heroTunnel: "1769527818981-ed8961067a14",
  stadiumLights: "1741014881170-8d0c2cb1186b",
  jerseyLocker: "1641947521468-a2699a318c62",
  basketballCourt: "1557467501-56d4f975dd58",
  micSpotlight: "1633709592156-e0a77a6cb1fe",
  mixingDesk: "1769938036336-d4a44a4a8bdb",
  vinylRecord: "1741863625026-3bc0f763e8a0",
  framedPrint: "1585205023150-b960992f10a5",
  museumDisplay: "1765127959637-8eba0e612f9e",
  warmBokeh: "1502544782381-bab46892bdb0",
  notebookDesk: "1675380783098-d8bb1546196c",
  teeFlatlay: "1724964995582-4f6f46b9970b",
  gamingController: "1650586044209-a79e6a633d35",
  courtPortrait: "1517649763962-0c623066013b",
  workspacePortrait: "1521737604893-d14cc237f11d",
};

const unsplash = (id, width, height) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;

export const asset = (key, width, height) => unsplash(IMAGE_IDS[key], width, height);

export const directAsset = (url) => url;

export const IMAGE_FILTER = "brightness(0.82) saturate(0.92)";
export const IMAGE_OVERLAY =
  "linear-gradient(180deg, rgba(8,16,24,0.04) 0%, rgba(8,16,24,0.36) 100%)";
export const ATMOSPHERIC_OVERLAY =
  "linear-gradient(180deg, rgba(8,16,24,0.16) 0%, rgba(8,16,24,0.72) 100%)";

export const FILTER_ORDER = ["all", "Verified", "In Review", "In Progress", "Potential"];

export const SORT_OPTIONS = [
  { value: "verified", label: "Verified first" },
  { value: "recent", label: "Most recently updated" },
  { value: "popularity", label: "Most popular" },
  { value: "completion", label: "Highest completion" },
];

const talentImage = (url, alt, position = "center 36%") => ({
  imageUrl: directAsset(url),
  imageAlt: alt,
  imagePosition: position,
});

const dated = (iso, label) => ({
  iso,
  label,
});

export const CORE_DATA_MODULES = [
  "Identity",
  "Biography",
  "Career Timeline",
  "Statistics",
  "Achievements",
  "Verified Quotes",
  "Media Assets",
  "Brand Identity",
];

export const CORE_PIPELINE_STAGES = [
  "Research",
  "Editorial Review",
  "Talent Approval",
  "Published",
];

export const CORE_DISTRIBUTION_DESTINATIONS = [
  "RICON Profile Network",
  "B2B API",
  "Digital Twin AI",
];

const moduleStatus = (complete, active = []) =>
  CORE_DATA_MODULES.map((name, index) => ({
    name,
    phase: index <= 5 || name === "Media Assets" ? "MVP" : "V2",
    status: complete.includes(name) ? "Verified" : active.includes(name) ? "In Review" : "Pending",
  }));

export const TALENT = [
  {
    id: 1,
    slug: "jason-kidd",
    name: "Jason Kidd",
    type: "Basketball",
    status: "Verified",
    coreStatus: "talent_approved",
    distributionGate: "Eligible after publish",
    verifiedClaims: 42,
    modules: 8,
    completeness: 100,
    popularity: 98,
    audience: "Talent, fans, licensees",
    ...talentImage(
      "https://cdn.nba.com/headshots/nba/latest/1040x760/467.png",
      "Jason Kidd headshot in his New Jersey Nets uniform",
      "center 18%"
    ),
    bannerUrl: asset("stadiumLights", 1600, 900),
    bannerAlt: "Arena lights above a basketball court",
    bannerPosition: "center 42%",
    earnings: "$42,800",
    lastUpdated: dated("2026-03-12", "Mar 12, 2026"),
    bio: "Hall of Fame point guard, championship coach, and one of basketball's defining playmakers. Jason Kidd's profile traces the verified milestones that shaped his on-court legacy and post-playing career.",
    longBio:
      "RICON combines sourced research with talent review so every stage of Jason Kidd's biography reflects the version of events his team is prepared to stand behind. This profile packages career milestones and downstream licensing rights into a single verified record.",
    career: [
      {
        title: "NBA lottery selection launches pro career",
        period: "1994",
        significance:
          "Kidd entered the league as the second overall pick and immediately reshaped expectations for oversized point guards with elite vision and rebounding.",
        stats: "Co-Rookie of the Year in 1995",
        quote: "Widely credited with accelerating the pace of offenses he led.",
      },
      {
        title: "Back-to-back Finals runs with New Jersey",
        period: "2002-2003",
        significance:
          "His transition game and floor leadership turned the Nets into consecutive Eastern Conference champions.",
        stats: "2 Finals appearances, 3 All-NBA First Team selections in the era",
        quote: "A proof point for how elite orchestration changes a franchise ceiling.",
      },
      {
        title: "Championship breakthrough in Dallas",
        period: "2011",
        significance:
          "Kidd's experience and perimeter defense were central to Dallas winning the 2011 NBA title.",
        stats: "NBA champion",
        quote: "The title completed a career arc that had long been defined by near misses.",
      },
      {
        title: "Second act as an NBA head coach",
        period: "2021-present",
        significance:
          "His coaching career extends the record into leadership, systems thinking, and player development.",
        stats: "Western Conference title appearance as Mavericks head coach",
        quote: "RICON tracks both playing and leadership chapters as part of the same verified biography.",
      },
    ],
    stats: [
      {
        key: "games",
        label: "Games played",
        value: "1,391",
        unit: "career games",
        context: "Among the most durable point guards of his era.",
      },
      {
        key: "assists",
        label: "Assists",
        value: "12,091",
        unit: "career assists",
        context: "Second all-time when he retired.",
      },
      {
        key: "rebounds",
        label: "Rebounds",
        value: "8,725",
        unit: "career rebounds",
        context: "Unusually high for a primary ball handler.",
      },
      {
        key: "titles",
        label: "Championships",
        value: "1",
        unit: "NBA title",
        context: "Won with Dallas in 2011.",
      },
    ],
    modulesDetail: "Identity, biography, career timeline, statistics, achievements, quotes, media assets, brand identity",
    moduleStatus: moduleStatus(CORE_DATA_MODULES),
  },
  {
    id: 2,
    slug: "jr-rider",
    name: "JR Ryder",
    fullName: "Isaiah 'J.R.' Rider",
    type: "Basketball",
    status: "Verified",
    coreStatus: "talent_approved",
    distributionGate: "Eligible after publish",
    verifiedClaims: 28,
    modules: 7,
    completeness: 83,
    popularity: 82,
    audience: "Fans, licensees",
    imageUrl: directAsset("https://cdn.nba.com/headshots/nba/latest/1040x760/375.png"),
    imageAlt: "Isaiah 'J.R.' Rider headshot in his NBA playing uniform",
    imagePosition: "center 18%",
    bannerUrl: asset("heroTunnel", 1600, 900),
    bannerAlt: "Arena tunnel lit before a game",
    bannerPosition: "center 36%",
    earnings: "$18,200",
    lastUpdated: dated("2026-03-08", "Mar 8, 2026"),
    bio: "Explosive scorer and dunk contest champion whose verified record centers on signature moments, cultural relevance, and archival storytelling.",
    longBio:
      "RICON's J.R. Rider profile focuses on preserving the moments most fans remember while adding sourcing, review notes, and commercial packaging for future projects.",
    career: [
      {
        title: "Top-five NBA draft selection",
        period: "1993",
        significance:
          "Rider entered the league with elite athleticism and instant-name recognition.",
        stats: "5th overall pick",
        quote: "An arrival moment that positioned him as one of the draft's headline talents.",
      },
      {
        title: "Slam Dunk Contest winner",
        period: "1994",
        significance:
          "His contest victory remains one of the most replayed parts of his career and still drives licensing interest.",
        stats: "1994 Dunk Contest champion",
        quote: "The signature dunk is a core asset in his story universe.",
      },
      {
        title: "Peak scoring seasons in Minnesota and Portland",
        period: "1994-1999",
        significance:
          "Rider's scoring output and highlight plays helped define how fans remember his prime.",
        stats: "16.7 points per game career average at peak volume",
        quote: "The verified record balances performance peaks with broader context.",
      },
    ],
    stats: [
      {
        key: "games",
        label: "Games played",
        value: "563",
        unit: "career games",
        context: "Nine NBA seasons across five teams.",
      },
      {
        key: "points",
        label: "Points",
        value: "9,405",
        unit: "career points",
        context: "High-volume perimeter scoring defined his peak.",
      },
      {
        key: "dunks",
        label: "Signature dunk title",
        value: "1994",
        unit: "contest year",
        context: "A major part of his public legacy and collectibles demand.",
      },
      {
        key: "teams",
        label: "Teams played for",
        value: "5",
        unit: "NBA teams",
        context: "Minnesota, Portland, Atlanta, Lakers, Denver.",
      },
    ],
    modulesDetail: "Identity, biography, career timeline, statistics, achievements, quotes, media assets",
    moduleStatus: moduleStatus(CORE_DATA_MODULES.filter((name) => name !== "Brand Identity"), ["Brand Identity"]),
  },
  {
    id: 3,
    slug: "ray-allen",
    name: "Ray Allen",
    type: "Basketball",
    status: "In Review",
    coreStatus: "talent_review",
    distributionGate: "Blocked until talent approval",
    verifiedClaims: 31,
    modules: 6,
    completeness: 67,
    popularity: 94,
    audience: "Talent, fans, licensees",
    ...talentImage(
      "https://cdn.nba.com/headshots/nba/latest/1040x760/951.png",
      "Ray Allen portrait in his Milwaukee Bucks uniform",
      "center 18%"
    ),
    bannerUrl: asset("basketballCourt", 1600, 900),
    bannerAlt: "Basketball resting on a polished hardwood floor",
    bannerPosition: "center 38%",
    earnings: "$0",
    lastUpdated: dated("2026-03-01", "Mar 1, 2026"),
    bio: "Two-time champion and one of basketball's defining shooters. This profile is in talent review while final chronology and licensing notes are being approved.",
    longBio:
      "Allen's record pairs a deeply cited career arc with talent review checkpoints so licensing consumers can understand exactly which modules are final and which remain in approval.",
    career: [
      {
        title: "Immediate impact after top-five selection",
        period: "1996",
        significance:
          "Allen's early years established him as one of the league's most polished scoring guards.",
        stats: "Top-five draft pick",
        quote: "The profile tracks how his reputation shifted from scorer to all-time shooting benchmark.",
      },
      {
        title: "Championship core piece in Boston",
        period: "2007-2012",
        significance:
          "His move to the Celtics added postseason weight to an already elite resume.",
        stats: "NBA champion in 2008",
        quote: "Verified context highlights both role change and continued scoring efficiency.",
      },
      {
        title: "Historic Finals shot in Miami",
        period: "2013",
        significance:
          "Allen's corner three in the 2013 Finals remains one of the most valuable single moments in modern basketball memory.",
        stats: "2 NBA championships",
        quote: "A defining example of why provenance matters for highlight licensing.",
      },
    ],
    stats: [
      {
        key: "points",
        label: "Points",
        value: "24,505",
        unit: "career points",
        context: "One of the highest totals among modern shooting guards.",
      },
      {
        key: "threes",
        label: "Three-pointers made",
        value: "2,973",
        unit: "career threes",
        context: "Held the NBA record when he retired.",
      },
      {
        key: "games",
        label: "Games played",
        value: "1,300",
        unit: "career games",
        context: "Elite longevity across four franchises.",
      },
      {
        key: "titles",
        label: "Championships",
        value: "2",
        unit: "NBA titles",
        context: "Won with Boston and Miami.",
      },
    ],
    modulesDetail: "Identity, biography, career timeline, statistics, achievements, media assets",
    moduleStatus: moduleStatus(
      ["Identity", "Biography", "Career Timeline", "Statistics"],
      ["Achievements", "Verified Quotes", "Media Assets"]
    ),
  },
  {
    id: 4,
    slug: "brian-blue",
    name: "Brian Blue",
    type: "Music",
    status: "In Progress",
    coreStatus: "draft",
    distributionGate: "Research workspace only",
    verifiedClaims: 9,
    modules: 3,
    completeness: 33,
    popularity: 41,
    audience: "Talent, fans",
    imageUrl: asset("workspacePortrait", 900, 900),
    imageAlt: "Studio portrait representing recording artist Brian Blue",
    imagePosition: "center 28%",
    bannerUrl: asset("mixingDesk", 1600, 900),
    bannerAlt: "Mixing desk illuminated in a recording studio",
    bannerPosition: "center 45%",
    earnings: "$0",
    lastUpdated: dated("2026-02-22", "Feb 22, 2026"),
    bio: "Multi-genre producer and vocalist bridging hip-hop, R&B, and electronic music. This profile is still gathering source materials and rights approvals.",
    longBio:
      "RICON handles emerging talent differently from legacy athletes: early profiles prioritize source gathering, identity confirmation, and rights setup before broader distribution.",
    career: [
      {
        title: "Independent release run establishes audience",
        period: "2018-present",
        significance:
          "Blue's catalog and producer credits are being normalized into a single verified timeline.",
        stats: "3 albums, 14 singles",
        quote: "The story is still being assembled with label and management review.",
      },
      {
        title: "Collaborative production credits expand visibility",
        period: "2022-present",
        significance:
          "This phase is focused on documenting collaboration history and rights ownership.",
        stats: "8 featured collaborations",
        quote: "A clean rights graph is essential before sync and licensing data goes live.",
      },
    ],
    stats: [
      {
        key: "albums",
        label: "Albums released",
        value: "3",
        unit: "projects",
        context: "Verified release metadata is still being expanded.",
      },
      {
        key: "singles",
        label: "Singles",
        value: "14",
        unit: "tracks",
        context: "Includes lead and collaborative releases.",
      },
      {
        key: "streams",
        label: "Streams",
        value: "2.4M",
        unit: "lifetime streams",
        context: "Across verified DSP reporting sources.",
      },
      {
        key: "features",
        label: "Collaborations",
        value: "8",
        unit: "featured credits",
        context: "An active review area for rights approvals.",
      },
    ],
    modulesDetail: "Identity, biography, statistics",
    moduleStatus: moduleStatus(["Identity"], ["Biography", "Statistics", "Media Assets"]),
  },
  {
    id: 5,
    slug: "cooper-flagg",
    name: "Cooper Flagg",
    type: "Basketball",
    status: "Potential",
    coreStatus: "draft",
    distributionGate: "Pre-verification intake",
    verifiedClaims: 4,
    modules: 2,
    completeness: 18,
    popularity: 100,
    audience: "Fans, licensees",
    ...talentImage(
      "https://cdn.nba.com/headshots/nba/latest/1040x760/1642843.png",
      "Cooper Flagg headshot in his Dallas Mavericks uniform",
      "center 18%"
    ),
    bannerUrl: asset("heroTunnel", 1600, 900),
    bannerAlt: "Backlit arena tunnel before player introductions",
    bannerPosition: "center 36%",
    earnings: "$0",
    lastUpdated: dated("2026-04-04", "Apr 4, 2026"),
    bio: "Recent No. 1 overall pick whose profile is being assembled for future verification and licensing workflows.",
    longBio:
      "Potential profiles give teams and rights holders an early place to organize the story before full talent review begins. Cooper Flagg's record is in pre-verification intake.",
    career: [
      {
        title: "National high school phenom becomes top recruit",
        period: "2023-2024",
        significance:
          "Flagg's rise generated immediate licensing demand for identity-safe, accurate background data.",
        stats: "Consensus No. 1 recruit",
        quote: "A strong candidate for early biography infrastructure because the demand curve rises quickly.",
      },
      {
        title: "Duke season cements pro trajectory",
        period: "2024-2025",
        significance:
          "College performance turned hype into record-level attention and accelerated downstream licensing opportunities.",
        stats: "National player of the year honors",
        quote: "RICON captures the bridge between prospect coverage and professional history.",
      },
      {
        title: "Selected first overall by Dallas",
        period: "2025",
        significance:
          "The draft created a new phase for team, league, and commercial storytelling.",
        stats: "No. 1 overall pick",
        quote: "A key transition point for verified identity and licensing metadata.",
      },
    ],
    stats: [
      {
        key: "draft",
        label: "Draft position",
        value: "1",
        unit: "overall pick",
        context: "Selected first in the 2025 NBA draft.",
      },
      {
        key: "points",
        label: "Career-high points",
        value: "51",
        unit: "single-game points",
        context: "Teenage scoring record noted in recent coverage.",
      },
      {
        key: "rebounds",
        label: "Profile readiness",
        value: "18%",
        unit: "modules complete",
        context: "Early intake with verification still ahead.",
      },
      {
        key: "status",
        label: "Verification status",
        value: "Potential",
        unit: "workflow stage",
        context: "Initial intake before talent review begins.",
      },
    ],
    modulesDetail: "Identity, early biography intake",
    moduleStatus: moduleStatus(["Identity"], ["Biography"]),
  },
];

export const API_METRICS = {
  calls: "1.2M",
  uptime: "99.97%",
  latency: "42 ms",
  consumers: 14,
};

export const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    title: "Research",
    desc: "RICON researchers assemble timelines, statistics, and rights metadata from primary and high-confidence secondary sources.",
    detail:
      "Every claim enters the workflow with provenance notes, source links, and confidence indicators before it is surfaced to the talent team.",
    icon: "search",
    color: T.cyan,
    imageKey: "notebookDesk",
    imagePosition: "center 52%",
  },
  {
    num: "02",
    title: "Review",
    desc: "Talent or their representatives review facts, annotate nuance, and request changes directly inside the profile workspace.",
    detail:
      "The review phase captures disagreements, pending edits, and ownership approvals so downstream consumers understand the current state of the record.",
    icon: "shield",
    color: T.orange,
    imageKey: "framedPrint",
    imagePosition: "center 40%",
  },
  {
    num: "03",
    title: "Verify",
    desc: "Approved modules are versioned, cryptographically signed, and locked so consumers know when information is final.",
    detail:
      "Verification logs create an audit trail for every edit, approval, and published snapshot across biography modules.",
    icon: "verified",
    color: T.green,
    imageKey: "museumDisplay",
    imagePosition: "center 42%",
  },
  {
    num: "04",
    title: "Distribute",
    desc: "Verified records become reusable across fan experiences, partner workflows, licensing feeds, and API consumers.",
    detail:
      "Distribution packages the same trusted source into formats that work for consumer experiences and enterprise integrations alike.",
    icon: "zap",
    color: T.violet,
    imageKey: "warmBokeh",
    imagePosition: "center",
  },
];

export const ECOSYSTEM_CARDS = [
  {
    title: "Data Licensing",
    desc: "High-trust profile data for media, gaming, analytics, partner platforms, and enterprise knowledge systems.",
    icon: "api",
    color: T.cyan,
    href: "/data-licensing",
    imageKey: "warmBokeh",
    imagePosition: "center",
  },
  {
    title: "Digital Experiences",
    desc: "Verified records powering profile hubs, drops, storefronts, and fan storytelling without misinformation drift.",
    icon: "globe",
    color: T.violet,
    href: "/digital-experiences",
    imageKey: "heroTunnel",
    imagePosition: "center 36%",
  },
  {
    title: "Gaming + AI",
    desc: "Identity-safe representations for simulations, assistive experiences, and next-generation media systems.",
    icon: "play",
    color: T.pink,
    href: "/gaming-ai",
    imageKey: "gamingController",
    imagePosition: "center 50%",
  },
];

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About", icon: "info" },
  { id: "how-it-works", label: "How It Works", icon: "grid" },
  { id: "talent", label: "Talent Directory", icon: "users" },
  { id: "api", label: "API Docs", icon: "api" },
  { id: "contact", label: "Contact", icon: "bell" },
];

export const PORTAL_ITEMS = [
  { id: "talent-dash", label: "Dashboard", icon: "grid" },
  { id: "talent-review", label: "Review", icon: "shield" },
  { id: "talent-earnings", label: "Earnings", icon: "chart" },
  { id: "talent-settings", label: "Settings", icon: "settings" },
];

export const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];
