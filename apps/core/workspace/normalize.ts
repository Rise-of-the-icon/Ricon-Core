import type {
  CareerEvent,
  CitationInput,
  ClaimMeta,
  FieldClaim,
  MediaEntry,
  PersonalHistorySection,
  ProfileStatus,
  QuoteEntry,
  ResearchProfile,
  ReliabilityScore,
  StatEntry,
  AchievementEntry,
  ChangeDecisionRecord,
  CoverageGap,
  ResearchModule,
  ResearchPlanItem,
  SourceCandidate,
  SourceCandidateProvider,
  SourceCandidateStatus,
  SourceGateStatus,
  WorkflowStep,
} from "./types";
import { createDefaultResearchPlan } from "./constants";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asReliabilityScore(value: unknown): ReliabilityScore {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 ? value : 3;
}

function normalizeCitation(value: unknown): CitationInput {
  const citation = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  let sourceType: CitationInput["sourceType"] = "secondary_reference";

  if (
    citation.sourceType === "primary" ||
    citation.sourceType === "credentialed_journalism" ||
    citation.sourceType === "official_record" ||
    citation.sourceType === "secondary_reference"
  ) {
    sourceType = citation.sourceType;
  } else if (citation.sourceType === "article" || citation.sourceType === "interview") {
    sourceType = "credentialed_journalism";
  }

  return {
    dateAccessed: asString(citation.dateAccessed),
    publicationDate: asString(citation.publicationDate),
    author: asString(citation.author),
    publicationName: asString(citation.publicationName),
    url: asString(citation.url),
    sourceType,
  };
}

function normalizeClaim(value: unknown): ClaimMeta {
  const claim = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    claimText: asString(claim.claimText),
    citation: normalizeCitation(claim.citation),
    additionalSources: asArray(claim.additionalSources).map(normalizeCitation),
    notes: asString(claim.notes),
    reliabilityScore: asReliabilityScore(claim.reliabilityScore),
    urlAccessibility: {
      isLive:
        typeof (claim.urlAccessibility as Record<string, unknown> | undefined)?.isLive === "boolean"
          ? Boolean((claim.urlAccessibility as Record<string, unknown>).isLive)
          : false,
      lastCheckedAt: asString((claim.urlAccessibility as Record<string, unknown> | undefined)?.lastCheckedAt),
    },
    researcherId: asString(claim.researcherId),
    editorialApproval: {
      editorId: asNullableString((claim.editorialApproval as Record<string, unknown> | undefined)?.editorId),
      approvedAt: asNullableString((claim.editorialApproval as Record<string, unknown> | undefined)?.approvedAt),
    },
    talentApprovalStatus:
      claim.talentApprovalStatus === "approved" || claim.talentApprovalStatus === "flagged"
        ? claim.talentApprovalStatus
        : "pending",
    talentApprovalDate: asNullableString(claim.talentApprovalDate),
    versionHistory: asArray(claim.versionHistory).map((entry) => {
      const record = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
      return {
        actorId: asString(record.actorId),
        changedAt: asString(record.changedAt),
        summary: asString(record.summary),
      };
    }),
  };
}

function normalizeFieldClaim(value: unknown): FieldClaim<string> {
  const field = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    claim: normalizeClaim(field.claim),
    state: normalizeProfileStatus(field.state),
    value: asString(field.value),
  };
}

function normalizeCareerItem(value: unknown, index: number): CareerEvent {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const eventType = [
    "draft",
    "signing",
    "trade",
    "retirement",
    "award",
    "record",
    "milestone",
    "team-change",
    "injury",
    "return",
  ].includes(asString(item.eventType))
    ? (item.eventType as CareerEvent["eventType"])
    : "milestone";

  return {
    claim: normalizeClaim(item.claim),
    date: asString(item.date),
    description: asString(item.description),
    eventType,
    id: asString(item.id, `career-${index}`),
    leagueCompetition: asString(item.leagueCompetition),
    linkedMediaUrl: asString(item.linkedMediaUrl),
    state: normalizeProfileStatus(item.state),
    talentApproved: Boolean(item.talentApproved),
    teamOrganization: asString(item.teamOrganization),
    title: asString(item.title),
  };
}

function normalizePersonalHistoryItem(
  value: unknown,
  index: number,
): PersonalHistorySection {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    body: asString(item.body),
    claim: normalizeClaim(item.claim),
    heading: asString(item.heading),
    id: asString(item.id, `history-${index}`),
    state: normalizeProfileStatus(item.state),
  };
}

function normalizeStatItem(value: unknown, index: number): StatEntry {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const sport = ["basketball", "football", "baseball", "music", "other"].includes(asString(item.sport))
    ? (item.sport as StatEntry["sport"])
    : "basketball";
  const category = [
    "career_average",
    "season",
    "postseason",
    "record",
    "all_star",
    "championship",
    "award",
  ].includes(asString(item.category))
    ? (item.category as StatEntry["category"])
    : "career_average";

  return {
    category,
    claim: normalizeClaim(item.claim),
    dataSource: asString(item.dataSource),
    id: asString(item.id, `stat-${index}`),
    label: asString(item.label),
    sport,
    state: normalizeProfileStatus(item.state),
    value: asString(item.value),
  };
}

function normalizeMediaItem(value: unknown, index: number): MediaEntry {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const kind = ["portrait", "action_shot", "milestone_photo", "video", "voice_sample"].includes(asString(item.kind))
    ? (item.kind as MediaEntry["kind"])
    : "portrait";

  return {
    claim: normalizeClaim(item.claim),
    id: asString(item.id, `media-${index}`),
    kind,
    state: normalizeProfileStatus(item.state),
    talentApproved: Boolean(item.talentApproved),
    title: asString(item.title),
    usageRights: asString(item.usageRights),
    url: asString(item.url),
  };
}

function normalizeAchievementItem(value: unknown, index: number): AchievementEntry {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const category = [
    "mvp",
    "championship",
    "all-star",
    "hall-of-fame",
    "record",
    "community",
    "other",
  ].includes(asString(item.category))
    ? (item.category as AchievementEntry["category"])
    : "other";

  return {
    awardName: asString(item.awardName),
    awardingBody: asString(item.awardingBody),
    category,
    claim: normalizeClaim(item.claim),
    description: asString(item.description),
    id: asString(item.id, `achievement-${index}`),
    state: normalizeProfileStatus(item.state),
    talentApproved: Boolean(item.talentApproved),
    year: asString(item.year),
  };
}

function normalizeQuoteItem(value: unknown, index: number): QuoteEntry {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const category = ["career", "philosophy", "game", "personal", "drop-context"].includes(asString(item.category))
    ? (item.category as QuoteEntry["category"])
    : "career";

  return {
    category,
    claim: normalizeClaim(item.claim),
    context: asString(item.context),
    id: asString(item.id, `quote-${index}`),
    quoteText: asString(item.quoteText),
    state: normalizeProfileStatus(item.state),
    talentApproved: Boolean(item.talentApproved),
  };
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeResearchModule(value: unknown): ResearchModule {
  if (
    value === "career_timeline" ||
    value === "statistics" ||
    value === "brand_identity" ||
    value === "approved_quotes" ||
    value === "media_assets"
  ) {
    return value;
  }

  return "biography";
}

function normalizeWorkflowStep(value: unknown): WorkflowStep {
  if (
    value === "plan" ||
    value === "sources" ||
    value === "research" ||
    value === "draft" ||
    value === "qa" ||
    value === "review_package"
  ) {
    return value;
  }

  return "sources";
}

function normalizeSourceGateStatus(value: unknown): SourceGateStatus {
  if (value === "needs_review" || value === "approved" || value === "blocked") {
    return value;
  }

  return "not_started";
}

function normalizeSourceCandidateProvider(value: unknown): SourceCandidateProvider {
  if (value === "balldontlie" || value === "wikipedia") {
    return value;
  }

  return "manual";
}

function normalizeSourceCandidateStatus(value: unknown): SourceCandidateStatus {
  if (value === "approved_for_manual_citation" || value === "blocked_for_claims") {
    return value;
  }

  return "needs_review";
}

export function normalizeSourceCandidate(value: unknown, index = 0): SourceCandidate {
  const candidate = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const metadata = candidate.metadata && typeof candidate.metadata === "object"
    ? (candidate.metadata as Record<string, unknown>)
    : {};

  return {
    id: asString(candidate.id, `source-candidate-${index}`),
    provider: normalizeSourceCandidateProvider(candidate.provider),
    title: asString(candidate.title),
    url: asString(candidate.url),
    publicationName: asString(candidate.publicationName),
    fetchedAt: asString(candidate.fetchedAt, new Date(0).toISOString()),
    suggestedModule: normalizeResearchModule(candidate.suggestedModule),
    status: normalizeSourceCandidateStatus(candidate.status),
    warning: asNullableString(candidate.warning),
    notes: asString(candidate.notes),
    metadata: Object.fromEntries(
      Object.entries(metadata).filter((entry): entry is [string, string | number | boolean | null] => {
        const value = entry[1];
        return (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value === null
        );
      }),
    ),
  };
}

function normalizeResearchPlanItem(value: unknown, index: number): ResearchPlanItem {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const status =
    item.status === "in_progress" || item.status === "blocked" || item.status === "ready_for_qa"
      ? item.status
      : "not_started";

  return {
    id: asString(item.id, `research-plan-${index}`),
    module: normalizeResearchModule(item.module),
    priority: typeof item.priority === "number" ? item.priority : index + 1,
    owner: asString(item.owner),
    sprintWindow: asString(item.sprintWindow),
    scope: asString(item.scope),
    status,
  };
}

function normalizeCoverageGap(value: unknown, index: number): CoverageGap {
  const item = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const resolutionPath =
    item.resolutionPath === "talent_input" || item.resolutionPath === "conflict_resolution"
      ? item.resolutionPath
      : "research";
  const status = item.status === "in_progress" || item.status === "resolved" ? item.status : "open";

  return {
    id: asString(item.id, `coverage-gap-${index}`),
    module: normalizeResearchModule(item.module),
    description: asString(item.description),
    resolutionPath,
    status,
  };
}

function normalizeProfileStatus(value: unknown): ProfileStatus {
  if (
    value === "in_review" ||
    value === "needs_revision" ||
    value === "talent_review" ||
    value === "talent_approved" ||
    value === "published" ||
    value === "archived"
  ) {
    return value;
  }

  if (value === "approved" || value === "talent_approved") {
    return "talent_approved";
  }

  return "draft";
}

function normalizeChangeDecisionRecord(value: unknown): ChangeDecisionRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const status =
    record.status === "accepted" || record.status === "rejected" || record.status === "pending"
      ? record.status
      : "pending";
  const role = record.role === "editor" || record.role === "talent" ? record.role : "researcher";

  return {
    status,
    role,
    changedAt: asString(record.changedAt, new Date(0).toISOString()),
    changedBy: asString(record.changedBy),
  };
}

function normalizeChangeDecisions(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  const decisions = value as Record<string, unknown>;
  const normalized: Record<string, ChangeDecisionRecord> = {};

  for (const [key, decision] of Object.entries(decisions)) {
    const normalizedDecision = normalizeChangeDecisionRecord(decision);
    if (normalizedDecision) {
      normalized[key] = normalizedDecision;
    }
  }

  return normalized;
}

export function normalizeResearchProfile(value: unknown): ResearchProfile | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const profile = value as Record<string, unknown>;
  const researcherId = asString(profile.researcherId);
  const researchPlan = asArray(profile.researchPlan).map(normalizeResearchPlanItem);

  return {
    achievements: asArray(profile.achievements).map(normalizeAchievementItem),
    aliases: normalizeFieldClaim(profile.aliases),
    biographyExcerpt: normalizeFieldClaim(profile.biographyExcerpt),
    brandIdentity: {
      approvedColorPalette: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.approvedColorPalette),
      approvedTaglines: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.approvedTaglines),
      brandGuidelinesUrl: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.brandGuidelinesUrl),
      digitalSignatureUrl: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.digitalSignatureUrl),
      merchandiseCategoriesApproved: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.merchandiseCategoriesApproved),
      nilAgreementReference: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.nilAgreementReference),
      personalLogoUrl: normalizeFieldClaim((profile.brandIdentity as Record<string, unknown> | undefined)?.personalLogoUrl),
    },
    careerTimeline: asArray(profile.careerTimeline).map(normalizeCareerItem),
    dateOfBirth: normalizeFieldClaim(profile.dateOfBirth),
    heightWeight: normalizeFieldClaim(profile.heightWeight),
    heritage: normalizeFieldClaim(profile.heritage),
    id: asString(profile.id),
    legalName: normalizeFieldClaim(profile.legalName),
    media: asArray(profile.media).map(normalizeMediaItem),
    name: normalizeFieldClaim(profile.name),
    nationality: normalizeFieldClaim(profile.nationality),
    personalHistory: asArray(profile.personalHistory).map(normalizePersonalHistoryItem),
    placeOfBirth: normalizeFieldClaim(profile.placeOfBirth),
    profileImage: normalizeFieldClaim(profile.profileImage),
    quotes: asArray(profile.quotes).map(normalizeQuoteItem),
    researcherEmail: asNullableString(profile.researcherEmail),
    researcherId,
    researcherName: asNullableString(profile.researcherName),
    slug: normalizeFieldClaim(profile.slug),
    stats: asArray(profile.stats).map(normalizeStatItem),
    status: normalizeProfileStatus(profile.status),
    sourceCandidates: asArray(profile.sourceCandidates).map(normalizeSourceCandidate),
    researchPlan: researchPlan.length > 0 ? researchPlan : createDefaultResearchPlan(researcherId),
    coverageGaps: asArray(profile.coverageGaps).map(normalizeCoverageGap),
    workflowStep: normalizeWorkflowStep(profile.workflowStep),
    sourceGateStatus: normalizeSourceGateStatus(profile.sourceGateStatus),
    submittedAt: asNullableString(profile.submittedAt),
    updatedAt: asString(profile.updatedAt, new Date(0).toISOString()),
    lastSavedAt: asNullableString(profile.lastSavedAt),
    changeDecisions: normalizeChangeDecisions(profile.changeDecisions),
  };
}
