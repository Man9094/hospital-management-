import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const status = searchParams.get("status") || "all";

    let sql = `SELECT * FROM patients WHERE 1=1`;
    const params: (string | number)[] = [];

    if (query) {
      sql += ` AND (uhid LIKE ? OR full_name LIKE ? OR mobile LIKE ? OR abha_id LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }

    if (status !== "all") {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;

    const patients = db.prepare(sql).all(...params);
    return NextResponse.json({ success: true, patients });
  } catch (error: any) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      dob,
      age,
      gender,
      mobile,
      email,
      address,
      city,
      state,
      blood_group,
      allergies,
      chronic_conditions,
      abha_id,
      insurance_provider,
      insurance_policy_number,
      emergency_contact_name,
      emergency_contact_phone,
    } = body;

    if (!full_name || !gender || !mobile) {
      return NextResponse.json({ error: "Full name, gender, and mobile number are required" }, { status: 400 });
    }

    // Generate next UHID in sequence: MC-2026-XXXXXX
    const countRow = db.prepare(`SELECT COUNT(*) as count FROM patients`).get() as { count: number };
    const nextNum = 101 + (countRow?.count || 0);
    const uhid = `MC-2026-000${nextNum}`;

    const stmt = db.prepare(`
      INSERT INTO patients (
        uhid, full_name, dob, age, gender, mobile, email, address, city, state,
        blood_group, allergies, chronic_conditions, abha_id, insurance_provider,
        insurance_policy_number, emergency_contact_name, emergency_contact_phone, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `);

    stmt.run(
      uhid,
      full_name,
      dob || null,
      age ? parseInt(age) : null,
      gender,
      mobile,
      email || null,
      address || null,
      city || "Ahmedabad",
      state || "Gujarat",
      blood_group || null,
      allergies || null,
      chronic_conditions || null,
      abha_id || null,
      insurance_provider || null,
      insurance_policy_number || null,
      emergency_contact_name || null,
      emergency_contact_phone || null
    );

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'REGISTER_PATIENT', 'Reception', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      uhid,
      `Registered patient ${full_name} (${gender}, ${age || 'N/A'} yrs) with UHID ${uhid}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({
      success: true,
      uhid,
      message: `Patient registered successfully with UHID ${uhid}`,
    });
  } catch (error: any) {
    console.error("Failed to create patient:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
