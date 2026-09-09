import { NextResponse } from "next/server";
import { runSeed } from "@/lib/seed";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "super_admin" && user.role !== "hospital_admin")) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    await runSeed();
    return NextResponse.json({
      success: true,
      message: "Database re-seeded successfully with fresh Indian hospital demo data!",
    });
  } catch (error: any) {
    console.error("Failed to re-seed database:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
