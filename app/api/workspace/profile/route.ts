import { NextResponse } from "next/server";

import { requireResearcherAccess } from "@/apps/core/workspace/auth";
import {
  createWorkspaceProfile,
  getWorkspacePayload,
  saveWorkspacePayload,
} from "@/apps/core/workspace/repository";
import type { ResearchProfile } from "@/apps/core/workspace/types";

export async function GET(request: Request) {
  const access = await requireResearcherAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const profileId = url.searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  const payload = await getWorkspacePayload(profileId, access.researcherId, access.user);

  if (!payload) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const access = await requireResearcherAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { name?: string; slug?: string };
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: "Player name is required" }, { status: 400 });
  }

  try {
    const payload = await createWorkspaceProfile(
      { name: body.name.trim(), slug: body.slug },
      access.researcherId,
      access.user,
    );
    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start onboarding.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const access = await requireResearcherAccess();

  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { profile?: ResearchProfile };

  if (!body.profile) {
    return NextResponse.json({ error: "Missing profile payload" }, { status: 400 });
  }

  const payload = await saveWorkspacePayload(body.profile, access.researcherId, access.user);

  return NextResponse.json(payload);
}
