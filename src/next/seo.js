const DEFAULT_SITE_URL = "http://localhost:3000";

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (!envUrl) {
    return DEFAULT_SITE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(envUrl) ? envUrl : `https://${envUrl}`;
  return trimTrailingSlash(withProtocol);
}

export function toAbsoluteUrl(pathname = "/") {
  const baseUrl = getSiteUrl();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${baseUrl}${normalizedPath}`;
}
