export type ReliabilityScore = 1 | 2 | 3 | 4 | 5;

export type ProfileStatus =
  | "draft"
  | "in_review"
  | "needs_revision"
  | "talent_review"
  | "talent_approved"
  | "published"
  | "archived";

export type ChangeDecisionStatus = "pending" | "accepted" | "rejected";

export type WorkflowStep =
  | "plan"
  | "sources"
  | "research"
  | "draft"
  | "qa"
  | "review_package";

export type SourceGateStatus = "not_started" | "needs_review" | "approved" | "blocked";

export type SourceCandidateProvider = "manual" | "balldontlie" | "wikipedia";

export type SourceCandidateStatus =
  | "needs_review"
  | "approved_for_manual_citation"
  | "blocked_for_claims";

export type ResearchModule =
  | "biography"
  | "career_timeline"
  | "statistics"
  | "brand_identity"
  | "approved_quotes"
  | "media_assets";

export interface SourceCandidate {
  id: string;
  provider: SourceCandidateProvider;
  title: string;
  url: string;
  publicationName: string;
  fetchedAt: string;
  suggestedModule: ResearchModule;
  status: SourceCandidateStatus;
  warning: string | null;
  notes: string;
  metadata: Record<string, string | number | boolean | null>;
}

export interface ResearchPlanItem {
  id: string;
  module: ResearchModule;
  priority: number;
  owner: string;
  sprintWindow: string;
  scope: string;
  status: "not_started" | "in_progress" | "blocked" | "ready_for_qa";
}

export interface CoverageGap {
  id: string;
  module: ResearchModule;
  description: string;
  resolutionPath: "research" | "talent_input" | "conflict_resolution";
  status: "open" | "in_progress" | "resolved";
}

export interface ChangeDecisionRecord {
  changedAt: string;
  changedBy: string;
  role: "researcher" | "editor" | "talent";
  status: ChangeDecisionStatus;
}

export interface CitationInput {
  url: string;
  publicationName: string;
  publicationDate: string;
  author: string;
  dateAccessed: string;
  sourceType:
    | "primary"
    | "credentialed_journalism"
    | "official_record"
    | "secondary_reference";
}

export interface ClaimMeta {
  claimText: string;
  citation: CitationInput;
  additionalSources: CitationInput[];
  reliabilityScore: ReliabilityScore;
  urlAccessibility: {
    isLive: boolean;
    lastCheckedAt: string;
  };
  researcherId: string;
  editorialApproval: {
    editorId: string | null;
    approvedAt: string | null;
  };
  talentApprovalStatus: "approved" | "flagged" | "pending";
  talentApprovalDate: string | null;
  versionHistory: Array<{
    actorId: string;
    changedAt: string;
    summary: string;
  }>;
  notes: string;
}

export interface FieldClaim<T> {
  value: T;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface CareerEvent {
  id: string;
  title: string;
  date: string;
  eventType:
    | "draft"
    | "signing"
    | "trade"
    | "retirement"
    | "award"
    | "record"
    | "milestone"
    | "team-change"
    | "injury"
    | "return";
  teamOrganization: string;
  leagueCompetition: string;
  description: string;
  linkedMediaUrl: string;
  talentApproved: boolean;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface PersonalHistorySection {
  id: string;
  heading: string;
  body: string;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface StatEntry {
  id: string;
  sport: "basketball" | "football" | "baseball" | "music" | "other";
  label: string;
  value: string;
  category:
    | "career_average"
    | "season"
    | "postseason"
    | "record"
    | "all_star"
    | "championship"
    | "award";
  dataSource: string;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface MediaEntry {
  id: string;
  kind: "portrait" | "action_shot" | "milestone_photo" | "video" | "voice_sample";
  title: string;
  url: string;
  usageRights: string;
  talentApproved: boolean;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface AchievementEntry {
  id: string;
  awardName: string;
  awardingBody: string;
  year: string;
  category:
    | "mvp"
    | "championship"
    | "all-star"
    | "hall-of-fame"
    | "record"
    | "community"
    | "other";
  description: string;
  talentApproved: boolean;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface QuoteEntry {
  id: string;
  quoteText: string;
  context: string;
  category: "career" | "philosophy" | "game" | "personal" | "drop-context";
  talentApproved: boolean;
  claim: ClaimMeta;
  state: ProfileStatus;
}

export interface ResearchProfile {
  id: string;
  researcherId: string;
  researcherName: string | null;
  researcherEmail: string | null;
  name: FieldClaim<string>;
  legalName: FieldClaim<string>;
  aliases: FieldClaim<string>;
  dateOfBirth: FieldClaim<string>;
  placeOfBirth: FieldClaim<string>;
  nationality: FieldClaim<string>;
  heritage: FieldClaim<string>;
  heightWeight: FieldClaim<string>;
  profileImage: FieldClaim<string>;
  slug: FieldClaim<string>;
  biographyExcerpt: FieldClaim<string>;
  careerTimeline: CareerEvent[];
  personalHistory: PersonalHistorySection[];
  stats: StatEntry[];
  achievements: AchievementEntry[];
  quotes: QuoteEntry[];
  media: MediaEntry[];
  brandIdentity: {
    personalLogoUrl: FieldClaim<string>;
    digitalSignatureUrl: FieldClaim<string>;
    approvedColorPalette: FieldClaim<string>;
    brandGuidelinesUrl: FieldClaim<string>;
    approvedTaglines: FieldClaim<string>;
    merchandiseCategoriesApproved: FieldClaim<string>;
    nilAgreementReference: FieldClaim<string>;
  };
  status: ProfileStatus;
  sourceCandidates: SourceCandidate[];
  researchPlan: ResearchPlanItem[];
  coverageGaps: CoverageGap[];
  workflowStep: WorkflowStep;
  sourceGateStatus: SourceGateStatus;
  submittedAt: string | null;
  updatedAt: string;
  lastSavedAt: string | null;
  changeDecisions: Record<string, ChangeDecisionRecord>;
}

export interface RevisionRecord {
  id: string;
  profileId: string;
  researcherId: string;
  savedAt: string;
  status: ProfileStatus;
  summary: string;
}

export interface WorkspacePayload {
  profile: ResearchProfile;
  revisions: RevisionRecord[];
  persistenceMode: "mock" | "live";
  emailNotificationEnabled: boolean;
}
