import { PAGE_MANIFEST } from "@/src/next/pageManifest.js";

export async function GET() {
  return Response.json({
    generatedAt: new Date().toISOString(),
    pages: PAGE_MANIFEST,
  });
}
