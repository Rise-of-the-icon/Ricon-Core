"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import TalentPortal from "@/src/views/TalentPortal.jsx";

export default function PortalSettingsRoute() {
  return (
    <SiteFrame page="talent-settings">
      {({ nav, viewport }) => (
        <TalentPortal section="talent-settings" nav={nav} viewport={viewport} />
      )}
    </SiteFrame>
  );
}
