"use client";

import { resolveRouteForPage } from "./routes.js";

export function useAppNavigation() {
  return (target, id) => {
    const pathname = resolveRouteForPage(target, id);

    if (typeof window !== "undefined") {
      window.location.assign(pathname);
    }
  };
}
