import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import {
  verifyPassword,
  createToken,
  setAuthCookie,
  checkRateLimit,
  recordLoginAttempt,
  AUTH_COOKIE_NAME,
} from "@/lib/auth";

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // ─── Input Validation ────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid input format." },
        { status: 400 }
      );
    }

    // Sanitize email
    const cleanEmail = email.trim().toLowerCase();

    // ─── Rate Limiting ───────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(db, ip, cleanEmail);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again after ${rateLimit.lockoutMinutes} minutes.`,
        },
        { status: 429 }
      );
    }

    // ─── Find User ───────────────────────────────────────────
    const user = db.prepare(`
      SELECT id, name, email, password_hash, role, status
      FROM users
      WHERE email = ?
    `).get(cleanEmail) as UserRow | undefined;

    // Generic error message (don't reveal if email exists)
    if (!user) {
      recordLoginAttempt(db, ip, cleanEmail, false);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check account status
    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact the hospital administrator." },
        { status: 403 }
      );
    }

    // ─── Verify Password ────────────────────────────────────
    const passwordValid = await verifyPassword(password, user.password_hash);

    if (!passwordValid) {
      recordLoginAttempt(db, ip, cleanEmail, false);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ─── Success: Create JWT & Set Cookie ───────────────────
    recordLoginAttempt(db, ip, cleanEmail, true);

    // Update last_login
    const token = await createToken(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      rememberMe === true
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    const maxAge = rememberMe === true ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
