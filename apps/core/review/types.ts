import type { ProfileStatus, ResearchProfile } from "@/apps/core/workspace/types";

export type ReviewAction =
  | "submitted"
  | "editor_approve"
  | "editor_flag_issue"
  | "editor_request_changes"
  | "editor_send_back"
  | "talent_approve"
  | "talent_request_changes"
  | "publish";

export interface ReviewQueueItem {
  profileId: string;
  profileName: string;
  researcherId: string;
  researcherName: string;
  researcherEmail: string | null;
  submissionDate: string;
  fieldCount: number;
  completenessScore: number;
  status: ProfileStatus;
}

export interface ReviewAuditEvent {
  id: string;
  profileId: string;
  researcherId: string;
  actorUserId: string;
  actorName: string;
  actorRole: string;
  action: ReviewAction | string;
  timestamp: string;
  comment: string | null;
  nextStatus: ProfileStatus;
}

export interface ReviewDashboardPayload {
  auditTrail: ReviewAuditEvent[];
  emailNotificationEnabled: boolean;
  persistenceMode: "mock" | "live";
  queue: ReviewQueueItem[];
  selectedProfile: ResearchProfile | null;
}

export interface ReviewActionInput {
  action: Exclude<ReviewAction, "submitted">;
  comment?: string | null;
  profileId: string;
}

export interface ReviewChangeDecisionInput {
  decision: "accepted" | "rejected";
  fieldId: string;
  profileId: string;
}
