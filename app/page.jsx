"use client";

import HomePage from "@/src/views/HomePage.jsx";
import SiteFrame from "@/src/next/SiteFrame.jsx";

export default function HomeRoute() {
  return (
    <SiteFrame page="home">
      {({ nav, viewport }) => <HomePage nav={nav} viewport={viewport} />}
    </SiteFrame>
  );
}
