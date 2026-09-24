import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword, validatePassword } from "@/lib/auth";

interface ResetTokenRow {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  used: number;
}

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // ─── Input Validation ────────────────────────────────────
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }

    if (typeof token !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid input format." },
        { status: 400 }
      );
    }

    // ─── Validate Password Strength ─────────────────────────
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Password does not meet requirements.", details: validation.errors },
        { status: 400 }
      );
    }

    // ─── Find Valid Token ────────────────────────────────────
    const resetToken = db.prepare(`
      SELECT id, user_id, token, expires_at, used
      FROM password_reset_tokens
      WHERE token = ? AND used = 0
    `).get(token) as ResetTokenRow | undefined;

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new password reset." },
        { status: 400 }
      );
    }

    // Check expiry
    const expiresAt = new Date(resetToken.expires_at);
    if (expiresAt < new Date()) {
      // Mark token as used
      db.prepare(`UPDATE password_reset_tokens SET used = 1 WHERE id = ?`).run(resetToken.id);
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new password reset." },
        { status: 400 }
      );
    }

    // ─── Update Password ────────────────────────────────────
    const newHash = await hashPassword(password);

    db.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`).run(newHash, resetToken.user_id);

    // Mark token as used
    db.prepare(`UPDATE password_reset_tokens SET used = 1 WHERE id = ?`).run(resetToken.id);

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
