"use client";

import { useActionState, useRef, useState } from "react";

import { T, font } from "@/src/config/theme.js";
import { Btn, Icon } from "@/src/components/ui.jsx";

import { signInAction } from "@/app/sign-in/actions";

const initialState = {
  error: null,
};

function SubmitButton({ pending }) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        minHeight: 52,
        padding: "0 16px",
        borderRadius: 16,
        border: "1px solid transparent",
        background: pending ? T.cyanMid : T.brandGradient,
        color: T.paper,
        fontWeight: 800,
        cursor: pending ? "wait" : "pointer",
        boxShadow: T.shadowSm,
      }}
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

const mockProfiles = [
  { email: "admin@ricon.local", label: "Admin", password: "password123", role: "admin" },
  { email: "researcher@ricon.local", label: "Researcher", password: "password123", role: "researcher" },
  { email: "editor@ricon.local", label: "Editor", password: "password123", role: "editor" },
  { email: "talent@ricon.local", label: "Talent", password: "password123", role: "talent" },
];

export default function SignInForm({ isMockMode = false, nextPath = null }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const formRef = useRef(null);

  function applyMockProfile(profile) {
    const form = formRef.current;
    if (!form) {
      return;
    }

    form.elements.email.value = profile.email;
    form.elements.password.value = profile.password;
    form.elements.role.value = profile.role;
  }

  return (
    <form ref={formRef} action={formAction} style={{ display: "grid", gap: 16 }}>
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <input type="hidden" name="remember" value={rememberMe ? "1" : "0"} />

      {isMockMode ? (
        <div
          style={{
            padding: "16px",
            borderRadius: 18,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
            boxShadow: T.shadowSm,
          }}
        >
          <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: T.paperDim, marginBottom: 10 }}>
            Mock profiles
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {mockProfiles.map((profile) => (
              <button
                key={profile.role}
                type="button"
                onClick={() => applyMockProfile(profile)}
                style={{
                  minHeight: 38,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: `1px solid ${T.border}`,
                  background: T.panel,
                  color: T.paperDim,
                  cursor: "pointer",
                }}
              >
                {profile.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: T.paper, fontFamily: font.body, fontSize: 13, fontWeight: 700 }}>
          Email
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          style={{
            width: "100%",
            minHeight: 52,
            padding: "12px 16px",
            borderRadius: 16,
            border: `1px solid ${T.border}`,
            background: T.ink,
            color: T.paper,
          }}
        />
      </label>

      {isMockMode ? (
        <label style={{ display: "grid", gap: 8 }}>
          <span style={{ color: T.paper, fontFamily: font.body, fontSize: 13, fontWeight: 700 }}>
            Role
          </span>
          <select
            name="role"
            defaultValue="talent"
            style={{
              width: "100%",
              minHeight: 52,
              padding: "12px 16px",
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              background: T.ink,
              color: T.paper,
            }}
          >
            <option value="talent">Talent</option>
            <option value="admin">Admin</option>
            <option value="researcher">Researcher</option>
            <option value="editor">Editor</option>
          </select>
          <div style={{ fontSize: 12, color: T.mutedLight, lineHeight: 1.6 }}>
            Default role is Talent. Choose a different role only if you are testing a specific dashboard path.
          </div>
        </label>
      ) : (
        <div
          style={{
            padding: "16px",
            borderRadius: 18,
            border: `1px solid ${T.border}`,
            background: `linear-gradient(180deg, ${T.panelStrong}, ${T.panel}), ${T.inkLight}`,
            color: T.paperDim,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Your role is assigned by account configuration. Most new accounts start in the Talent flow and can request other permissions later.
        </div>
      )}

      <label style={{ display: "grid", gap: 8 }}>
        <span style={{ color: T.paper, fontFamily: font.body, fontSize: 13, fontWeight: 700 }}>
          Password
        </span>
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
            autoComplete="current-password"
            required
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: T.paper,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              border: "none",
              background: "transparent",
              color: T.paperDim,
              cursor: "pointer",
            }}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} size={16} color={T.paperDim} />
          </button>
        </div>
      </label>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.paperDim, fontSize: 13 }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember me
        </label>
        <a href="/forgot-password" style={{ color: T.cyan, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Forgot password?
        </a>
      </div>

      <div style={{ fontSize: 12, color: T.mutedLight, lineHeight: 1.6 }}>
        Sessions are retained for 30 days on trusted devices when “Remember me” is enabled.
      </div>

      {state.error ? (
        <div
          role="alert"
          aria-live="polite"
          style={{
            padding: "16px",
            borderRadius: 16,
            border: `1px solid ${T.orange}`,
            background: T.orangeDim,
            color: T.paper,
            fontSize: 13,
            boxShadow: T.shadowSm,
          }}
        >
          {state.error}
        </div>
      ) : null}

      {isMockMode ? (
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
          Any non-empty email and password will work in mock mode. The selected role controls which dashboard the middleware sends you to.
        </div>
      ) : null}

      <SubmitButton pending={pending} />

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ fontSize: 13, color: T.paperDim, textAlign: "center" }}>
          New to RICON?
        </div>
        <Btn href="/sign-up" variant="outline" style={{ width: "100%" }}>
          Create account
        </Btn>
      </div>
    </form>
  );
}
