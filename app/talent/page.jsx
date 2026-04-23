"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import TalentPage from "@/src/views/TalentPage.jsx";

export default function TalentRoute() {
  return (
    <SiteFrame page="talent">
      {({ nav, viewport }) => <TalentPage nav={nav} viewport={viewport} />}
    </SiteFrame>
  );
}
