import type { MetadataRoute } from "next";

import { TALENT } from "@/src/data/siteData.js";
import { PAGE_MANIFEST } from "@/src/next/pageManifest.js";
import { toAbsoluteUrl } from "@/src/next/seo.js";

function isStaticPublicPage(route: string, visibility: string) {
  return visibility === "public" && !route.includes("[");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = PAGE_MANIFEST.filter((page) =>
    isStaticPublicPage(page.route, page.visibility),
  ).map((page) => ({
    url: toAbsoluteUrl(page.route),
    lastModified: now,
  }));

  const talentEntries = TALENT.map((talent) => ({
    url: toAbsoluteUrl(`/talent/${talent.id}`),
    lastModified: talent.lastUpdated?.iso ? new Date(talent.lastUpdated.iso) : now,
  }));

  return [...staticEntries, ...talentEntries];
}
