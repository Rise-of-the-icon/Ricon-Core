"use client";

import { T, font } from "@/src/config/theme.js";

type DiffPartKind = "unchanged" | "added" | "removed";

interface DiffPart {
  kind: DiffPartKind;
  text: string;
}

export interface DiffSource {
  publicationName: string;
  url: string;
  dateAccessed: string;
}

interface RevisionDiffViewProps {
  title: string;
  oldText: string;
  newText: string;
  oldSource?: DiffSource;
  newSource?: DiffSource;
  decisionStatus?: "pending" | "accepted" | "rejected";
  onAccept?: () => void;
  onReject?: () => void;
}

function tokenize(value: string) {
  const tokens = value.match(/\S+|\s+/g);
  return tokens ?? [];
}

function buildDiff(oldText: string, newText: string): DiffPart[] {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);
  const rowCount = oldTokens.length + 1;
  const colCount = newTokens.length + 1;
  const table = Array.from({ length: rowCount }, () =>
    Array<number>(colCount).fill(0),
  );

  for (let i = 1; i < rowCount; i += 1) {
    for (let j = 1; j < colCount; j += 1) {
      table[i][j] =
        oldTokens[i - 1] === newTokens[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }

  const reversed: DiffPart[] = [];
  let i = oldTokens.length;
  let j = newTokens.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      reversed.push({ kind: "unchanged", text: oldTokens[i - 1] });
      i -= 1;
      j -= 1;
      continue;
    }

    if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
      reversed.push({ kind: "added", text: newTokens[j - 1] });
      j -= 1;
      continue;
    }

    if (i > 0) {
      reversed.push({ kind: "removed", text: oldTokens[i - 1] });
      i -= 1;
    }
  }

  const ordered = reversed.reverse();
  const merged: DiffPart[] = [];

  for (const part of ordered) {
    const previous = merged[merged.length - 1];
    if (previous && previous.kind === part.kind) {
      previous.text += part.text;
    } else {
      merged.push({ ...part });
    }
  }

  return merged;
}

function sourceChanged(oldSource?: DiffSource, newSource?: DiffSource) {
  return (
    (oldSource?.publicationName ?? "") !== (newSource?.publicationName ?? "") ||
    (oldSource?.url ?? "") !== (newSource?.url ?? "") ||
    (oldSource?.dateAccessed ?? "") !== (newSource?.dateAccessed ?? "")
  );
}

function hasAdded(parts: DiffPart[]) {
  return parts.some((part) => part.kind === "added" && part.text.trim().length > 0);
}

function hasRemoved(parts: DiffPart[]) {
  return parts.some((part) => part.kind === "removed" && part.text.trim().length > 0);
}

export default function RevisionDiffView({
  title,
  oldText,
  newText,
  oldSource,
  newSource,
  decisionStatus = "pending",
  onAccept,
  onReject,
}: RevisionDiffViewProps) {
  const parts = buildDiff(oldText, newText);
  const added = hasAdded(parts);
  const removed = hasRemoved(parts);
  const changedSource = sourceChanged(oldSource, newSource);

  return (
    <section
      style={{
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
        padding: 16,
        display: "grid",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <strong style={{ color: T.paper, fontFamily: font.body, fontSize: 14 }}>{title}</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background:
                decisionStatus === "accepted"
                  ? "rgba(44,199,139,0.2)"
                  : decisionStatus === "rejected"
                    ? "rgba(255,122,104,0.2)"
                    : "rgba(255,185,92,0.2)",
              color:
                decisionStatus === "accepted"
                  ? T.green
                  : decisionStatus === "rejected"
                    ? T.orange
                    : T.gold,
              fontSize: 11,
              fontFamily: font.body,
            }}
          >
            {decisionStatus === "accepted"
              ? "Accepted"
              : decisionStatus === "rejected"
                ? "Rejected"
                : "Pending"}
          </span>
          {added ? (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                background: "rgba(44,199,139,0.2)",
                color: T.green,
                fontSize: 11,
                fontFamily: font.body,
              }}
            >
              Added Text
            </span>
          ) : null}
          {removed ? (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                background: "rgba(255,122,104,0.2)",
                color: T.orange,
                fontSize: 11,
                fontFamily: font.body,
              }}
            >
              Removed Text
            </span>
          ) : null}
          {changedSource ? (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                background: T.cyanDim,
                color: T.cyan,
                fontSize: 11,
                fontFamily: font.body,
              }}
            >
              Changed Source
            </span>
          ) : null}
        </div>
      </div>

      <div
        style={{
          borderRadius: 12,
          border: `1px solid ${T.border}`,
          background: T.ink,
          padding: 14,
          color: T.paper,
          fontFamily: font.body,
          fontSize: 13,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {parts.map((part, index) => (
          <span
            key={`${part.kind}-${index}`}
            style={{
              background:
                part.kind === "added"
                  ? "rgba(44,199,139,0.2)"
                  : part.kind === "removed"
                    ? "rgba(255,122,104,0.2)"
                    : "transparent",
              textDecoration: part.kind === "removed" ? "line-through" : "none",
              borderRadius: 3,
            }}
          >
            {part.text}
          </span>
        ))}
      </div>

      {changedSource ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ color: T.muted, fontSize: 11, fontFamily: font.body, textTransform: "uppercase" }}>
            Source Diff
          </div>
          <div style={{ display: "grid", gap: 6, fontSize: 12, color: T.mutedLight, fontFamily: font.body }}>
            <div>Old: {oldSource?.publicationName || "N/A"} · {oldSource?.url || "N/A"}</div>
            <div>New: {newSource?.publicationName || "N/A"} · {newSource?.url || "N/A"}</div>
          </div>
        </div>
      ) : null}

      {onAccept || onReject ? (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          {onReject ? (
            <button
              type="button"
              onClick={onReject}
              style={{
                minHeight: 34,
                padding: "0 14px",
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                background: T.ink,
                color: T.paper,
                fontFamily: font.body,
                cursor: "pointer",
              }}
            >
              {decisionStatus === "rejected" ? "Rejected" : "Reject Change"}
            </button>
          ) : null}
          {onAccept ? (
            <button
              type="button"
              onClick={onAccept}
              style={{
                minHeight: 34,
                padding: "0 14px",
                borderRadius: 10,
                border: "none",
                background: T.cyan,
                color: T.ink,
                fontFamily: font.body,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {decisionStatus === "accepted" ? "Accepted" : "Accept Change"}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
