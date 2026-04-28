"use client";

import { useState } from "react";

import { T, font } from "../config/theme.js";
import StandalonePageNav from "../components/StandalonePageNav.jsx";
import { Btn } from "../components/ui.jsx";

export default function LeadCapturePage({
  eyebrow,
  title,
  description,
  formTitle,
  submitLabel,
  audienceLabel,
  acknowledgement,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 16px",
        background:
          "radial-gradient(circle at top right, rgba(60,200,255,0.12), transparent 30%), linear-gradient(180deg, rgba(8,16,24,1) 0%, rgba(16,25,39,1) 100%)",
      }}
    >
      <StandalonePageNav />
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          padding: 32,
          borderRadius: 28,
          border: `1px solid ${T.border}`,
          background: "rgba(8,16,24,0.92)",
          boxShadow: T.shadow,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.cyan, marginBottom: 10 }}>
            {eyebrow}
          </div>
          <h1 style={{ fontSize: 40, lineHeight: 1.02, fontWeight: 800, color: T.paper, fontFamily: font.display, marginBottom: 14 }}>
            {title}
          </h1>
          <p style={{ color: T.mutedLight, fontSize: 16, lineHeight: 1.8 }}>{description}</p>
        </div>

        <div
          style={{
            padding: 24,
            borderRadius: 22,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: T.paper, marginBottom: 14 }}>{formTitle}</div>
          {!submitted ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              style={{ display: "grid", gap: 14 }}
            >
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, color: T.paper, fontWeight: 700 }}>
                  Work email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  style={{
                    minHeight: 52,
                    padding: "0 16px",
                    borderRadius: 16,
                    border: `1px solid ${T.border}`,
                    background: T.ink,
                    color: T.paper,
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, color: T.paper, fontWeight: 700 }}>
                  What are you hoping to do?
                </span>
                <textarea
                  rows={4}
                  placeholder={audienceLabel}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: `1px solid ${T.border}`,
                    background: T.ink,
                    color: T.paper,
                    resize: "vertical",
                  }}
                />
              </label>
              <Btn variant="primary" style={{ width: "100%" }}>
                {submitLabel}
              </Btn>
            </form>
          ) : (
            <div role="status" aria-live="polite" style={{ fontSize: 15, color: T.green, lineHeight: 1.8 }}>
              {acknowledgement}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
