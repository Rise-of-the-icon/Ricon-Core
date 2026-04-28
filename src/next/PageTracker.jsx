"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

import { PAGE_MANIFEST, getPageTrackingPayload } from "./pageManifest.js";

function registerPageVisit(payload) {
  if (typeof window === "undefined") {
    return;
  }

  window.__RICON_PAGE_MANIFEST__ = PAGE_MANIFEST;
  window.__RICON_CURRENT_PAGE__ = payload;

  const history = Array.isArray(window.__RICON_PAGE_HISTORY__)
    ? window.__RICON_PAGE_HISTORY__
    : [];
  const previous = history[history.length - 1];

  if (!previous || previous.resolvedRoute !== payload.resolvedRoute) {
    window.__RICON_PAGE_HISTORY__ = [...history, payload];
  }

  window.dispatchEvent(
    new CustomEvent("ricon:page-track", {
      detail: payload,
    }),
  );
}

export default function PageTracker({ children, page, routeParams = {} }) {
  const pathname = usePathname();
  const routeParamsKey = JSON.stringify(routeParams);
  const tracking = useMemo(
    () => getPageTrackingPayload(page, routeParams),
    [page, routeParamsKey],
  );

  useEffect(() => {
    const payload = {
      ...tracking,
      pathname: pathname ?? tracking.resolvedRoute,
      trackedAt: new Date().toISOString(),
    };

    document.documentElement.dataset.riconPage = tracking.id;
    document.documentElement.dataset.riconSection = tracking.figmaSection;
    document.documentElement.dataset.riconVisibility = tracking.visibility;
    registerPageVisit(payload);

    return () => {
      if (document.documentElement.dataset.riconPage === tracking.id) {
        delete document.documentElement.dataset.riconPage;
        delete document.documentElement.dataset.riconSection;
        delete document.documentElement.dataset.riconVisibility;
      }
    };
  }, [pathname, tracking]);

  return (
    <div
      data-ricon-page={tracking.id}
      data-ricon-page-title={tracking.title}
      data-ricon-page-route={tracking.route}
      data-ricon-page-path={tracking.resolvedRoute}
      data-ricon-page-section={tracking.figmaSection}
      data-ricon-page-visibility={tracking.visibility}
      data-ricon-figma-frame={tracking.figmaFrame}
      data-ricon-exportable={tracking.exportable ? "true" : "false"}
      style={{ minHeight: "100%" }}
    >
      <div aria-hidden="true" data-ricon-page-config={JSON.stringify(tracking)} hidden />
      {children}
    </div>
  );
}
