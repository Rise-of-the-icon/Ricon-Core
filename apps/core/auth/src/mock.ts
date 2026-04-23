import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

import { getDashboardForRole } from "./routes";
import { normalizeRole } from "./role";
import type { AppRole } from "./types";

export const MOCK_AUTH_COOKIE = "ricon_mock_auth";

interface ReadableCookieStore {
  get(name: string): { value: string } | undefined;
}

interface MockSession {
  email: string;
  role: AppRole;
}

function toBase64(value: string) {
  return value.replace(/-/g, "+").replace(/_/g, "/");
}

function toBase64Url(value: string) {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  const normalized = toBase64(value);
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf8");
}

function encodeBase64Url(value: string): string {
  if (typeof btoa === "function") {
    return toBase64Url(btoa(value));
  }

  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeMockCookie(value: string | undefined): MockSession | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = JSON.parse(decodeBase64Url(value));
    const role = normalizeRole(decoded.role);
    const email = typeof decoded.email === "string" ? decoded.email : null;

    if (!role || !email) {
      return null;
    }

    return {
      email,
      role,
    };
  } catch {
    return null;
  }
}

function encodeMockCookie(session: MockSession): string {
  return encodeBase64Url(JSON.stringify(session));
}

export function createMockUser(session: MockSession): User {
  const now = new Date().toISOString();

  return {
    id: `mock-${session.role}`,
    app_metadata: {
      provider: "email",
      providers: ["email"],
      role: session.role,
    },
    aud: "authenticated",
    confirmed_at: now,
    created_at: now,
    email: session.email,
    email_confirmed_at: now,
    identities: [],
    last_sign_in_at: now,
    phone: "",
    role: "authenticated",
    updated_at: now,
    user_metadata: {
      role: session.role,
    },
  } as User;
}

export function getMockSessionFromRequestCookies(
  cookieStore: ReadableCookieStore,
): MockSession | null {
  return decodeMockCookie(cookieStore.get(MOCK_AUTH_COOKIE)?.value);
}

export function getMockSessionFromResponseCookies(
  cookieStore: ReadableCookieStore,
): MockSession | null {
  return decodeMockCookie(cookieStore.get(MOCK_AUTH_COOKIE)?.value);
}

export async function getMockServerAuthState() {
  const cookieStore = await cookies();
  const session = getMockSessionFromResponseCookies(cookieStore);

  if (!session) {
    return {
      role: null,
      user: null,
    };
  }

  return {
    role: session.role,
    user: createMockUser(session),
  };
}

export async function signInWithMockRole(input: {
  email: string;
  password: string;
  role?: AppRole | null;
}) {
  if (!input.email || !input.password) {
    return {
      error: "Email and password are required.",
      redirectTo: null,
      role: null,
      user: null,
    };
  }

  const role = input.role ?? normalizeRole(input.email.split("+")[1]?.split("@")[0]) ?? "talent";
  const session = {
    email: input.email,
    role,
  };
  const cookieStore = await cookies();

  cookieStore.set(MOCK_AUTH_COOKIE, encodeMockCookie(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    error: null,
    redirectTo: getDashboardForRole(role),
    role,
    user: createMockUser(session),
  };
}

export async function clearMockAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(MOCK_AUTH_COOKIE);
}
