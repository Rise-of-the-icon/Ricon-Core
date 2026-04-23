"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import TalentProfile from "@/src/views/TalentProfile.jsx";

export default function TalentProfileRoute({ params }) {
  return (
    <SiteFrame page="talent-profile" routeParams={{ talentId: params.talentId }}>
      {({ viewport }) => (
        <TalentProfile talentId={Number(params.talentId)} viewport={viewport} />
      )}
    </SiteFrame>
  );
}
