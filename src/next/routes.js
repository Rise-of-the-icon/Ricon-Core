import { buildPageHref } from "./pageManifest.js";

export function resolveRouteForPage(page, id) {
  if (page === "sign-in-switch") {
    return "/sign-in?switch=1";
  }

  if (page === "portal") {
    return "/portal";
  }

  if (page === "talent-profile") {
    return buildPageHref(page, { talentId: id ?? 1 });
  }

  return buildPageHref(page);
}
