"use client";

import HowItWorksPage from "@/src/views/HowItWorksPage.jsx";
import SiteFrame from "@/src/next/SiteFrame.jsx";

export default function HowItWorksRoute() {
  return (
    <SiteFrame page="how-it-works">
      {({ viewport }) => <HowItWorksPage viewport={viewport} />}
    </SiteFrame>
  );
}
