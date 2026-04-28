"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import AppShell from "@/src/components/layout/AppShell.jsx";
import { useViewport } from "@/src/hooks/useViewport.js";

import PageTracker from "./PageTracker.jsx";
import { getPageDefinition } from "./pageManifest.js";
import { toAbsoluteUrl } from "./seo.js";
import { useAppNavigation } from "./useAppNavigation.js";

export default function SiteFrame({ children, page, routeParams }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const viewport = useViewport();
  const nav = useAppNavigation();
  const pathname = usePathname();
  const isPortal = page.startsWith("talent-");
  const pageDefinition = getPageDefinition(page);
  const shouldRenderCanonical = pageDefinition?.visibility === "public";
  const canonicalHref = toAbsoluteUrl(pathname || "/");

  useEffect(() => {
    if (!shouldRenderCanonical) {
      return;
    }

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }

    link.setAttribute("href", canonicalHref);
  }, [canonicalHref, shouldRenderCanonical]);

  return (
    <PageTracker page={page} routeParams={routeParams}>
      <AppShell
        page={page}
        nav={nav}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        isPortal={isPortal}
        showCompactNav={viewport.isTablet}
        viewport={viewport}
      >
        {children({ nav, viewport })}
      </AppShell>
    </PageTracker>
  );
}
