"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import TalentPortal from "@/src/views/TalentPortal.jsx";

export default function PortalReviewRoute() {
  return (
    <SiteFrame page="talent-review">
      {({ nav, viewport }) => (
        <TalentPortal section="talent-review" nav={nav} viewport={viewport} />
      )}
    </SiteFrame>
  );
}
