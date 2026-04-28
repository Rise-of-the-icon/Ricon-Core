"use client";

import { Suspense, lazy } from "react";

import RouteFallback from "@/src/components/feedback/RouteFallback.jsx";

import SiteFrame from "./SiteFrame.jsx";

const StaticPage = lazy(() => import("../views/StaticPage.jsx"));

export default function StaticRoute({ page }) {
  return (
    <SiteFrame page={page}>
      {({ viewport }) => (
        <Suspense fallback={<RouteFallback viewport={viewport} lines={4} />}>
          <StaticPage page={page} viewport={viewport} />
        </Suspense>
      )}
    </SiteFrame>
  );
}
