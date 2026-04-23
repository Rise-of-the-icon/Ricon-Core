"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/apps/core/auth/client";
import ProtectedShell from "@/src/next/ProtectedShell.jsx";
import { T, font } from "@/src/config/theme.js";
import { useViewport } from "@/src/hooks/useViewport.js";

import { createEmptyClaim, statusAccent, statusLabels } from "./constants";
import IdentityStep from "./IdentityStep";
import { validateProfileVerification } from "./verification";
import type {
  AchievementEntry,
  CareerEvent,
  ClaimMeta,
  FieldClaim,
  MediaEntry,
  ResearchProfile,
  StatEntry,
  WorkspacePayload,
} from "./types";

/* ------------------------------------------------------------------
 * Ricon Core — Talent Onboarding (internal researcher view)
 * A single-researcher flow for bringing a new NBA player into Ricon.
 * Identity → Career → Stats → Media → Review.
 * ------------------------------------------------------------------ */

export type OnboardingStep = "identity" | "career" | "stats" | "media" | "review";

const STEPS: { id: OnboardingStep; label: string; hint: string }[] = [
  { id: "identity", label: "Identity",  hint: "Who is the player" },
  { id: "career",   label: "Career",    hint: "Teams and milestones" },
  { id: "stats",    label: "Stats",     hint: "Numbers and honors" },
  { id: "media",    label: "Media",     hint: "Photos and assets" },
  { id: "review",   label: "Review",    hint: "Verify and submit" },
];

const reset: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: "none",
  background: "none",
  font: "inherit",
};

/* ------------------------------- atoms --------------------------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: T.paper, fontFamily: font.body, fontSize: 12, fontWeight: 600 }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: T.ink,
          color: T.paper,
          fontFamily: font.body,
          fontSize: 14,
        }}
      />
      {hint ? (
        <span style={{ color: T.muted, fontSize: 11, fontFamily: font.body }}>{hint}</span>
      ) : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: T.paper, fontFamily: font.body, fontSize: 12, fontWeight: 600 }}>
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: T.ink,
          color: T.paper,
          fontFamily: font.body,
          fontSize: 14,
          resize: "vertical",
        }}
      />
    </label>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[] | { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const items = (options as Array<T | { value: T; label: string }>).map((o) =>
    typeof o === "string" ? { value: o as T, label: o as unknown as string } : o,
  );
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ color: T.paper, fontFamily: font.body, fontSize: 12, fontWeight: 600 }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: T.ink,
          color: T.paper,
          fontFamily: font.body,
          fontSize: 14,
        }}
      >
        {items.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Card({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 24,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel})`,
        boxShadow: T.shadowSm,
      }}
    >
      <header style={{ marginBottom: 18 }}>
        <h2
          style={{
            fontSize: 20,
            lineHeight: 1.1,
            fontWeight: 700,
            color: T.paper,
            fontFamily: font.display,
            marginBottom: subtitle ? 6 : 0,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p style={{ color: T.mutedLight, fontFamily: font.body, fontSize: 13 }}>{subtitle}</p>
        ) : null}
      </header>
      <div style={{ display: "grid", gap: 18 }}>{children}</div>
      {footer}
    </section>
  );
}

function SourceInput({
  claim,
  onChange,
  required,
}: {
  claim: ClaimMeta;
  onChange: (c: ClaimMeta) => void;
  required?: boolean;
}) {
  const hasUrl = claim.citation.url.trim().length > 0;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 10,
        alignItems: "end",
        padding: 12,
        borderRadius: 12,
        background: "rgba(0,0,0,0.25)",
        border: `1px solid ${hasUrl ? T.border : required ? T.orange : T.borderLight}`,
      }}
    >
      <Field
        label={required ? "Source link (required)" : "Source link"}
        placeholder="https://…"
        value={claim.citation.url}
        onChange={(v) =>
          onChange({
            ...claim,
            citation: {
              ...claim.citation,
              url: v,
              dateAccessed: v ? new Date().toISOString().slice(0, 10) : "",
            },
            additionalSources:
              v && claim.additionalSources.length === 0
                ? [
                    {
                      url: v,
                      publicationName: "",
                      publicationDate: "",
                      author: "",
                      dateAccessed: new Date().toISOString().slice(0, 10),
                      sourceType: "secondary_reference",
                    },
                  ]
                : claim.additionalSources,
          })
        }
      />
      <span
        title={hasUrl ? "Source attached" : "Add a primary source"}
        style={{
          alignSelf: "center",
          minHeight: 32,
          padding: "0 10px",
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          background: hasUrl ? "rgba(44,199,139,0.16)" : "rgba(255,122,104,0.12)",
          color: hasUrl ? T.green : T.orange,
          fontSize: 11,
          fontFamily: font.body,
          whiteSpace: "nowrap",
        }}
      >
        {hasUrl ? "● Verified" : "○ Needs source"}
      </span>
    </div>
  );
}

function FieldWithSource({
  label,
  field,
  onChange,
  type,
  placeholder,
  hint,
}: {
  label: string;
  field: FieldClaim<string>;
  onChange: (next: FieldClaim<string>) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Field
        label={label}
        type={type}
        placeholder={placeholder}
        hint={hint}
        value={field.value}
        onChange={(value) => onChange({ ...field, value })}
      />
      <SourceInput
        claim={field.claim}
        onChange={(claim) => onChange({ ...field, claim })}
      />
    </div>
  );
}

function RowCard({
  children,
  onRemove,
  removeLabel,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        background: T.ink,
        display: "grid",
        gap: 14,
        position: "relative",
      }}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          style={{
            ...reset,
            justifySelf: "start",
            color: T.mutedLight,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {removeLabel ?? "Remove"}
        </button>
      ) : null}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...reset,
        justifySelf: "start",
        minHeight: 42,
        padding: "0 18px",
        borderRadius: 12,
        background: T.cyanDim,
        color: T.paper,
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      + {label}
    </button>
  );
}

function isUploadedAssetUrl(url: string) {
  return url.startsWith("data:image/") || url.startsWith("data:video/");
}

function MediaAssetSourceField({
  media,
  onChange,
}: {
  media: MediaEntry;
  onChange: (next: MediaEntry) => void;
}) {
  const hasUploadedFile = isUploadedAssetUrl(media.url);

  function handleFile(file: File | null, input: HTMLInputElement) {
    if (!file) {
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      onChange({
        ...media,
        kind: isVideo ? "video" : media.kind === "video" || media.kind === "voice_sample" ? "portrait" : media.kind,
        title: media.title || file.name.replace(/\.[^.]+$/, ""),
        url: result,
        usageRights: media.usageRights || "Uploaded by onboarding user; rights pending verification",
      });
      input.value = "";
    };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <span style={{ color: T.paper, fontFamily: font.body, fontSize: 12, fontWeight: 600 }}>
        Asset source
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ color: T.mutedLight, fontSize: 11, fontFamily: font.body }}>
            Paste URL
          </span>
          <input
            type="url"
            placeholder="https://..."
            value={hasUploadedFile ? "" : media.url}
            onChange={(event) => onChange({ ...media, url: event.target.value })}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              background: T.ink,
              color: T.paper,
              fontFamily: font.body,
              fontSize: 14,
            }}
          />
        </label>
        <label
          style={{
            display: "grid",
            gap: 6,
            minHeight: 70,
            padding: "10px 12px",
            borderRadius: 12,
            border: `1px dashed ${T.borderLight}`,
            background: "rgba(255,255,255,0.035)",
            cursor: "pointer",
          }}
        >
          <span style={{ color: T.mutedLight, fontSize: 11, fontFamily: font.body }}>
            Upload photo/video
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null, event.currentTarget)}
            style={{
              color: T.mutedLight,
              fontFamily: font.body,
              fontSize: 12,
              maxWidth: "100%",
            }}
          />
        </label>
      </div>
      <span style={{ color: hasUploadedFile ? T.green : T.muted, fontSize: 11, fontFamily: font.body }}>
        {hasUploadedFile
          ? `Uploaded ${media.kind === "video" ? "video" : "photo"} attached. Paste a URL to replace it.`
          : "Use either a hosted link or upload a local photo/video file."}
      </span>
    </div>
  );
}

/* ---------------------------- stepper ---------------------------- */

function Stepper({
  active,
  onChange,
  completion,
  isMobile,
}: {
  active: OnboardingStep;
  onChange: (s: OnboardingStep) => void;
  completion: Record<OnboardingStep, { done: number; total: number }>;
  isMobile: boolean;
}) {
  const activeIndex = STEPS.findIndex((s) => s.id === active);
  return (
    <nav
      aria-label="Onboarding steps"
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : `repeat(${STEPS.length}, minmax(0, 1fr))`,
        gap: 8,
        padding: 10,
        borderRadius: 16,
        background: T.card,
        border: `1px solid ${T.borderLight}`,
      }}
    >
      {STEPS.map((step, i) => {
        const isActive = step.id === active;
        const isPast = i < activeIndex;
        const c = completion[step.id];
        const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onChange(step.id)}
            aria-current={isActive ? "step" : undefined}
            style={{
              ...reset,
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: 12,
              background: isActive ? "rgba(107,92,255,0.18)" : "transparent",
              border: `1px solid ${isActive ? T.brandPrimary : "transparent"}`,
              color: T.paper,
              cursor: "pointer",
              display: "grid",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: isActive ? "#dbd6ff" : isPast ? T.green : T.mutedLight,
                fontFamily: font.mono,
                fontSize: 11,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isPast ? "rgba(44,199,139,0.2)" : "rgba(255,255,255,0.06)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {isPast ? "✓" : i + 1}
              </span>
              {step.hint}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{step.label}</div>
            <div
              style={{
                height: 3,
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: pct === 100 ? T.green : T.brandPrimary,
                  transition: "width 200ms ease",
                }}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}

/* --------------------------- validators -------------------------- */

function countField(f: FieldClaim<string>) {
  const done = Boolean(f.value.trim());
  const sourced = Boolean(f.claim.citation.url.trim());
  return { done, sourced };
}

/* --------------------------- main page --------------------------- */

interface Props {
  initialPayload: WorkspacePayload;
  initialStep?: OnboardingStep;
}

export default function ResearchWorkspace({ initialPayload, initialStep = "identity" }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { isMobile, isTablet } = useViewport();
  const [profile, setProfile] = useState<ResearchProfile>(initialPayload.profile);
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "warn"; text: string } | null>(null);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const verification = useMemo(() => validateProfileVerification(profile), [profile]);

  const completion = useMemo(() => {
    const identityFields = [
      profile.name,
      profile.dateOfBirth,
      profile.placeOfBirth,
      profile.nationality,
      profile.heightWeight,
      profile.profileImage,
      profile.biographyExcerpt,
    ];
    const idDone = identityFields.filter((f) => countField(f).done).length;
    return {
      identity: { done: idDone, total: identityFields.length },
      career: {
        done: profile.careerTimeline.filter((e) => e.title && e.date).length,
        total: Math.max(profile.careerTimeline.length, 1),
      },
      stats: {
        done: profile.stats.filter((s) => s.label && s.value).length + profile.achievements.filter((a) => a.awardName).length,
        total: Math.max(profile.stats.length + profile.achievements.length, 1),
      },
      media: {
        done: profile.media.filter((m) => m.url).length,
        total: Math.max(profile.media.length, 1),
      },
      review: {
        done: verification.isValidForSubmission ? 1 : 0,
        total: 1,
      },
    } satisfies Record<OnboardingStep, { done: number; total: number }>;
  }, [profile, verification.isValidForSubmission]);

  /* ------ persistence ------ */

  async function saveProfile(silent = false) {
    setIsSaving(true);
    const res = await fetch(`/api/workspace/profile?profileId=${profile.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: profileRef.current }),
    });
    const payload = (await res.json()) as WorkspacePayload & { error?: string };
    setIsSaving(false);
    if (!res.ok || payload.error) {
      setToast({ kind: "warn", text: payload.error ?? "Unable to save." });
      return;
    }
    startTransition(() => {
      setProfile(payload.profile);
      setIsDirty(false);
      if (!silent) setToast({ kind: "ok", text: "Saved." });
    });
  }

  async function submitForReview() {
    setIsSaving(true);
    const res = await fetch("/api/workspace/profile/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: profileRef.current }),
    });
    const payload = (await res.json()) as WorkspacePayload & { error?: string };
    setIsSaving(false);
    if (!res.ok || payload.error) {
      setToast({ kind: "warn", text: payload.error ?? "Unable to submit." });
      return;
    }
    startTransition(() => {
      setProfile(payload.profile);
      setIsDirty(false);
      setToast({ kind: "ok", text: "Submitted for review. Returning to hub…" });
    });
    window.setTimeout(() => router.push("/workspace"), 1200);
  }

  // autosave
  useEffect(() => {
    if (!isDirty) return;
    const id = window.setInterval(() => void saveProfile(true), 30_000);
    return () => window.clearInterval(id);
  }, [isDirty]);

  // Cmd/Ctrl+S
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty) void saveProfile();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDirty]);

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  function patch(next: ResearchProfile) {
    setProfile(next);
    setIsDirty(true);
  }

  function goNext() {
    const i = STEPS.findIndex((s) => s.id === step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]!.id);
  }
  function goPrev() {
    const i = STEPS.findIndex((s) => s.id === step);
    if (i > 0) setStep(STEPS[i - 1]!.id);
  }

  /* ------ item helpers ------ */

  const blankClaim = () => ({ ...createEmptyClaim(), researcherId: user?.id ?? profile.researcherId });

  function addCareer() {
    patch({
      ...profile,
      careerTimeline: [
        ...profile.careerTimeline,
        {
          id: crypto.randomUUID(),
          title: "",
          date: "",
          eventType: "milestone",
          teamOrganization: "",
          leagueCompetition: "NBA",
          description: "",
          linkedMediaUrl: "",
          talentApproved: false,
          claim: blankClaim(),
          state: "draft",
        },
      ],
    });
  }
  function addStat() {
    patch({
      ...profile,
      stats: [
        ...profile.stats,
        {
          id: crypto.randomUUID(),
          sport: "basketball",
          label: "",
          value: "",
          category: "career_average",
          dataSource: "",
          claim: blankClaim(),
          state: "draft",
        },
      ],
    });
  }
  function addAchievement() {
    patch({
      ...profile,
      achievements: [
        ...profile.achievements,
        {
          id: crypto.randomUUID(),
          awardName: "",
          awardingBody: "NBA",
          year: "",
          category: "other",
          description: "",
          talentApproved: false,
          claim: blankClaim(),
          state: "draft",
        },
      ],
    });
  }
  function addMedia() {
    patch({
      ...profile,
      media: [
        ...profile.media,
        {
          id: crypto.randomUUID(),
          kind: "portrait",
          title: "",
          url: "",
          usageRights: "",
          talentApproved: false,
          claim: blankClaim(),
          state: "draft",
        },
      ],
    });
  }
  function removeFrom<K extends "careerTimeline" | "stats" | "achievements" | "media">(
    key: K,
    id: string,
  ) {
    patch({
      ...profile,
      [key]: profile[key].filter((x) => x.id !== id),
    } as ResearchProfile);
  }

  /* ------ headerContent (save state pill) ------ */

  const saveState = isSaving ? "Saving…" : isDirty ? "Unsaved changes" : "All changes saved";
  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => router.push("/workspace")}
        style={{
          ...reset,
          minHeight: 30,
          padding: "0 10px",
          borderRadius: 8,
          border: `1px solid ${T.border}`,
          background: T.ink,
          color: T.mutedLight,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        ← All onboardings
      </button>
      <span
        style={{
          minHeight: 30,
          padding: "0 12px",
          borderRadius: 999,
          background: statusAccent[profile.status],
          border: `1px solid ${T.border}`,
          color: T.paper,
          fontSize: 12,
          fontFamily: font.body,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {statusLabels[profile.status]}
      </span>
      <span
        style={{
          fontSize: 12,
          color: isDirty ? T.orange : T.mutedLight,
          fontFamily: font.mono,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: isSaving ? T.cyan : isDirty ? T.orange : T.green,
          }}
        />
        {saveState}
      </span>
    </div>
  );

  /* ------ step panels ------ */

  const identityPanel = <IdentityStep profile={profile} onChange={patch} isMobile={isMobile} />;

  const careerPanel = (
    <Card
      title="Career timeline"
      subtitle="Draft, signings, trades, championships, retirements. Add dated milestones one at a time."
    >
      {profile.careerTimeline.length === 0 ? (
        <EmptyState text="No career events yet. Start with the player's draft or first signing." />
      ) : (
        profile.careerTimeline.map((e) => (
          <RowCard
            key={e.id}
            onRemove={() => removeFrom("careerTimeline", e.id)}
            removeLabel="Remove event"
          >
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 14 }}>
              <Field
                label="Event title"
                placeholder="Drafted 2nd overall by Dallas Mavericks"
                value={e.title}
                onChange={(title) =>
                  patch({
                    ...profile,
                    careerTimeline: profile.careerTimeline.map((x) => (x.id === e.id ? { ...x, title } : x)),
                  })
                }
              />
              <Field
                label="Date"
                type="date"
                value={e.date}
                onChange={(date) =>
                  patch({
                    ...profile,
                    careerTimeline: profile.careerTimeline.map((x) => (x.id === e.id ? { ...x, date } : x)),
                  })
                }
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
              <Select
                label="Type"
                value={e.eventType}
                options={[
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
                ] as const}
                onChange={(eventType) =>
                  patch({
                    ...profile,
                    careerTimeline: profile.careerTimeline.map((x) =>
                      x.id === e.id ? { ...x, eventType: eventType as CareerEvent["eventType"] } : x,
                    ),
                  })
                }
              />
              <Field
                label="Team"
                value={e.teamOrganization}
                onChange={(teamOrganization) =>
                  patch({
                    ...profile,
                    careerTimeline: profile.careerTimeline.map((x) =>
                      x.id === e.id ? { ...x, teamOrganization } : x,
                    ),
                  })
                }
              />
              <Field
                label="League"
                value={e.leagueCompetition}
                onChange={(leagueCompetition) =>
                  patch({
                    ...profile,
                    careerTimeline: profile.careerTimeline.map((x) =>
                      x.id === e.id ? { ...x, leagueCompetition } : x,
                    ),
                  })
                }
              />
            </div>
            <TextArea
              label="What happened"
              rows={2}
              value={e.description}
              onChange={(description) =>
                patch({
                  ...profile,
                  careerTimeline: profile.careerTimeline.map((x) =>
                    x.id === e.id ? { ...x, description } : x,
                  ),
                })
              }
            />
            <SourceInput
              required
              claim={e.claim}
              onChange={(claim) =>
                patch({
                  ...profile,
                  careerTimeline: profile.careerTimeline.map((x) => (x.id === e.id ? { ...x, claim } : x)),
                })
              }
            />
          </RowCard>
        ))
      )}
      <AddButton label="Add career event" onClick={addCareer} />
    </Card>
  );

  const statsPanel = (
    <>
      <Card title="Statistics" subtitle="Career and season-level numbers, linked to a data source.">
        {profile.stats.length === 0 ? (
          <EmptyState text="Add at least one headline stat — e.g. career assists, championships won." />
        ) : (
          profile.stats.map((s) => (
            <RowCard key={s.id} onRemove={() => removeFrom("stats", s.id)} removeLabel="Remove stat">
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr 1fr", gap: 14 }}>
                <Field
                  label="Label"
                  placeholder="Career assists"
                  value={s.label}
                  onChange={(label) =>
                    patch({
                      ...profile,
                      stats: profile.stats.map((x) => (x.id === s.id ? { ...x, label } : x)),
                    })
                  }
                />
                <Field
                  label="Value"
                  placeholder="12,091"
                  value={s.value}
                  onChange={(value) =>
                    patch({
                      ...profile,
                      stats: profile.stats.map((x) => (x.id === s.id ? { ...x, value } : x)),
                    })
                  }
                />
                <Select
                  label="Category"
                  value={s.category}
                  options={[
                    "career_average",
                    "season",
                    "postseason",
                    "record",
                    "all_star",
                    "championship",
                    "award",
                  ] as const}
                  onChange={(category) =>
                    patch({
                      ...profile,
                      stats: profile.stats.map((x) =>
                        x.id === s.id ? { ...x, category: category as StatEntry["category"] } : x,
                      ),
                    })
                  }
                />
              </div>
              <Field
                label="Data source (e.g. NBA.com, Basketball-Reference)"
                value={s.dataSource}
                onChange={(dataSource) =>
                  patch({
                    ...profile,
                    stats: profile.stats.map((x) => (x.id === s.id ? { ...x, dataSource } : x)),
                  })
                }
              />
              <SourceInput
                required
                claim={s.claim}
                onChange={(claim) =>
                  patch({
                    ...profile,
                    stats: profile.stats.map((x) => (x.id === s.id ? { ...x, claim } : x)),
                  })
                }
              />
            </RowCard>
          ))
        )}
        <AddButton label="Add stat" onClick={addStat} />
      </Card>

      <Card title="Honors & achievements" subtitle="MVP, championships, Hall of Fame, All-Star selections.">
        {profile.achievements.length === 0 ? (
          <EmptyState text="Capture the awards that define this player's legacy." />
        ) : (
          profile.achievements.map((a) => (
            <RowCard key={a.id} onRemove={() => removeFrom("achievements", a.id)} removeLabel="Remove achievement">
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr", gap: 14 }}>
                <Field
                  label="Award"
                  placeholder="NBA Champion"
                  value={a.awardName}
                  onChange={(awardName) =>
                    patch({
                      ...profile,
                      achievements: profile.achievements.map((x) =>
                        x.id === a.id ? { ...x, awardName } : x,
                      ),
                    })
                  }
                />
                <Field
                  label="Year"
                  value={a.year}
                  placeholder="2011"
                  onChange={(year) =>
                    patch({
                      ...profile,
                      achievements: profile.achievements.map((x) => (x.id === a.id ? { ...x, year } : x)),
                    })
                  }
                />
                <Select
                  label="Category"
                  value={a.category}
                  options={["mvp", "championship", "all-star", "hall-of-fame", "record", "community", "other"] as const}
                  onChange={(category) =>
                    patch({
                      ...profile,
                      achievements: profile.achievements.map((x) =>
                        x.id === a.id
                          ? { ...x, category: category as AchievementEntry["category"] }
                          : x,
                      ),
                    })
                  }
                />
              </div>
              <SourceInput
                required
                claim={a.claim}
                onChange={(claim) =>
                  patch({
                    ...profile,
                    achievements: profile.achievements.map((x) => (x.id === a.id ? { ...x, claim } : x)),
                  })
                }
              />
            </RowCard>
          ))
        )}
        <AddButton label="Add achievement" onClick={addAchievement} />
      </Card>
    </>
  );

  const mediaPanel = (
    <Card
      title="Media assets"
      subtitle="Official portraits, action shots, or licensed video. Add hosted links or upload photos and videos for rights review."
    >
      {profile.media.length === 0 ? (
        <EmptyState text="Add at least one official portrait, photo, or video to complete onboarding." />
      ) : (
        profile.media.map((m) => (
          <RowCard key={m.id} onRemove={() => removeFrom("media", m.id)} removeLabel="Remove asset">
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: 14 }}>
              <Select
                label="Type"
                value={m.kind}
                options={[
                  { value: "portrait", label: "Official portrait" },
                  { value: "action_shot", label: "Action shot" },
                  { value: "milestone_photo", label: "Milestone photo" },
                  { value: "video", label: "Video" },
                  { value: "voice_sample", label: "Voice sample" },
                ]}
                onChange={(kind) =>
                  patch({
                    ...profile,
                    media: profile.media.map((x) =>
                      x.id === m.id ? { ...x, kind: kind as MediaEntry["kind"] } : x,
                    ),
                  })
                }
              />
              <Field
                label="Title"
                value={m.title}
                onChange={(title) =>
                  patch({
                    ...profile,
                    media: profile.media.map((x) => (x.id === m.id ? { ...x, title } : x)),
                  })
                }
              />
            </div>
            <MediaAssetSourceField
              media={m}
              onChange={(next) =>
                patch({
                  ...profile,
                  media: profile.media.map((x) => (x.id === m.id ? next : x)),
                })
              }
            />
            <Field
              label="Usage rights"
              placeholder="NBA media pool · editorial use"
              value={m.usageRights}
              onChange={(usageRights) =>
                patch({
                  ...profile,
                  media: profile.media.map((x) => (x.id === m.id ? { ...x, usageRights } : x)),
                })
              }
            />
            <SourceInput
              claim={m.claim}
              onChange={(claim) =>
                patch({
                  ...profile,
                  media: profile.media.map((x) => (x.id === m.id ? { ...x, claim } : x)),
                })
              }
            />
          </RowCard>
        ))
      )}
      <AddButton label="Add media asset" onClick={addMedia} />
    </Card>
  );

  const reviewPanel = (
    <Card title="Review & submit" subtitle="A quick pass before this profile goes to editorial.">
      <SummaryGrid profile={profile} />
      <div
        style={{
          padding: 16,
          borderRadius: 14,
          border: `1px solid ${verification.isValidForSubmission ? T.green : T.orange}`,
          background: verification.isValidForSubmission ? "rgba(44,199,139,0.1)" : "rgba(255,122,104,0.12)",
          color: T.paper,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {verification.isValidForSubmission
          ? "Ready to submit. Every required field has a source attached."
          : `${verification.blockingIssues.length} blocking issue${verification.blockingIssues.length === 1 ? "" : "s"} — add a source link to each flagged claim before submitting.`}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => void saveProfile()}
          disabled={isSaving}
          style={{
            ...reset,
            minHeight: 46,
            padding: "0 18px",
            borderRadius: 12,
            background: T.ink,
            border: `1px solid ${T.border}`,
            color: T.paper,
            fontWeight: 600,
            cursor: isSaving ? "wait" : "pointer",
          }}
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => void submitForReview()}
          disabled={isSaving || profile.status !== "draft" || !verification.isValidForSubmission}
          style={{
            ...reset,
            minHeight: 46,
            padding: "0 22px",
            borderRadius: 12,
            background: verification.isValidForSubmission ? T.cyan : T.inkMid,
            color: verification.isValidForSubmission ? T.ink : T.muted,
            fontWeight: 800,
            cursor:
              isSaving || profile.status !== "draft" || !verification.isValidForSubmission
                ? "not-allowed"
                : "pointer",
          }}
        >
          {profile.status !== "draft" ? statusLabels[profile.status] : "Submit for review"}
        </button>
      </div>
    </Card>
  );

  const panels: Record<OnboardingStep, React.ReactNode> = {
    identity: identityPanel,
    career: careerPanel,
    stats: statsPanel,
    media: mediaPanel,
    review: reviewPanel,
  };

  /* ------ render ------ */

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const isLast = stepIndex === STEPS.length - 1;
  const isFirst = stepIndex === 0;

  return (
    <ProtectedShell
      page="workspace"
      title={profile.name.value || "New talent profile"}
      subtitle="Onboard a player to Ricon Core."
      headerContent={header}
    >
      <div style={{ display: "grid", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
        <Stepper active={step} onChange={setStep} completion={completion} isMobile={isMobile} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 1fr) 280px",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>{panels[step]}</div>

          <aside
            style={{
              display: "grid",
              gap: 14,
              position: isTablet ? "static" : "sticky",
              top: 96,
            }}
          >
            <div
              style={{
                padding: 18,
                borderRadius: 16,
                border: `1px solid ${T.borderLight}`,
                background: T.card,
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ color: T.muted, fontSize: 11, fontFamily: font.mono, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Onboarding progress
              </div>
              {STEPS.map((s) => {
                const c = completion[s.id];
                const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
                return (
                  <div key={s.id} style={{ display: "grid", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.paper }}>
                      <span>{s.label}</span>
                      <span style={{ color: T.mutedLight, fontFamily: font.mono }}>{pct}%</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: pct === 100 ? T.green : T.brandPrimary,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: `1px solid ${T.borderLight}`,
                background: T.card,
                color: T.mutedLight,
                fontSize: 12,
                lineHeight: 1.55,
              }}
            >
              <div style={{ color: T.paper, fontWeight: 700, marginBottom: 6, fontSize: 13 }}>
                Tips
              </div>
              Every claim needs a source link — the ● pill turns green when verified. Autosaves every 30s. Press ⌘S to save now.
            </div>
          </aside>
        </div>

        {/* Step navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            padding: "14px 0",
            borderTop: `1px solid ${T.borderLight}`,
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            style={{
              ...reset,
              minHeight: 44,
              padding: "0 18px",
              borderRadius: 12,
              background: "transparent",
              border: `1px solid ${T.border}`,
              color: isFirst ? T.muted : T.paper,
              cursor: isFirst ? "not-allowed" : "pointer",
            }}
          >
            ← Back
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={!isDirty || isSaving}
              style={{
                ...reset,
                minHeight: 44,
                padding: "0 18px",
                borderRadius: 12,
                background: T.ink,
                border: `1px solid ${T.border}`,
                color: isDirty ? T.paper : T.muted,
                cursor: isDirty && !isSaving ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
            {!isLast ? (
              <button
                type="button"
                onClick={goNext}
                style={{
                  ...reset,
                  minHeight: 44,
                  padding: "0 22px",
                  borderRadius: 12,
                  background: T.brandPrimary,
                  color: T.paper,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Next: {STEPS[stepIndex + 1]!.label} →
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            padding: "12px 16px",
            borderRadius: 12,
            background: toast.kind === "ok" ? "rgba(44,199,139,0.18)" : "rgba(255,122,104,0.18)",
            border: `1px solid ${toast.kind === "ok" ? T.green : T.orange}`,
            color: T.paper,
            fontSize: 13,
            fontFamily: font.body,
            boxShadow: T.shadowSm,
            zIndex: 50,
          }}
        >
          {toast.text}
        </div>
      ) : null}
    </ProtectedShell>
  );
}

/* ---------------------------- helpers ---------------------------- */

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 14,
        border: `1px dashed ${T.border}`,
        background: "rgba(0,0,0,0.2)",
        color: T.mutedLight,
        fontSize: 13,
        textAlign: "center",
        fontFamily: font.body,
      }}
    >
      {text}
    </div>
  );
}

function SummaryGrid({ profile }: { profile: ResearchProfile }) {
  const items: { label: string; value: string | number }[] = [
    { label: "Name", value: profile.name.value || "—" },
    { label: "DOB", value: profile.dateOfBirth.value || "—" },
    { label: "Nationality", value: profile.nationality.value || "—" },
    { label: "Height / weight", value: profile.heightWeight.value || "—" },
    { label: "Career events", value: profile.careerTimeline.length },
    { label: "Stats", value: profile.stats.length },
    { label: "Achievements", value: profile.achievements.length },
    { label: "Media", value: profile.media.length },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 10,
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          style={{
            padding: 14,
            borderRadius: 12,
            background: T.ink,
            border: `1px solid ${T.border}`,
          }}
        >
          <div style={{ color: T.muted, fontSize: 11, fontFamily: font.mono, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            {it.label}
          </div>
          <div style={{ color: T.paper, fontSize: 14, fontFamily: font.body, overflowWrap: "anywhere" }}>
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
