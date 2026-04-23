import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { hasSupabaseEnv } from "./env";
import { getMockSessionFromRequestCookies } from "./mock";
import { resolveRoleFromClaims } from "./role";
import {
  defaultAuthRoutes,
  defaultPublicRoutes,
  defaultRouteRoleRules,
  getDashboardForRole,
  getPostSignInPath,
  getRequiredRolesForPathname,
  pathnameMatches,
} from "./routes";
import {
  copyResponseCookies,
  createMiddlewareSupabaseClient,
} from "./supabase/middleware";
import type { AuthMiddlewareOptions } from "./types";

function redirectTo(
  request: NextRequest,
  pathname: string,
  response: NextResponse,
): NextResponse {
  const url = new URL(pathname, request.url);
  return copyResponseCookies(response, NextResponse.redirect(url));
}

function redirectToLogin(
  request: NextRequest,
  loginPath: string,
  response: NextResponse,
): NextResponse {
  const url = new URL(loginPath, request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return copyResponseCookies(response, NextResponse.redirect(url));
}

export async function authMiddleware(
  request: NextRequest,
  options: AuthMiddlewareOptions = {},
) {
  const authRoutes = options.authRoutes ?? defaultAuthRoutes;
  const publicRoutes = options.publicRoutes ?? defaultPublicRoutes;
  const routeRoleRules = options.routeRoleRules ?? defaultRouteRoleRules;
  const loginPath = options.loginPath ?? "/sign-in";
  const isSupabaseEnabled = hasSupabaseEnv();

  const pathname = request.nextUrl.pathname;
  const requestedNextPath = request.nextUrl.searchParams.get("next");
  const allowRoleSwitch =
    !isSupabaseEnabled && request.nextUrl.searchParams.get("switch") === "1";
  const isAuthRoute = authRoutes.some((route) => pathnameMatches(pathname, route));
  const isPublicRoute = publicRoutes.some((route) =>
    pathnameMatches(pathname, route),
  );
  const requiredRoles = getRequiredRolesForPathname(pathname, routeRoleRules);

  if (!isAuthRoute && !requiredRoles && isPublicRoute) {
    return NextResponse.next();
  }

  if (!isSupabaseEnabled) {
    const session = getMockSessionFromRequestCookies(request.cookies);
    const isAuthenticated = Boolean(session);
    const role = session?.role ?? null;

    if (!isAuthenticated) {
      if (requiredRoles) {
        return redirectToLogin(request, loginPath, NextResponse.next());
      }

      return NextResponse.next();
    }

    if (isAuthRoute && !allowRoleSwitch) {
      return role
        ? redirectTo(
            request,
            getPostSignInPath(role, requestedNextPath),
            NextResponse.next(),
          )
        : NextResponse.next();
    }

    if (!requiredRoles) {
      return NextResponse.next();
    }

    if (!role) {
      return redirectToLogin(request, loginPath, NextResponse.next());
    }

    if (!requiredRoles.includes(role)) {
      return redirectTo(request, getDashboardForRole(role), NextResponse.next());
    }

    return NextResponse.next();
  }

  let response = NextResponse.next();
  let claims: Record<string, unknown> | null = null;
  let isAuthenticated = false;
  let role = null;

  try {
    const middlewareClient = createMiddlewareSupabaseClient(request);
    const { data } = await middlewareClient.supabase.auth.getClaims();

    claims = data?.claims ?? null;
    response = middlewareClient.getResponse();
    isAuthenticated = Boolean(claims?.sub);
    role = await resolveRoleFromClaims(
      claims ?? null,
      middlewareClient.supabase,
      options.roleResolver,
    );
  } catch {
    if (requiredRoles) {
      return redirectToLogin(request, loginPath, response);
    }

    if (isAuthRoute) {
      return response;
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (requiredRoles) {
      return redirectToLogin(request, loginPath, response);
    }

    return response;
  }

  if (isAuthRoute && !allowRoleSwitch) {
    if (!role) {
      return response;
    }

    return redirectTo(request, getPostSignInPath(role, requestedNextPath), response);
  }

  if (!requiredRoles) {
    return response;
  }

  if (!role) {
    return redirectToLogin(request, loginPath, response);
  }

  if (!requiredRoles.includes(role)) {
    return redirectTo(request, getDashboardForRole(role), response);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  return authMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/workspace/:path*",
    "/portal/:path*",
    "/login",
    "/sign-in",
  ],
};
