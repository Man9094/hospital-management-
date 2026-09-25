import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET || "medcore-hms-jwt-secret-key-change-in-production-2026";
const secret = new TextEncoder().encode(JWT_SECRET_KEY);
const AUTH_COOKIE_NAME = "medcore-auth-token";

// Routes that require authentication (any role)
const PROTECTED_ROUTES = ["/app"];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password"];

// Admin restricted roles
const ADMIN_ALLOWED_ROLES = ["hospital_admin", "super_admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Check if accessing a protected client route (/app)
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if accessing /admin or admin subroutes
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminSubRoute = pathname.startsWith("/admin/");

  // Check if accessing an auth route (login, forgot-password, etc.)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Verify JWT if token exists
  let isValidToken = false;
  let tokenPayload: { role?: string; userId?: number; email?: string } = {};
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      isValidToken = true;
      tokenPayload = payload as { role?: string; userId?: number; email?: string };
    } catch {
      // Token is invalid or expired
      isValidToken = false;
    }
  }

  // 1. Unauthenticated access to /admin:
  // /admin directly renders its own Admin Login Page — DO NOT REDIRECT to /login or /app.
  // For deep subroutes like /admin/settings without auth, redirect to /admin.
  if (isAdminSubRoute && !isValidToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Protected client routes (/app): redirect to /login if unauthenticated
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

  // 3. Admin Route RBAC:
  // If user is authenticated, verify that their role has admin permission.
  // Non-admin roles (doctor, nurse, receptionist, patient, etc.) are strictly forbidden.
  if (isAdminRoute && isValidToken) {
    const userRole = tokenPayload.role || "";
    if (!ADMIN_ALLOWED_ROLES.includes(userRole)) {
      // Authenticated user lacks administrator privileges
      const dashboardUrl = new URL("/app", request.url);
      dashboardUrl.searchParams.set("access_denied", "1");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 4. Auth routes (/login, /forgot-password, etc.):
  // If already authenticated with a valid session, redirect to appropriate area
  if (isAuthRoute && isValidToken) {
    const userRole = tokenPayload.role || "";
    if (ADMIN_ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
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
