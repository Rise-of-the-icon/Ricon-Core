"use client";

import { useMemo, useState } from "react";

import { T, font } from "../config/theme.js";
import StandalonePageNav from "../components/StandalonePageNav.jsx";
import { Btn, Icon } from "../components/ui.jsx";

const strengthFor = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: "Weak", color: T.orange, width: "25%" };
  if (score === 2) return { label: "Fair", color: T.orange, width: "50%" };
  if (score === 3) return { label: "Good", color: T.cyan, width: "75%" };
  return { label: "Strong", color: T.green, width: "100%" };
};

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const strength = useMemo(() => strengthFor(password), [password]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 16px",
        background:
          "radial-gradient(circle at top right, rgba(124,131,255,0.18), transparent 32%), linear-gradient(180deg, rgba(8,16,24,1) 0%, rgba(16,25,39,1) 100%)",
      }}
    >
      <StandalonePageNav minimal />
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 32,
          borderRadius: 28,
          border: `1px solid ${T.border}`,
          background: "rgba(8,16,24,0.94)",
          boxShadow: T.shadow,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.cyan, marginBottom: 10 }}>
            Create account
          </div>
          <h1 style={{ fontSize: 38, lineHeight: 1.02, fontWeight: 800, color: T.paper, fontFamily: font.display, marginBottom: 14 }}>
            Join RICON
          </h1>
          <p style={{ color: T.mutedLight, fontSize: 15, lineHeight: 1.8 }}>
            Start with the Talent role by default. We will send a verification email before your account becomes active.
          </p>
        </div>

        {!submitted ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            style={{ display: "grid", gap: 16 }}
          >
            <Field label="Name">
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                style={fieldInput}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                style={fieldInput}
              />
            </Field>
            <Field label="Role">
              <select name="role" defaultValue="talent" style={fieldInput}>
                <option value="talent">Talent</option>
                <option value="fan">Fan</option>
                <option value="developer">Developer</option>
              </select>
              <div style={{ fontSize: 12, color: T.mutedLight, lineHeight: 1.6 }}>
                Most new accounts should start as Talent. Choose another role only if you are signing up for a different workflow.
              </div>
            </Field>
            <Field label="Password">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 52,
                  padding: "0 16px",
                  borderRadius: 16,
                  border: `1px solid ${T.border}`,
                  background: T.ink,
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  style={{ ...fieldInput, border: "none", padding: 0 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{ border: "none", background: "transparent", color: T.paperDim, cursor: "pointer" }}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={16} color={T.paperDim} />
                </button>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ height: 8, borderRadius: 999, background: T.inkMid, overflow: "hidden" }}>
                  <div style={{ width: strength.width, height: "100%", background: strength.color }} />
                </div>
                <div style={{ fontSize: 12, color: T.mutedLight }}>
                  Password strength: <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </div>
              </div>
            </Field>

            <Btn variant="primary" style={{ width: "100%" }}>
              Create account
            </Btn>
          </form>
        ) : (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: "18px",
              borderRadius: 18,
              border: `1px solid ${T.green}`,
              background: T.greenDim,
              color: T.paper,
              lineHeight: 1.8,
            }}
          >
            Verification email sent. Check your inbox for the activation link before signing in.
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <Btn href="/sign-in" variant="outline" style={{ width: "100%" }}>
            Already have an account? Sign in
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ color: T.paper, fontSize: 13, fontWeight: 700 }}>{label}</span>
      {children}
    </label>
  );
}

const fieldInput = {
  width: "100%",
  minHeight: 52,
  padding: "0 16px",
  borderRadius: 16,
  border: `1px solid ${T.border}`,
  background: T.ink,
  color: T.paper,
};
