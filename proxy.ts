import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIES } from "@/lib/api/cookies";
import { API } from "@/lib/api/routes";

const PUBLIC_PAGE_PATHS = ["/auth", "/products"];
const PUBLIC_API_PATHS = [API.LOGIN, API.SIGN_UP];

function isPathPublic(pathname: string, publicPaths: string[]) {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPathPublic(pathname, PUBLIC_PAGE_PATHS)) {
    return NextResponse.next();
  }

  const hasAccessToken = request.cookies.has(AUTH_COOKIES.ACCESS_TOKEN);

  if (pathname.startsWith("/api/")) {
    if (isPathPublic(pathname, PUBLIC_API_PATHS) || hasAccessToken) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { message: "Authentication is required." },
      { status: 401 },
    );
  }

  if (hasAccessToken) {
    return NextResponse.next();
  }

  const authUrl = new URL("/auth", request.url);
  authUrl.searchParams.set(
    "callbackUrl",
    `${pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(authUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
