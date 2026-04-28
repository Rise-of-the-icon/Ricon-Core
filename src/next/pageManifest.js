const PAGE_DEFINITIONS = {
  home: {
    id: "home",
    title: "Home",
    route: "/",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  talent: {
    id: "talent",
    title: "Talent Directory",
    route: "/talent",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  "talent-profile": {
    id: "talent-profile",
    title: "Talent Profile",
    route: "/talent/[talentId]",
    figmaSection: "profiles",
    exportable: true,
    visibility: "public",
  },
  api: {
    id: "api",
    title: "API",
    route: "/api",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  about: {
    id: "about",
    title: "About",
    route: "/about",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  mission: {
    id: "mission",
    title: "Mission",
    route: "/mission",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  "how-it-works": {
    id: "how-it-works",
    title: "How It Works",
    route: "/how-it-works",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  contact: {
    id: "contact",
    title: "Contact",
    route: "/contact",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  security: {
    id: "security",
    title: "Security",
    route: "/security",
    figmaSection: "trust",
    exportable: true,
    visibility: "public",
  },
  privacy: {
    id: "privacy",
    title: "Privacy",
    route: "/privacy",
    figmaSection: "legal",
    exportable: true,
    visibility: "public",
  },
  terms: {
    id: "terms",
    title: "Terms",
    route: "/terms",
    figmaSection: "legal",
    exportable: true,
    visibility: "public",
  },
  licensing: {
    id: "licensing",
    title: "Licensing",
    route: "/licensing",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  "data-licensing": {
    id: "data-licensing",
    title: "Data Licensing",
    route: "/data-licensing",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  "digital-experiences": {
    id: "digital-experiences",
    title: "Digital Experiences",
    route: "/digital-experiences",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  "gaming-ai": {
    id: "gaming-ai",
    title: "Gaming and AI",
    route: "/gaming-ai",
    figmaSection: "marketing",
    exportable: true,
    visibility: "public",
  },
  "talent-apply": {
    id: "talent-apply",
    title: "Apply as Talent",
    route: "/apply/talent",
    figmaSection: "acquisition",
    exportable: true,
    visibility: "public",
  },
  "api-access": {
    id: "api-access",
    title: "API Access",
    route: "/developers/api-access",
    figmaSection: "acquisition",
    exportable: true,
    visibility: "public",
  },
  "sign-in": {
    id: "sign-in",
    title: "Sign In",
    route: "/sign-in",
    figmaSection: "auth",
    exportable: true,
    visibility: "public",
  },
  "sign-up": {
    id: "sign-up",
    title: "Sign Up",
    route: "/sign-up",
    figmaSection: "auth",
    exportable: true,
    visibility: "public",
  },
  "forgot-password": {
    id: "forgot-password",
    title: "Forgot Password",
    route: "/forgot-password",
    figmaSection: "auth",
    exportable: true,
    visibility: "public",
  },
  "talent-dash": {
    id: "talent-dash",
    title: "Portal Dashboard",
    route: "/portal",
    figmaSection: "portal",
    exportable: true,
    visibility: "protected",
  },
  "talent-review": {
    id: "talent-review",
    title: "Portal Review",
    route: "/portal/review",
    figmaSection: "portal",
    exportable: true,
    visibility: "protected",
  },
  "talent-earnings": {
    id: "talent-earnings",
    title: "Portal Earnings",
    route: "/portal/earnings",
    figmaSection: "portal",
    exportable: true,
    visibility: "protected",
  },
  "talent-settings": {
    id: "talent-settings",
    title: "Portal Settings",
    route: "/portal/settings",
    figmaSection: "portal",
    exportable: true,
    visibility: "protected",
  },
  "admin-dashboard": {
    id: "admin-dashboard",
    title: "Admin Dashboard",
    route: "/admin/dashboard",
    figmaSection: "operations",
    exportable: true,
    visibility: "protected",
  },
  workspace: {
    id: "workspace",
    title: "Research Workspace",
    route: "/workspace",
    figmaSection: "operations",
    exportable: true,
    visibility: "protected",
  },
  review: {
    id: "review",
    title: "Review Dashboard",
    route: "/review",
    figmaSection: "operations",
    exportable: true,
    visibility: "protected",
  },
};

export const PAGE_MANIFEST = Object.values(PAGE_DEFINITIONS);

export function getPageDefinition(page) {
  return PAGE_DEFINITIONS[page] ?? null;
}

export function buildPageHref(page, routeParams = {}) {
  const definition = getPageDefinition(page);

  if (!definition) {
    return "/";
  }

  return definition.route.replace(/\[([^\]]+)\]/g, (_match, key) => {
    const value = routeParams[key];
    return value == null ? `[${key}]` : encodeURIComponent(String(value));
  });
}

export function getPageTrackingPayload(page, routeParams = {}) {
  const definition = getPageDefinition(page);

  if (!definition) {
    return {
      id: page,
      title: page,
      route: "/",
      resolvedRoute: "/",
      figmaFrame: `ricon-${page}`,
      exportable: false,
      visibility: "unknown",
    };
  }

  return {
    ...definition,
    resolvedRoute: buildPageHref(page, routeParams),
    figmaFrame: `ricon-${definition.id}`,
    routeParams,
  };
}
