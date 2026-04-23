import { NextResponse } from "next/server";

import {
  getMissionControlPayload,
  requireAdminAccess,
} from "@/apps/core/admin/repository";

export async function GET() {
  try {
    const access = await requireAdminAccess();
    if (!access) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await getMissionControlPayload();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Unable to load mission control data." },
      { status: 500 },
    );
  }
}
