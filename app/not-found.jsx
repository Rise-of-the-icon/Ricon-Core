"use client";

import SiteFrame from "@/src/next/SiteFrame.jsx";
import { T, font } from "@/src/config/theme.js";
import { Btn, Icon } from "@/src/components/ui.jsx";

export default function NotFound() {
  return (
    <SiteFrame page="not-found">
      {({ viewport }) => {
        const isMobile = viewport.isMobile;

        return (
          <section
            style={{
              maxWidth: 960,
              margin: "0 auto",
              minHeight: "62vh",
              display: "grid",
              placeItems: "center",
              padding: isMobile ? "72px 16px" : "104px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 72,
                  height: 72,
                  borderRadius: 24,
                  background: T.cyanDim,
                  border: `1px solid ${T.cyanMid}`,
                  marginBottom: 24,
                }}
              >
                <Icon name="search" size={28} color={T.cyan} />
              </div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: T.cyan,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Custom 404
              </p>
              <h1
                style={{
                  fontSize: isMobile ? 40 : 64,
                  fontFamily: font.display,
                  fontWeight: 900,
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                  color: T.paper,
                  marginBottom: 18,
                }}
              >
                This page is not in the verified record.
              </h1>
              <p
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: T.mutedLight,
                  lineHeight: 1.75,
                  marginBottom: 30,
                }}
              >
                The route may have moved, or the page may not exist yet. Return home to continue exploring RICON.
              </p>
              <Btn href="/" style={{ minWidth: isMobile ? "100%" : 180 }}>
                Back to Home
              </Btn>
            </div>
          </section>
        );
      }}
    </SiteFrame>
  );
}
