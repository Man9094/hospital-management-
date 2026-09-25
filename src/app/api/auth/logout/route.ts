import { NextResponse } from "next/server";
import { clearAuthCookie, AUTH_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearAuthCookie();

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout." },
      { status: 500 }
    );
  }
}

