import { jwtVerify, type JWTPayload } from "jose";

// ─── Constants ─────────────────────────────────────────────────
// This must match the JWT_SECRET used by the Express backend.
// Both frontend middleware and backend must share the same secret
// so the frontend can verify tokens issued by the backend.
const JWT_SECRET_KEY = process.env.JWT_SECRET || "medcore_hms_jwt_secret_key_change_in_production_2026";
const secret = new TextEncoder().encode(JWT_SECRET_KEY);

export const AUTH_COOKIE_NAME = "medcore-auth-token";

// ─── JWT Token Payload ─────────────────────────────────────────
export interface AuthTokenPayload extends JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

// ─── JWT Verification (used by Next.js middleware for route protection) ──
export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}
