"use client";

import ApiPage from "@/src/views/ApiPage.jsx";
import SiteFrame from "@/src/next/SiteFrame.jsx";

export default function ApiRoute() {
  return (
    <SiteFrame page="api">
      {({ viewport }) => <ApiPage viewport={viewport} />}
    </SiteFrame>
  );
}
