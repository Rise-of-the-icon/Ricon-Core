"use client";

import { useState } from "react";

import { T, font } from "../config/theme.js";
import StandalonePageNav from "../components/StandalonePageNav.jsx";
import { Btn } from "../components/ui.jsx";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

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
          maxWidth: 460,
          padding: 32,
          borderRadius: 28,
          border: `1px solid ${T.border}`,
          background: "rgba(8,16,24,0.94)",
          boxShadow: T.shadow,
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: T.cyan, marginBottom: 10 }}>
            Password reset
          </div>
          <h1 style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 800, color: T.paper, fontFamily: font.display, marginBottom: 12 }}>
            Reset your password
          </h1>
          <p style={{ color: T.mutedLight, lineHeight: 1.8 }}>
            Enter the email linked to your RICON account and we will send a password reset link.
          </p>
        </div>

        {!sent ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            style={{ display: "grid", gap: 16 }}
          >
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ color: T.paper, fontSize: 13, fontWeight: 700 }}>Email</span>
              <input
                type="email"
                required
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
            <Btn variant="primary" style={{ width: "100%" }}>
              Send reset link
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
            Reset email sent. Check your inbox for the password reset link.
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Btn href="/sign-in" variant="outline" style={{ width: "100%" }}>
            Back to sign in
          </Btn>
        </div>
      </div>
    </div>
  );
}
