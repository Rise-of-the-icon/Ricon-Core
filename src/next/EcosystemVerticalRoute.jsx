"use client";

import { Suspense, lazy } from "react";

import RouteFallback from "@/src/components/feedback/RouteFallback.jsx";

import SiteFrame from "./SiteFrame.jsx";

const EcosystemVerticalPage = lazy(() => import("../views/EcosystemVerticalPage.jsx"));

export default function EcosystemVerticalRoute({ page }) {
  return (
    <SiteFrame page={page}>
      {({ viewport }) => (
        <Suspense fallback={<RouteFallback viewport={viewport} lines={5} />}>
          <EcosystemVerticalPage page={page} viewport={viewport} />
        </Suspense>
      )}
    </SiteFrame>
  );
}
