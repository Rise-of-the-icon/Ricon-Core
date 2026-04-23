import { NextResponse } from "next/server";

import { clearMockAuthCookie } from "@/apps/core/auth";

export async function POST() {
  await clearMockAuthCookie();
  return NextResponse.json({ ok: true });
}
