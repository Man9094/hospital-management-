import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateResetToken } from "@/lib/auth";

interface UserRow {
  id: number;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Always return the same generic success message
    // This prevents email enumeration attacks
    const genericResponse = {
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    };

    // Find user (but don't reveal if they exist)
    const user = db.prepare(`SELECT id, email FROM users WHERE email = ?`).get(cleanEmail) as UserRow | undefined;

    if (!user) {
      // Return same response even if user doesn't exist
      return NextResponse.json(genericResponse);
    }

    // Generate reset token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Invalidate any existing unused tokens for this user
    db.prepare(`UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0`).run(user.id);

    // Store new token
    db.prepare(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `).run(user.id, token, expiresAt);

    // In production, send an email here with the reset link
    // For development, log the token
    console.log(`\n🔑 Password Reset Token for ${cleanEmail}: ${token}`);
    console.log(`   Reset URL: /reset-password?token=${token}\n`);

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
