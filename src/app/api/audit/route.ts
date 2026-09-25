import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["hospital_admin", "super_admin"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module") || "";
    const limit = parseInt(searchParams.get("limit") || "100");

    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params: any[] = [];

    if (module) {
      sql += ` AND module = ?`;
      params.push(module);
    }

    sql += ` ORDER BY timestamp DESC LIMIT ?`;
    params.push(limit);

    const logs = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Failed to fetch audit logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
