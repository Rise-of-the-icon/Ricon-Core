"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import TalentPortal from "@/src/views/TalentPortal.jsx";

export default function PortalEarningsRoute() {
  return (
    <SiteFrame page="talent-earnings">
      {({ nav, viewport }) => (
        <TalentPortal section="talent-earnings" nav={nav} viewport={viewport} />
      )}
    </SiteFrame>
  );
}
