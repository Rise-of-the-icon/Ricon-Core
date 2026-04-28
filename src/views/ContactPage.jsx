"use client";

import { useState } from "react";

import { T, font } from "../config/theme.js";
import { Btn, Icon } from "../components/ui.jsx";

const INQUIRY_TYPES = ["Talent", "B2B Partnership", "Press", "General"];

const initialForm = {
  name: "",
  email: "",
  inquiryType: "Talent",
  message: "",
};

export default function ContactPage({ viewport }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const isMobile = viewport?.isMobile;
  const isTablet = viewport?.isTablet;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setFeedback("Complete your name, email, and message before sending.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus("error");
      setFeedback("Enter a valid email address so the RICON team can reply.");
      return;
    }

    setStatus("success");
    setFeedback("Thanks. Your message has been received and routed to the RICON team.");
    setForm(initialForm);
  };

  const fieldStyle = {
    width: "100%",
    minHeight: 52,
    padding: "0 16px",
    borderRadius: 8,
    border: `1px solid ${status === "error" ? T.orange : T.border}`,
    background: "rgba(8,16,24,0.82)",
    color: T.paper,
    outline: "none",
  };

  return (
    <div>
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: isMobile ? "72px 16px 72px" : "104px 24px 96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 0.85fr) minmax(360px, 1fr)",
            gap: isMobile ? 32 : 52,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 32,
                padding: "0 12px",
                borderRadius: 999,
                border: `1px solid ${T.cyanMid}`,
                background: T.cyanDim,
                color: T.cyan,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Contact
            </div>
            <h1
              style={{
                fontSize: isMobile ? 40 : 64,
                fontFamily: font.display,
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: "-0.05em",
                color: T.paper,
                marginBottom: 20,
              }}
            >
              Reach the RICON team.
            </h1>
            <p
              style={{
                fontSize: isMobile ? 17 : 19,
                color: T.mutedLight,
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              Send a talent onboarding request, partnership inquiry, press note, or general question. The right team will review it and follow up.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                ["Talent", "Profile verification, onboarding, and representative access."],
                ["B2B Partnership", "Licensing, API access, data feeds, and integrations."],
                ["Press", "Company background, quotes, and media requests."],
              ].map(([label, copy]) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px minmax(0, 1fr)",
                    gap: 12,
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      background: T.greenDim,
                      border: `1px solid ${T.green}`,
                    }}
                  >
                    <Icon name="check" size={16} color={T.green} />
                  </div>
                  <div>
                    <div style={{ color: T.paper, fontSize: 15, fontWeight: 800, marginBottom: 2 }}>
                      {label}
                    </div>
                    <p style={{ color: T.mutedLight, fontSize: 14, lineHeight: 1.65 }}>
                      {copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)), rgba(8,16,24,0.9)",
              boxShadow: T.shadow,
              padding: isMobile ? 20 : 28,
            }}
          >
            <h2 style={{ color: T.paper, fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
              Send a message
            </h2>
            <p style={{ color: T.mutedLight, fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
              Tell us who you are and what you need. This form validates locally for now and is ready to connect to a backend endpoint.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ color: T.paper, fontSize: 13, fontWeight: 800 }}>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  style={fieldStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ color: T.paper, fontSize: 13, fontWeight: 800 }}>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  style={fieldStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ color: T.paper, fontSize: 13, fontWeight: 800 }}>Inquiry type</span>
                <select
                  value={form.inquiryType}
                  onChange={(event) => updateField("inquiryType", event.target.value)}
                  style={fieldStyle}
                >
                  {INQUIRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ color: T.paper, fontSize: 13, fontWeight: 800 }}>Message</span>
                <textarea
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="How can the RICON team help?"
                  rows={6}
                  style={{
                    ...fieldStyle,
                    minHeight: 150,
                    padding: "14px 16px",
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                />
              </label>

              {feedback ? (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: `1px solid ${status === "success" ? T.green : T.orange}`,
                    background: status === "success" ? T.greenDim : T.orangeDim,
                    color: T.paper,
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  <Icon name={status === "success" ? "check" : "info"} size={16} color={status === "success" ? T.green : T.orange} />
                  {feedback}
                </div>
              ) : null}

              <Btn style={{ width: "100%" }}>
                Send Message <Icon name="arrow" size={16} />
              </Btn>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
