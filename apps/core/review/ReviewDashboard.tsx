"use client";

import { useState, useTransition, type ReactNode } from "react";

import ProtectedShell from "@/src/next/ProtectedShell.jsx";
import { Spinner } from "@/src/components/feedback/LoadingState";
import { T, font } from "@/src/config/theme.js";
import { Btn, Icon, SectionTitle } from "@/src/components/ui.jsx";
import { useViewport } from "@/src/hooks/useViewport.js";
import { statusAccent, statusLabels } from "@/apps/core/workspace/constants";
import type {
  CareerEvent,
  FieldClaim,
  MediaEntry,
  PersonalHistorySection,
  ResearchProfile,
  StatEntry,
} from "@/apps/core/workspace/types";

import type {
  ReviewActionInput,
  ReviewAuditEvent,
  ReviewDashboardPayload,
  ReviewQueueItem,
} from "./types";

type ReviewActionMode = "editor_flag_issue" | "editor_request_changes";

interface ModalState {
  action: ReviewActionMode;
  profileId: string;
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString();
}

function actionLabel(action: ReviewAuditEvent["action"]) {
  switch (action) {
    case "submitted":
      return "Submitted";
    case "editor_approve":
      return "Editor Approved";
    case "editor_flag_issue":
      return "Issue Flagged";
    case "editor_request_changes":
      return "Changes Requested";
    case "editor_send_back":
      return "Sent Back";
    case "talent_approve":
      return "Talent Approved";
    case "talent_request_changes":
      return "Talent Requested Changes";
    case "publish":
      return "Published";
    default:
      return action;
  }
}

function getFieldCountLabel(fieldCount: number) {
  return `${fieldCount} field${fieldCount === 1 ? "" : "s"}`;
}

function CitationCard({
  claim,
}: {
  claim: FieldClaim<string>["claim"];
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, ${T.panel}, transparent), ${T.ink}`,
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: T.cyan,
          fontFamily: font.body,
        }}
      >
        Source Citation
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontSize: 13, color: T.paper, fontFamily: font.body }}>
          {claim.citation.publicationName || "No publication provided"}
        </div>
        <div style={{ fontSize: 12, color: T.mutedLight, fontFamily: font.body }}>
          {claim.citation.url || "No URL provided"}
        </div>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: font.body }}>
          {claim.citation.sourceType.replace("_", " ")} · Accessed {claim.citation.dateAccessed || "Unknown"} · Reliability {claim.reliabilityScore}/5
        </div>
      </div>
      {claim.notes ? (
        <div style={{ fontSize: 12, color: T.mutedLight, fontFamily: font.body }}>
          {claim.notes}
        </div>
      ) : null}
    </div>
  );
}

function ReviewFieldCard({
  children,
  claim,
  stacked,
  title,
}: {
  children: ReactNode;
  claim: FieldClaim<string>["claim"];
  stacked: boolean;
  title: string;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        border: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
        boxShadow: T.shadowSm,
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: T.muted,
          fontFamily: font.body,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: stacked ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(220px, 0.85fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 8, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: T.muted,
              fontFamily: font.body,
            }}
          >
            Content
          </div>
          {children}
        </div>
        <div style={{ minWidth: 0 }}>
          <CitationCard claim={claim} />
        </div>
      </div>
    </div>
  );
}

function renderFieldClaim(label: string, field: FieldClaim<string>, stacked: boolean) {
  return (
    <ReviewFieldCard key={label} title={label} claim={field.claim} stacked={stacked}>
      <div style={{ fontSize: 18, color: T.paper, fontFamily: font.display, fontWeight: 700 }}>
        {field.value || "Not provided"}
      </div>
    </ReviewFieldCard>
  );
}

function renderCareerItem(item: CareerEvent, stacked: boolean) {
  return (
    <ReviewFieldCard key={item.id} title={item.title} claim={item.claim} stacked={stacked}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, color: T.cyan, fontFamily: font.mono }}>{item.date}</div>
        <div style={{ fontSize: 14, color: T.paper, fontFamily: font.body }}>
          {item.description}
        </div>
      </div>
    </ReviewFieldCard>
  );
}

function renderPersonalHistoryItem(item: PersonalHistorySection, stacked: boolean) {
  return (
    <ReviewFieldCard key={item.id} title={item.heading} claim={item.claim} stacked={stacked}>
      <div style={{ fontSize: 14, color: T.paper, fontFamily: font.body, lineHeight: 1.6 }}>
        {item.body}
      </div>
    </ReviewFieldCard>
  );
}

function renderStatItem(item: StatEntry, stacked: boolean) {
  return (
    <ReviewFieldCard key={item.id} title={item.label} claim={item.claim} stacked={stacked}>
      <div style={{ fontSize: 18, color: T.paper, fontFamily: font.display, fontWeight: 700 }}>
        {item.value}
      </div>
    </ReviewFieldCard>
  );
}

function renderMediaItem(item: MediaEntry, stacked: boolean) {
  return (
    <ReviewFieldCard key={item.id} title={item.title} claim={item.claim} stacked={stacked}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 12, color: T.cyan, fontFamily: font.mono, textTransform: "uppercase" }}>
          {item.kind}
        </div>
        <div style={{ fontSize: 13, color: T.paper, fontFamily: font.body }}>
          {item.url}
        </div>
      </div>
    </ReviewFieldCard>
  );
}

function QueueItem({
  active,
  item,
  onSelect,
}: {
  active: boolean;
  item: ReviewQueueItem;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 16,
        border: `1px solid ${active ? T.cyanMid : T.border}`,
        background: active ? `linear-gradient(180deg, ${T.cyanDim}, ${T.panelStrong}), ${T.inkMid}` : `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
        textAlign: "left",
        cursor: "pointer",
        display: "grid",
        gap: 10,
        boxShadow: T.shadowSm,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, color: T.paper, fontFamily: font.display, fontWeight: 700 }}>
            {item.profileName}
          </div>
          <div style={{ fontSize: 12, color: T.mutedLight, fontFamily: font.body }}>
            {item.researcherName}
          </div>
        </div>
        <div
          style={{
            minHeight: T.controlSm,
            padding: "0 12px",
            borderRadius: 999,
            background: statusAccent[item.status],
            color: T.paper,
            fontSize: 11,
            fontFamily: font.body,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {statusLabels[item.status]}
        </div>
      </div>
      <div style={{ display: "grid", gap: 4, fontSize: 12, color: T.muted, fontFamily: font.body }}>
        <span>Submitted {formatTimestamp(item.submissionDate)}</span>
        <span>{getFieldCountLabel(item.fieldCount)}</span>
        <span>{item.completenessScore}% complete</span>
      </div>
    </button>
  );
}

function Modal({
  action,
  onCancel,
  onConfirm,
  pending,
}: {
  action: ReviewActionMode;
  onCancel: () => void;
  onConfirm: (comment: string) => void;
  pending: boolean;
}) {
  const [comment, setComment] = useState("");
  const title = action === "editor_flag_issue" ? "Flag Issue" : "Request Changes";
  const placeholder =
    action === "editor_flag_issue"
      ? "Describe the issue for the audit trail and follow-up review."
      : "Describe the fields that need revision and what evidence is missing.";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.62)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 24,
          borderRadius: 20,
          border: `1px solid ${T.border}`,
          background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
          boxShadow: T.shadow,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: T.cyan, fontFamily: font.body, marginBottom: 8 }}>
            Editorial Action
          </div>
          <h2 style={{ margin: 0, fontSize: 28, color: T.paper, fontFamily: font.display }}>
            {title}
          </h2>
        </div>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={6}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: `1px solid ${T.border}`,
            background: T.ink,
            color: T.paper,
            resize: "vertical",
            fontFamily: font.body,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 18,
          }}
        >
          <Btn variant="secondary" onClick={onCancel} small={false}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            onClick={() => onConfirm(comment)}
            disabled={pending || !comment.trim()}
            small={false}
          >
            {pending ? "Saving..." : title}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function ReviewDashboard({
  initialModalAction = null,
  initialPayload,
}: {
  initialModalAction?: ReviewActionMode | null;
  initialPayload: ReviewDashboardPayload;
}) {
  const { isMobile, isTablet } = useViewport();
  const [payload, setPayload] = useState(initialPayload);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState | null>(
    initialModalAction && initialPayload.selectedProfile
      ? {
          action: initialModalAction,
          profileId: initialPayload.selectedProfile.id,
        }
      : null,
  );
  const [isPending, startTransition] = useTransition();

  const selectedProfile = payload.selectedProfile;
  const selectedProfileId = selectedProfile?.id ?? payload.queue[0]?.profileId ?? null;

  function selectProfile(profileId: string) {
    const selected = payload.queue.find((item) => item.profileId === profileId);

    if (!selected) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/review?profileId=${profileId}`, {
        cache: "no-store",
      });
      const nextPayload = (await response.json()) as ReviewDashboardPayload | { error: string };

      if (!response.ok || "error" in nextPayload) {
        setError("Unable to load the selected profile.");
        return;
      }

      setError(null);
      setPayload(nextPayload);
    });
  }

  function submitAction(input: ReviewActionInput) {
    startTransition(async () => {
      setError(null);
      setNotice(null);

      const response = await fetch("/api/review/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const nextPayload = (await response.json()) as
        | (ReviewDashboardPayload & { emailTriggered?: boolean })
        | { error: string };

      if (!response.ok || "error" in nextPayload) {
        setError("error" in nextPayload ? nextPayload.error : "Unable to apply review action.");
        return;
      }

      setModalState(null);
      setPayload(nextPayload);
      if (
        (input.action === "editor_request_changes" || input.action === "editor_send_back") &&
        nextPayload.emailTriggered === false
      ) {
        setNotice("Review action saved, but researcher email notifications are not configured.");
        return;
      }

      setNotice(
        input.action === "editor_approve"
          ? "Profile approved and moved to talent review."
          : input.action === "editor_flag_issue"
            ? "Issue flagged and recorded in the audit trail."
            : input.action === "editor_request_changes" || input.action === "editor_send_back"
              ? "Changes requested from the researcher."
              : input.action === "publish"
                ? "Profile published."
                : "Review action saved.",
      );
    });
  }

  return (
    <ProtectedShell
      page="review"
      title="Review Queue Dashboard"
      subtitle="Manage researcher submissions, inspect every source citation, and move profiles through editorial review."
    >
      {error ? (
        <div
          style={{
            marginBottom: 18,
            padding: "16px",
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            background: T.orangeDim,
            color: T.paper,
            fontFamily: font.body,
            fontSize: 13,
            boxShadow: T.shadowSm,
          }}
        >
          {error}
        </div>
      ) : null}
      {notice ? (
        <div
          style={{
            marginBottom: 18,
            padding: "16px",
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            background: T.cyanDim,
            color: T.paper,
            fontFamily: font.body,
            fontSize: 13,
            boxShadow: T.shadowSm,
          }}
        >
          {notice}
        </div>
      ) : null}
      {isPending ? (
        <div
          style={{
            marginBottom: 18,
            padding: "12px 14px",
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            background: T.panel,
            color: T.mutedLight,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
          }}
        >
          <Spinner />
          Loading...
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet
            ? "minmax(0, 1fr)"
            : "320px minmax(0, 1.5fr) 320px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <section
          style={{
            padding: isMobile ? 16 : 24,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
            display: "grid",
            gap: 14,
            position: isTablet ? "static" : "sticky",
            top: 96,
            boxShadow: T.shadowSm,
          }}
        >
          <SectionTitle sub="Oldest submissions appear first." action={null}>
            Pending Queue
          </SectionTitle>
          {payload.queue.length ? (
            payload.queue.map((item) => (
              <QueueItem
                key={item.profileId}
                active={selectedProfileId === item.profileId}
                item={item}
                onSelect={() => selectProfile(item.profileId)}
              />
            ))
          ) : (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: `1px dashed ${T.border}`,
                color: T.mutedLight,
                fontFamily: font.body,
                fontSize: 13,
              }}
            >
              No reviews pending.
            </div>
          )}
        </section>

        <section
          style={{
            padding: isMobile ? 16 : 24,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
            display: "grid",
            gap: 18,
            boxShadow: T.shadowSm,
          }}
        >
          {selectedProfile ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.cyan,
                      fontFamily: font.body,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Selected Submission
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: isMobile ? 28 : 34,
                      color: T.paper,
                      fontFamily: font.display,
                    }}
                  >
                    {selectedProfile.name.value}
                  </h2>
                  <div style={{ marginTop: 8, fontSize: 13, color: T.mutedLight, fontFamily: font.body }}>
                    Researcher: {selectedProfile.researcherName ?? selectedProfile.researcherId}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn
                    variant="primary"
                    onClick={() =>
                      submitAction({ action: "editor_approve", profileId: selectedProfile.id })
                    }
                    disabled={isPending || selectedProfile.status !== "in_review"}
                    small={false}
                  >
                    <Icon name="check" size={16} color={T.ink} />
                    Approve
                  </Btn>
                  <Btn
                    variant="secondary"
                    onClick={() =>
                      setModalState({
                        action: "editor_request_changes",
                        profileId: selectedProfile.id,
                      })
                    }
                    disabled={isPending || selectedProfile.status !== "in_review"}
                    small={false}
                  >
                    Request Changes
                  </Btn>
                  <Btn
                    variant="orange"
                    onClick={() =>
                      setModalState({
                        action: "editor_flag_issue",
                        profileId: selectedProfile.id,
                      })
                    }
                    disabled={isPending || selectedProfile.status !== "in_review"}
                    small={false}
                  >
                    Flag Issue
                  </Btn>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {renderFieldClaim("Name", selectedProfile.name, isTablet)}
                {renderFieldClaim("Date of Birth", selectedProfile.dateOfBirth, isTablet)}

                <SectionTitle
                  sub="Each timeline event includes the original citation."
                  action={null}
                >
                  Career Timeline
                </SectionTitle>
                <div style={{ display: "grid", gap: 16 }}>
                  {selectedProfile.careerTimeline.map((item) => renderCareerItem(item, isTablet))}
                </div>

                <SectionTitle sub="Narrative sections with attached sourcing." action={null}>
                  Personal History
                </SectionTitle>
                <div style={{ display: "grid", gap: 16 }}>
                  {selectedProfile.personalHistory.map((item) => renderPersonalHistoryItem(item, isTablet))}
                </div>

                <SectionTitle sub="Structured stat blocks and evidence." action={null}>
                  Stats
                </SectionTitle>
                <div style={{ display: "grid", gap: 16 }}>
                  {selectedProfile.stats.map((item) => renderStatItem(item, isTablet))}
                </div>

                <SectionTitle
                  sub="Media references with attached source notes."
                  action={null}
                >
                  Media
                </SectionTitle>
                <div style={{ display: "grid", gap: 16 }}>
                  {selectedProfile.media.map((item) => renderMediaItem(item, isTablet))}
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                minHeight: 360,
                display: "grid",
                placeItems: "center",
                color: T.mutedLight,
                fontFamily: font.body,
                textAlign: "center",
              }}
            >
              Select a profile from the queue to inspect fields, citations, and decision history.
            </div>
          )}
        </section>

        <aside
          style={{
            padding: isMobile ? 16 : 24,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
            display: "grid",
            gap: 16,
            position: isTablet ? "static" : "sticky",
            top: 96,
            boxShadow: T.shadowSm,
          }}
        >
          <SectionTitle
            sub="Every state change is recorded with actor and timestamp."
            action={null}
          >
            Audit Trail
          </SectionTitle>
          {payload.auditTrail.length ? (
            <div style={{ display: "grid", gap: 14 }}>
              {payload.auditTrail.map((event) => (
                <div
                  key={event.id}
                  style={{
                    position: "relative",
                    paddingLeft: 18,
                    borderLeft: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -5,
                      top: 6,
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: T.cyan,
                    }}
                  />
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      background: `linear-gradient(180deg, ${T.panel}, transparent), ${T.ink}`,
                      border: `1px solid ${T.border}`,
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 12, color: T.cyan, fontFamily: font.body }}>
                      {actionLabel(event.action)}
                    </div>
                    <div style={{ fontSize: 13, color: T.paper, fontFamily: font.body }}>
                      {event.actorName} · {event.actorRole} · {event.actorUserId}
                    </div>
                    <div style={{ fontSize: 12, color: T.mutedLight, fontFamily: font.body }}>
                      {formatTimestamp(event.timestamp)} · {statusLabels[event.nextStatus]}
                    </div>
                    {event.comment ? (
                      <div style={{ fontSize: 12, color: T.mutedLight, fontFamily: font.body }}>
                        {event.comment}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: T.mutedLight, fontFamily: font.body }}>
              No audit trail is available for the selected profile yet.
            </div>
          )}
        </aside>
      </div>

      {modalState ? (
        <Modal
          action={modalState.action}
          pending={isPending}
          onCancel={() => setModalState(null)}
          onConfirm={(comment) =>
            submitAction({
              action: modalState.action,
              comment,
              profileId: modalState.profileId,
            })
          }
        />
      ) : null}
    </ProtectedShell>
  );
}
