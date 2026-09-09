import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "medcore-hms-jwt-secret-key-change-in-production-2026";
const secret = new TextEncoder().encode(JWT_SECRET_KEY);
const AUTH_COOKIE_NAME = "medcore-auth-token";

// Routes that require authentication (any role)
const PROTECTED_ROUTES = ["/app", "/admin"];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password"];

// Role-restricted routes: only specific roles can access
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  "/admin": ["hospital_admin", "super_admin"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Check if accessing a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if accessing an auth route (login, forgot-password, etc.)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Verify JWT if token exists
  let isValidToken = false;
  let tokenPayload: { role?: string } = {};
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      isValidToken = true;
      tokenPayload = payload as { role?: string };
    } catch {
      // Token is invalid or expired
      isValidToken = false;
    }
  }

  // Protected route: redirect to login if not authenticated
  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    const response = NextResponse.redirect(loginUrl);

    // Clear invalid token cookie if present
    if (token) {
      response.cookies.set(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
    }

    return response;
  }

  // ─── ROLE-BASED ACCESS CONTROL ─────────────────────────────
  // Check if the route has role restrictions
  if (isValidToken && tokenPayload.role) {
    for (const [route, allowedRoles] of Object.entries(ROLE_RESTRICTED_ROUTES)) {
      if (pathname === route || pathname.startsWith(route + "/")) {
        if (!allowedRoles.includes(tokenPayload.role)) {
          // User is authenticated but doesn't have the right role
          // Redirect to /app (their own dashboard) with an access-denied flag
          const dashboardUrl = new URL("/app", request.url);
          dashboardUrl.searchParams.set("access_denied", "1");
          return NextResponse.redirect(dashboardUrl);
        }
      }
    }
  }

  // Auth routes: redirect to dashboard if already authenticated
  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Prevent caching of protected pages
  if (isProtectedRoute) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
