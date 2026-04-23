"use client";

import ContactPage from "@/src/views/ContactPage.jsx";
import SiteFrame from "@/src/next/SiteFrame.jsx";

export default function ContactRoute() {
  return (
    <SiteFrame page="contact">
      {({ viewport }) => <ContactPage viewport={viewport} />}
    </SiteFrame>
  );
}
