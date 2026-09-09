import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// ─── Constants ─────────────────────────────────────────────────
const JWT_SECRET_KEY = process.env.JWT_SECRET || "medcore-hms-jwt-secret-key-change-in-production-2026";
const secret = new TextEncoder().encode(JWT_SECRET_KEY);

export const AUTH_COOKIE_NAME = "medcore-auth-token";
const SALT_ROUNDS = 12;

// Session durations
const DEFAULT_SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// ─── Password Hashing ──────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Password Validation ───────────────────────────────────────
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ─── JWT Token Management ──────────────────────────────────────
export interface AuthTokenPayload extends JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export async function createToken(
  payload: { userId: number; email: string; name: string; role: string },
  rememberMe: boolean = false
): Promise<string> {
  const duration = rememberMe ? REMEMBER_ME_DURATION : DEFAULT_SESSION_DURATION;

  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + duration)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

// ─── Cookie Management ─────────────────────────────────────────
export async function setAuthCookie(token: string, rememberMe: boolean = false): Promise<void> {
  const maxAge = rememberMe ? REMEMBER_ME_DURATION : DEFAULT_SESSION_DURATION;

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

// ─── Get Current User from Cookie ──────────────────────────────
export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

// ─── Rate Limiting Helpers ─────────────────────────────────────
export function checkRateLimit(db: import("better-sqlite3").Database, ip: string, email: string): { allowed: boolean; remainingAttempts: number; lockoutMinutes: number } {
  const cutoff = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000).toISOString();

  const recentAttempts = db.prepare(`
    SELECT COUNT(*) as count FROM login_attempts
    WHERE (ip_address = ? OR email = ?)
    AND success = 0
    AND attempted_at > ?
  `).get(ip, email, cutoff) as { count: number };

  const remaining = MAX_LOGIN_ATTEMPTS - recentAttempts.count;

  return {
    allowed: recentAttempts.count < MAX_LOGIN_ATTEMPTS,
    remainingAttempts: Math.max(0, remaining),
    lockoutMinutes: LOCKOUT_DURATION_MINUTES,
  };
}

export function recordLoginAttempt(db: import("better-sqlite3").Database, ip: string, email: string, success: boolean): void {
  db.prepare(`
    INSERT INTO login_attempts (ip_address, email, success)
    VALUES (?, ?, ?)
  `).run(ip, email, success ? 1 : 0);

  // If successful, clear previous failed attempts for this email
  if (success) {
    db.prepare(`
      DELETE FROM login_attempts
      WHERE email = ? AND success = 0
    `).run(email);
  }
}

// ─── Reset Token Helpers ───────────────────────────────────────
export function generateResetToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
