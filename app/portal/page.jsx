"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import TalentPortal from "@/src/views/TalentPortal.jsx";

export default function PortalDashboardRoute() {
  return (
    <SiteFrame page="talent-dash">
      {({ nav, viewport }) => (
        <TalentPortal section="talent-dash" nav={nav} viewport={viewport} />
      )}
    </SiteFrame>
  );
}
