"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { T, font } from "@/src/config/theme.js";

import type { FieldClaim, ResearchProfile } from "./types";
import type { AttributedField, PlayerLookupMatch } from "./playerLookup";

/* ---------------------------- types -------------------------------- */

type IdentityFieldKey =
  | "name"
  | "legalName"
  | "aliases"
  | "dateOfBirth"
  | "placeOfBirth"
  | "nationality"
  | "heightWeight"
  | "profileImage"
  | "biographyExcerpt";

type ProviderTag = "balldontlie" | "wikipedia" | "manual";

interface Props {
  profile: ResearchProfile;
  onChange: (next: ResearchProfile) => void;
  isMobile: boolean;
}

const reset: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: "none",
  background: "none",
  font: "inherit",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 44,
  padding: "0 14px",
  borderRadius: 12,
  border: `1px solid ${T.border}`,
  background: T.ink,
  color: T.paper,
  fontFamily: font.body,
  fontSize: 14,
};

/* ---------------------------- utils -------------------------------- */

function computeAge(iso: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const dob = new Date(iso);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age >= 0 && age < 130 ? `${age} yrs old` : null;
}

function applyAttribution(
  field: FieldClaim<string>,
  attribution: AttributedField | undefined,
): FieldClaim<string> {
  if (!attribution) return field;
  return {
    ...field,
    value: attribution.value,
    claim: {
      ...field.claim,
      citation: {
        ...field.claim.citation,
        url: attribution.source,
        publicationName:
          attribution.provider === "balldontlie"
            ? "balldontlie"
            : attribution.provider === "wikipedia"
              ? "Wikipedia / Wikidata"
              : field.claim.citation.publicationName,
        dateAccessed: new Date().toISOString().slice(0, 10),
        sourceType:
          attribution.provider === "balldontlie" ? "official_record" : "secondary_reference",
      },
    },
  };
}

function detectProvider(field: FieldClaim<string>): ProviderTag {
  const url = field.claim.citation.url;
  if (!url) return "manual";
  if (/balldontlie/i.test(url)) return "balldontlie";
  if (/wikipedia|wikidata/i.test(url)) return "wikipedia";
  return "manual";
}

const providerLabel: Record<ProviderTag, string> = {
  balldontlie: "B",
  wikipedia: "W",
  manual: "✍",
};
const providerColor: Record<ProviderTag, string> = {
  balldontlie: "rgba(0,183,241,0.22)",
  wikipedia: "rgba(107,92,255,0.22)",
  manual: "rgba(137,143,153,0.18)",
};

/* ------------------------ subcomponents ---------------------------- */

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div style={{ display: "grid", gap: 2 }}>
      <h3
        style={{
          color: T.paper,
          fontFamily: font.display,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </h3>
      {hint ? <div style={{ color: T.mutedLight, fontSize: 12 }}>{hint}</div> : null}
    </div>
  );
}

function SourcePill({ field }: { field: FieldClaim<string> }) {
  const provider = detectProvider(field);
  const verified = provider !== "manual";
  return (
    <span
      title={verified ? "Source attached" : "No source yet"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 22,
        padding: "0 8px",
        borderRadius: 999,
        background: verified ? providerColor[provider] : "rgba(255,122,104,0.12)",
        color: verified ? T.paper : T.orange,
        fontSize: 10,
        fontFamily: font.mono,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: verified ? "rgba(0,0,0,0.35)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
        }}
      >
        {verified ? providerLabel[provider] : "○"}
      </span>
      {verified ? provider : "needs source"}
    </span>
  );
}

function LabeledInput({
  id,
  label,
  field,
  onChange,
  type = "text",
  placeholder,
  hint,
  autoFocus,
  monospace,
}: {
  id: string;
  label: string;
  field: FieldClaim<string>;
  onChange: (next: FieldClaim<string>) => void;
  type?: string;
  placeholder?: string;
  hint?: React.ReactNode;
  autoFocus?: boolean;
  monospace?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 8 }}>
        <label htmlFor={id} style={{ color: T.paper, fontSize: 12, fontWeight: 600, fontFamily: font.body }}>
          {label}
        </label>
        <SourcePill field={field} />
      </div>
      <input
        id={id}
        type={type}
        value={field.value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => onChange({ ...field, value: e.target.value })}
        style={{
          ...inputStyle,
          fontFamily: monospace ? font.mono : font.body,
          fontSize: monospace ? 13 : 14,
        }}
      />
      {hint ? <div style={{ color: T.muted, fontSize: 11, fontFamily: font.body }}>{hint}</div> : null}
      <input
        aria-label={`${label} source link`}
        type="url"
        value={field.claim.citation.url}
        placeholder="Source URL (required to verify)"
        onChange={(e) =>
          onChange({
            ...field,
            claim: {
              ...field.claim,
              citation: {
                ...field.claim.citation,
                url: e.target.value,
                dateAccessed: e.target.value
                  ? new Date().toISOString().slice(0, 10)
                  : "",
              },
            },
          })
        }
        style={{
          ...inputStyle,
          fontFamily: font.mono,
          fontSize: 12,
          color: T.mutedLight,
          background: "rgba(0,0,0,0.25)",
          minHeight: 36,
        }}
      />
    </div>
  );
}

/* -------------------- auto-fill search panel ----------------------- */

function SearchPanel({
  onApply,
  initialQuery,
}: {
  onApply: (match: PlayerLookupMatch, overwrite: boolean) => void;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<PlayerLookupMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [overwrite, setOverwrite] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;
    setIsLoading(true);
    const id = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/workspace/onboarding/lookup?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        const payload = (await res.json()) as { matches?: PlayerLookupMatch[]; error?: string };
        if (payload.error) {
          setErrorMsg(payload.error);
          setResults([]);
        } else {
          setErrorMsg(null);
          setResults(payload.matches ?? []);
        }
        setIsOpen(true);
        setSelectedIdx(0);
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          setErrorMsg("Lookup failed. Check network and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 280);
    return () => {
      window.clearTimeout(id);
      ctrl.abort();
    };
  }, [query]);

  function applySelected() {
    const m = results[selectedIdx];
    if (!m) return;
    onApply(m, overwrite);
    setIsOpen(false);
  }

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        background: `linear-gradient(160deg, rgba(107,92,255,0.12), rgba(0,183,241,0.06)), ${T.ink}`,
        display: "grid",
        gap: 12,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "rgba(107,92,255,0.25)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          ✨
        </div>
        <div style={{ display: "grid", gap: 2 }}>
          <div style={{ color: T.paper, fontWeight: 700, fontSize: 14 }}>
            Auto-fill from public sources
          </div>
          <div style={{ color: T.mutedLight, fontSize: 12 }}>
            Search balldontlie + Wikipedia. Pick a match to populate empty fields.
          </div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={(e) => {
            if (!isOpen || results.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              applySelected();
            } else if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          placeholder="Search by name — e.g. Victor Wembanyama"
          style={{ ...inputStyle, paddingRight: 40 }}
        />
        {isLoading ? (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.mutedLight,
              fontSize: 11,
              fontFamily: font.mono,
            }}
          >
            …
          </div>
        ) : null}

        {isOpen && results.length > 0 ? (
          <ul
            role="listbox"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              margin: 0,
              padding: 6,
              listStyle: "none",
              background: T.panelStrong,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              boxShadow: T.shadowSm,
              zIndex: 10,
              maxHeight: 360,
              overflowY: "auto",
              display: "grid",
              gap: 2,
            }}
          >
            {results.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === selectedIdx}
                  onMouseEnter={() => setSelectedIdx(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelectedIdx(i);
                    onApply(m, overwrite);
                    setIsOpen(false);
                  }}
                  style={{
                    ...reset,
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "40px 1fr auto",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: i === selectedIdx ? "rgba(107,92,255,0.18)" : "transparent",
                    color: T.paper,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {m.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.thumbnail}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        objectFit: "cover",
                        background: T.ink,
                      }}
                    />
                  ) : (
                    <div
                      aria-hidden
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.05)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        color: T.mutedLight,
                      }}
                    >
                      {m.name.slice(0, 1)}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        color: T.mutedLight,
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.subtitle}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {m.providers.map((p) => (
                      <span
                        key={p}
                        style={{
                          height: 18,
                          padding: "0 6px",
                          borderRadius: 999,
                          background:
                            p === "balldontlie" ? "rgba(0,183,241,0.22)" : "rgba(107,92,255,0.22)",
                          color: T.paper,
                          fontSize: 10,
                          fontFamily: font.mono,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {p === "balldontlie" ? "B" : "W"}
                      </span>
                    ))}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {errorMsg ? (
        <div
          role="alert"
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            background: "rgba(255,122,104,0.12)",
            color: T.orange,
            fontSize: 12,
            fontFamily: font.mono,
          }}
        >
          {errorMsg}
        </div>
      ) : null}

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: T.mutedLight,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={overwrite}
          onChange={(e) => setOverwrite(e.target.checked)}
        />
        Overwrite fields I've already filled
      </label>
    </div>
  );
}

/* ---------------------------- main --------------------------------- */

export default function IdentityStep({ profile, onChange, isMobile }: Props) {
  const age = useMemo(() => computeAge(profile.dateOfBirth.value), [profile.dateOfBirth.value]);
  const bioLen = profile.biographyExcerpt.value.length;
  const portraitPreviewable = /^https?:\/\//.test(profile.profileImage.value);

  function applyMatch(match: PlayerLookupMatch, overwrite: boolean) {
    const next = { ...profile };
    const assignTo = (key: IdentityFieldKey, attr: AttributedField | undefined) => {
      if (!attr) return;
      const existing = next[key] as FieldClaim<string>;
      if (!overwrite && existing.value.trim()) return;
      (next[key] as FieldClaim<string>) = applyAttribution(existing, attr);
    };
    assignTo("name", match.fields.name);
    assignTo("legalName", match.fields.legalName);
    assignTo("dateOfBirth", match.fields.dateOfBirth);
    assignTo("placeOfBirth", match.fields.placeOfBirth);
    assignTo("nationality", match.fields.nationality);
    assignTo("heightWeight", match.fields.heightWeight);
    assignTo("profileImage", match.fields.profileImage);
    assignTo("biographyExcerpt", match.fields.biographyExcerpt);
    onChange(next);
  }

  function set<K extends IdentityFieldKey>(key: K, field: FieldClaim<string>) {
    onChange({ ...profile, [key]: field });
  }

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel})`,
        boxShadow: T.shadowSm,
        display: "grid",
        gap: 22,
      }}
    >
      <header>
        <h2
          style={{
            fontSize: 20,
            lineHeight: 1.1,
            fontWeight: 700,
            color: T.paper,
            fontFamily: font.display,
            marginBottom: 6,
          }}
        >
          Who is the player
        </h2>
        <p style={{ color: T.mutedLight, fontFamily: font.body, fontSize: 13 }}>
          Core identity facts a fan would recognize. Every field needs a source link before review.
        </p>
      </header>

      <SearchPanel onApply={applyMatch} initialQuery={profile.name.value} />

      {/* Basics */}
      <div style={{ display: "grid", gap: 14 }}>
        <SectionHeader title="Basics" hint="Names the player is known by." />
        <LabeledInput
          id="id-name"
          label="Display name"
          placeholder="Jason Kidd"
          autoFocus
          field={profile.name}
          onChange={(f) => set("name", f)}
        />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          <LabeledInput
            id="id-legalName"
            label="Full legal name"
            placeholder="Jason Frederick Kidd"
            field={profile.legalName}
            onChange={(f) => set("legalName", f)}
          />
          <LabeledInput
            id="id-aliases"
            label="Nicknames / aliases"
            placeholder="J-Kidd"
            field={profile.aliases}
            onChange={(f) => set("aliases", f)}
          />
        </div>
      </div>

      {/* Origin */}
      <div style={{ display: "grid", gap: 14 }}>
        <SectionHeader title="Origin" hint="When and where the player was born." />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          <LabeledInput
            id="id-dob"
            label="Date of birth"
            type="date"
            field={profile.dateOfBirth}
            onChange={(f) => set("dateOfBirth", f)}
            hint={age ?? undefined}
          />
          <LabeledInput
            id="id-pob"
            label="Place of birth"
            placeholder="San Francisco, California, United States"
            field={profile.placeOfBirth}
            onChange={(f) => set("placeOfBirth", f)}
          />
        </div>
        <LabeledInput
          id="id-nationality"
          label="Nationality / citizenship"
          placeholder="United States"
          field={profile.nationality}
          onChange={(f) => set("nationality", f)}
        />
      </div>

      {/* Physical + portrait */}
      <div style={{ display: "grid", gap: 14 }}>
        <SectionHeader title="Physical & portrait" hint={`Height, weight, and the canonical headshot URL.`} />
        <LabeledInput
          id="id-hw"
          label="Height · Weight"
          placeholder={`6'4" · 205 lb`}
          field={profile.heightWeight}
          onChange={(f) => set("heightWeight", f)}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 120px",
            gap: 14,
            alignItems: "start",
          }}
        >
          <LabeledInput
            id="id-portrait"
            label="Official portrait URL"
            placeholder="https://cdn.nba.com/…"
            monospace
            field={profile.profileImage}
            onChange={(f) => set("profileImage", f)}
          />
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 14,
              border: `1px solid ${T.border}`,
              background: T.ink,
              overflow: "hidden",
              position: "relative",
              justifySelf: isMobile ? "start" : "auto",
            }}
          >
            {portraitPreviewable ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profileImage.value}
                alt="Portrait preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => ((e.currentTarget.style.display = "none"))}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.muted,
                  fontSize: 11,
                  fontFamily: font.mono,
                }}
              >
                No image
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ display: "grid", gap: 8 }}>
        <SectionHeader
          title="Short biography"
          hint="One paragraph summary shown on profile previews."
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 8 }}>
          <label
            htmlFor="id-bio"
            style={{ color: T.paper, fontSize: 12, fontWeight: 600, fontFamily: font.body }}
          >
            Biography excerpt
          </label>
          <SourcePill field={profile.biographyExcerpt} />
        </div>
        <textarea
          id="id-bio"
          rows={4}
          value={profile.biographyExcerpt.value}
          onChange={(e) =>
            set("biographyExcerpt", { ...profile.biographyExcerpt, value: e.target.value })
          }
          maxLength={600}
          placeholder="Hall of Fame point guard, NBA champion, and championship coach…"
          style={{
            ...inputStyle,
            minHeight: 96,
            padding: 12,
            resize: "vertical",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: bioLen > 280 ? T.orange : T.muted,
            fontSize: 11,
            fontFamily: font.mono,
          }}
        >
          <span>{bioLen <= 280 ? "Fits in preview cards" : "Will truncate in preview cards"}</span>
          <span>{bioLen} / 600</span>
        </div>
        <input
          aria-label="Biography source link"
          type="url"
          value={profile.biographyExcerpt.claim.citation.url}
          placeholder="Source URL (required to verify)"
          onChange={(e) =>
            set("biographyExcerpt", {
              ...profile.biographyExcerpt,
              claim: {
                ...profile.biographyExcerpt.claim,
                citation: {
                  ...profile.biographyExcerpt.claim.citation,
                  url: e.target.value,
                  dateAccessed: e.target.value ? new Date().toISOString().slice(0, 10) : "",
                },
              },
            })
          }
          style={{
            ...inputStyle,
            fontFamily: font.mono,
            fontSize: 12,
            color: T.mutedLight,
            background: "rgba(0,0,0,0.25)",
            minHeight: 36,
          }}
        />
      </div>
    </div>
  );
}
