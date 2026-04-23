import type {
  ClaimMeta,
  ProfileStatus,
  ReliabilityScore,
  ResearchProfile,
  ResearchPlanItem,
} from "./types";

export const reliabilityOptions: Array<{
  label: string;
  score: ReliabilityScore;
}> = [
  { score: 1, label: "Unverified" },
  { score: 2, label: "Low" },
  { score: 3, label: "Medium" },
  { score: 4, label: "High" },
  { score: 5, label: "Confirmed" },
];

export const statusLabels: Record<ProfileStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  needs_revision: "Needs Revision",
  talent_review: "Talent Review",
  talent_approved: "Talent Approved",
  published: "Published",
  archived: "Archived",
};

export const statusAccent: Record<ProfileStatus, string> = {
  draft: "rgba(0,183,241,0.18)",
  in_review: "rgba(255,185,92,0.18)",
  needs_revision: "rgba(255,122,104,0.18)",
  talent_review: "rgba(44,199,139,0.2)",
  talent_approved: "rgba(44,199,139,0.18)",
  published: "rgba(137,196,244,0.18)",
  archived: "rgba(137,143,153,0.18)",
};

export const lifecycleStates: ProfileStatus[] = [
  "draft",
  "in_review",
  "needs_revision",
  "talent_review",
  "talent_approved",
  "published",
  "archived",
];

export const researchModuleLabels = {
  biography: "Biography",
  career_timeline: "Career Timeline",
  statistics: "Statistics",
  brand_identity: "Brand Identity",
  approved_quotes: "Approved Quotes",
  media_assets: "Media Assets",
} as const;

export function createDefaultResearchPlan(researcherId = ""): ResearchPlanItem[] {
  return [
    {
      id: "plan-biography",
      module: "biography",
      priority: 1,
      owner: researcherId,
      sprintWindow: "Week 1",
      scope: "Life story, upbringing, personal history, and family background.",
      status: "in_progress",
    },
    {
      id: "plan-career",
      module: "career_timeline",
      priority: 2,
      owner: researcherId,
      sprintWindow: "Week 1-2",
      scope: "Career milestones, teams, contracts, achievements, and timeline checks.",
      status: "not_started",
    },
    {
      id: "plan-statistics",
      module: "statistics",
      priority: 3,
      owner: researcherId,
      sprintWindow: "Week 2",
      scope: "Performance data, records, rankings, accolades, and official stat references.",
      status: "not_started",
    },
  ];
}

export function createEmptyClaim(): ClaimMeta {
  return {
    claimText: "",
    citation: {
      url: "",
      publicationName: "",
      publicationDate: "",
      author: "",
      dateAccessed: "",
      sourceType: "secondary_reference",
    },
    additionalSources: [],
    reliabilityScore: 3,
    urlAccessibility: {
      isLive: false,
      lastCheckedAt: "",
    },
    researcherId: "",
    editorialApproval: {
      editorId: null,
      approvedAt: null,
    },
    talentApprovalStatus: "pending",
    talentApprovalDate: null,
    versionHistory: [],
    notes: "",
  };
}

function createFieldClaim(value = "", researcherId = "") {
  return {
    value,
    state: "draft" as const,
    claim: {
      ...createEmptyClaim(),
      researcherId,
    },
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createBlankProfile(
  researcherId: string,
  seed: { name: string; slug?: string },
): ResearchProfile {
  const slug = (seed.slug && slugify(seed.slug)) || slugify(seed.name) || `player-${Date.now()}`;
  const now = new Date().toISOString();

  return {
    id: slug,
    researcherId,
    researcherName: null,
    researcherEmail: null,
    name: createFieldClaim(seed.name, researcherId),
    legalName: createFieldClaim("", researcherId),
    aliases: createFieldClaim("", researcherId),
    dateOfBirth: createFieldClaim("", researcherId),
    placeOfBirth: createFieldClaim("", researcherId),
    nationality: createFieldClaim("", researcherId),
    heritage: createFieldClaim("", researcherId),
    heightWeight: createFieldClaim("", researcherId),
    profileImage: createFieldClaim("", researcherId),
    slug: createFieldClaim(slug, researcherId),
    biographyExcerpt: createFieldClaim("", researcherId),
    careerTimeline: [],
    personalHistory: [],
    stats: [],
    achievements: [],
    quotes: [],
    media: [],
    brandIdentity: {
      personalLogoUrl: createFieldClaim("", researcherId),
      digitalSignatureUrl: createFieldClaim("", researcherId),
      approvedColorPalette: createFieldClaim("", researcherId),
      brandGuidelinesUrl: createFieldClaim("", researcherId),
      approvedTaglines: createFieldClaim("", researcherId),
      merchandiseCategoriesApproved: createFieldClaim("", researcherId),
      nilAgreementReference: createFieldClaim("", researcherId),
    },
    sourceCandidates: [],
    researchPlan: createDefaultResearchPlan(researcherId),
    coverageGaps: [],
    workflowStep: "plan",
    sourceGateStatus: "not_started",
    status: "draft",
    submittedAt: null,
    updatedAt: now,
    lastSavedAt: null,
    changeDecisions: {},
  };
}

export function createSeedProfile(researcherId: string): ResearchProfile {
  return {
    id: "jason-kidd",
    researcherId,
    researcherName: "Marcus Proietti",
    researcherEmail: "researcher@ricon.local",
    name: {
      value: "Jason Kidd",
      state: "draft",
      claim: {
        claimText: "Jason Kidd is the canonical public name for this profile.",
        citation: {
          url: "https://www.nba.com/history/legends/profiles/jason-kidd",
          publicationName: "NBA.com",
          publicationDate: "",
          author: "",
          dateAccessed: "2026-04-03",
          sourceType: "official_record",
        },
        additionalSources: [
          {
            url: "https://www.basketball-reference.com/players/k/kiddja01.html",
            publicationName: "Basketball Reference",
            publicationDate: "",
            author: "",
            dateAccessed: "2026-04-03",
            sourceType: "official_record",
          },
        ],
        reliabilityScore: 5,
        urlAccessibility: {
          isLive: true,
          lastCheckedAt: "2026-04-03",
        },
        researcherId,
        editorialApproval: {
          editorId: null,
          approvedAt: null,
        },
        talentApprovalStatus: "pending",
        talentApprovalDate: null,
        versionHistory: [],
        notes: "Primary league profile with canonical spelling.",
      },
    },
    legalName: createFieldClaim("Jason Frederick Kidd", researcherId),
    aliases: createFieldClaim("J-Kidd", researcherId),
    dateOfBirth: {
      value: "1973-03-23",
      state: "draft",
      claim: {
        claimText: "Jason Kidd was born on March 23, 1973.",
        citation: {
          url: "https://www.britannica.com/biography/Jason-Kidd",
          publicationName: "Britannica",
          publicationDate: "",
          author: "",
          dateAccessed: "2026-04-03",
          sourceType: "secondary_reference",
        },
        additionalSources: [
          {
            url: "https://www.nba.com/player/467/jason-kidd",
            publicationName: "NBA.com Player Profile",
            publicationDate: "",
            author: "",
            dateAccessed: "2026-04-03",
            sourceType: "official_record",
          },
        ],
        reliabilityScore: 4,
        urlAccessibility: {
          isLive: true,
          lastCheckedAt: "2026-04-03",
        },
        researcherId,
        editorialApproval: {
          editorId: null,
          approvedAt: null,
        },
        talentApprovalStatus: "pending",
        talentApprovalDate: null,
        versionHistory: [],
        notes: "Cross-check against NBA profile before publish.",
      },
    },
    placeOfBirth: createFieldClaim("San Francisco, California, United States", researcherId),
    nationality: createFieldClaim("United States", researcherId),
    heritage: createFieldClaim("", researcherId),
    heightWeight: createFieldClaim("6 ft 4 in / 210 lb", researcherId),
    profileImage: createFieldClaim("https://cdn.nba.com/headshots/nba/latest/1040x760/467.png", researcherId),
    slug: createFieldClaim("jason-kidd", researcherId),
    biographyExcerpt: createFieldClaim(
      "Hall of Fame point guard, NBA champion, and championship coach with a verified playing and leadership record.",
      researcherId,
    ),
    careerTimeline: [
      {
        id: crypto.randomUUID(),
        title: "Drafted by the Dallas Mavericks",
        date: "1994-06-29",
        eventType: "draft",
        teamOrganization: "Dallas Mavericks",
        leagueCompetition: "NBA",
        description: "Selected second overall in the 1994 NBA Draft.",
        linkedMediaUrl: "",
        talentApproved: false,
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
      {
        id: crypto.randomUUID(),
        title: "Won NBA Championship",
        date: "2011-06-12",
        eventType: "award",
        teamOrganization: "Dallas Mavericks",
        leagueCompetition: "NBA",
        description: "Won an NBA title with the Dallas Mavericks.",
        linkedMediaUrl: "",
        talentApproved: false,
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
    ],
    personalHistory: [
      {
        id: crypto.randomUUID(),
        heading: "Oakland Roots",
        body: "Document early family background, youth programs, and high school career with verified citations.",
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
    ],
    stats: [
      {
        id: crypto.randomUUID(),
        sport: "basketball",
        label: "Career Assists",
        value: "12,091",
        category: "record",
        dataSource: "Basketball-Reference · Official NBA Records",
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
      {
        id: crypto.randomUUID(),
        sport: "basketball",
        label: "All-Star Selections",
        value: "10",
        category: "all_star",
        dataSource: "NBA.com",
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
    ],
    achievements: [
      {
        id: crypto.randomUUID(),
        awardName: "NBA Champion",
        awardingBody: "National Basketball Association",
        year: "2011",
        category: "championship",
        description: "Won with the Dallas Mavericks.",
        talentApproved: false,
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
    ],
    quotes: [
      {
        id: crypto.randomUUID(),
        quoteText: "",
        context: "",
        category: "career",
        talentApproved: false,
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
    ],
    media: [
      {
        id: crypto.randomUUID(),
        kind: "portrait",
        title: "Hall of Fame portrait reference",
        url: "https://images.unsplash.com/photo-1557467501-56d4f975dd58?w=1200&h=800&fit=crop&auto=format&q=80",
        usageRights: "Research reference only",
        talentApproved: false,
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
      {
        id: crypto.randomUUID(),
        kind: "video",
        title: "2011 Finals recap",
        url: "https://www.youtube.com/watch?v=example",
        usageRights: "Reference link",
        talentApproved: false,
        claim: { ...createEmptyClaim(), researcherId },
        state: "draft",
      },
    ],
    brandIdentity: {
      personalLogoUrl: createFieldClaim("", researcherId),
      digitalSignatureUrl: createFieldClaim("", researcherId),
      approvedColorPalette: createFieldClaim("", researcherId),
      brandGuidelinesUrl: createFieldClaim("", researcherId),
      approvedTaglines: createFieldClaim("", researcherId),
      merchandiseCategoriesApproved: createFieldClaim("", researcherId),
      nilAgreementReference: createFieldClaim("", researcherId),
    },
    sourceCandidates: [],
    researchPlan: createDefaultResearchPlan(researcherId),
    coverageGaps: [
      {
        id: "gap-early-life",
        module: "biography",
        description: "Document early family background, youth programs, and high school career with verified citations.",
        resolutionPath: "research",
        status: "open",
      },
    ],
    workflowStep: "sources",
    sourceGateStatus: "needs_review",
    status: "draft",
    submittedAt: null,
    updatedAt: new Date().toISOString(),
    lastSavedAt: null,
    changeDecisions: {},
  };
}
