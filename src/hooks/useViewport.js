import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../config/theme.js";

export function useViewport() {
  const getWidth = () =>
    typeof window === "undefined" ? 1280 : window.innerWidth;
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width < BREAKPOINTS.tablet;

  return {
    width,
    isMobile,
    isTablet,
    isTabletOnly: width >= BREAKPOINTS.mobile && isTablet,
    isDesktop: width >= BREAKPOINTS.tablet,
  };
}
