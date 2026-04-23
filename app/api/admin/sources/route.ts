import { NextResponse } from "next/server";

import { requireAdminAccess } from "@/apps/core/admin/repository";
import { getSourceCitationDatabase } from "@/apps/core/sources/repository";

export async function GET(request: Request) {
  const access = await requireAdminAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const checkBrokenLinks = url.searchParams.get("checkBrokenLinks") === "1";
    const sources = await getSourceCitationDatabase({ checkBrokenLinks });
    return NextResponse.json({ sources });
  } catch {
    return NextResponse.json(
      { error: "Unable to load source citation database." },
      { status: 500 },
    );
  }
}
