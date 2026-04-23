"use server";

import { redirect } from "next/navigation";

import { getPostSignInPath, signInWithEmailPassword } from "@/apps/core/auth";

export async function signInAction(_previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const nextPath = formData.get("next");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      error: "Email and password are required.",
    };
  }

  const result = await signInWithEmailPassword({
    email,
    password,
    role: typeof role === "string" ? role : null,
  });

  if (result.error) {
    return {
      error: result.error,
    };
  }

  if (!result.role || !result.redirectTo) {
    return {
      error: "Your account is authenticated but has no assigned role.",
    };
  }

  redirect(
    getPostSignInPath(
      result.role,
      typeof nextPath === "string" ? nextPath : null,
    ),
  );
}
