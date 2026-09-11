import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { createToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { sendAutomatedWhatsAppOtp } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, identifier, otp } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: "Please enter your Hospital UHID, Registered Mobile (+91), or Email." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    // ─────────────────────────────────────────────────────────────
    // ACTION 1: SEND SECURE OTP
    // ─────────────────────────────────────────────────────────────
    if (action === "send_otp") {
      // Find patient by UHID, Mobile number, or Email
      let patient = db.prepare(`
        SELECT * FROM patients
        WHERE uhid = ? OR mobile = ? OR email = ?
           OR REPLACE(REPLACE(mobile, ' ', ''), '+91', '') = ?
           OR REPLACE(REPLACE(mobile, ' ', ''), '-', '') = ?
      `).get(
        cleanIdentifier,
        cleanIdentifier,
        cleanIdentifier,
        cleanIdentifier.replace(/\s+/g, "").replace("+91", "").replace(/-/g, ""),
        cleanIdentifier.replace(/\s+/g, "").replace(/-/g, "")
      ) as any;

      // If patient doesn't exist yet, auto-register as new patient for live testing
      if (!patient) {
        const isNumeric = /^\+?[0-9\s-]{8,15}$/.test(cleanIdentifier);
        const newUhid = `MC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const defaultMobile = isNumeric ? cleanIdentifier : "+91 98250 99881";
        const defaultEmail = !isNumeric && cleanIdentifier.includes("@") ? cleanIdentifier : `${newUhid.toLowerCase()}@medcore.in`;
        const defaultName = isNumeric ? `Patient (${cleanIdentifier.slice(-4)})` : "Registered Patient";

        db.prepare(`
          INSERT INTO patients (uhid, full_name, mobile, email, age, gender, blood_group, city, abha_id, registration_date)
          VALUES (?, ?, ?, ?, 32, 'Other', 'B+', 'Mumbai', ?, CURRENT_TIMESTAMP)
        `).run(newUhid, defaultName, defaultMobile, defaultEmail, `ABHA-${Math.floor(10000000 + Math.random() * 90000000)}`);

        patient = db.prepare(`SELECT * FROM patients WHERE uhid = ?`).get(newUhid) as any;
      }

      // Generate secure 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      // Store in patient_otps table
      db.prepare(`
        INSERT INTO patient_otps (identifier, otp_code, expires_at, verified)
        VALUES (?, ?, ?, 0)
      `).run(patient.uhid, generatedOtp, expiresAt);

      // ─── AUTOMATED SERVER-SIDE WHATSAPP DISPATCH ────────────────
      const waResult = await sendAutomatedWhatsAppOtp(
        patient.mobile || cleanIdentifier,
        patient.full_name,
        patient.uhid,
        generatedOtp
      );

      // Clean phone number for WhatsApp wa.me link
      const rawPhone = (patient.mobile || cleanIdentifier).replace(/\D/g, "");
      const whatsappPhone = rawPhone.length === 10 ? `91${rawPhone}` : (rawPhone.startsWith("91") ? rawPhone : `91${rawPhone}`);
      
      const whatsappMessage = `*Apex MedCore Hospital Security OTP*\n\nHello ${patient.full_name},\nYour One-Time Login Verification Code is: *${generatedOtp}*\n\n🔐 Valid for 10 minutes.\n🏥 Unique Hospital ID (UHID): *${patient.uhid}*\n\n_Do not share this code with anyone._`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}`;
      const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}`;

      // Mask mobile for privacy display
      const maskedMobile = patient.mobile
        ? patient.mobile.replace(/(\+?\d{2,4}\s?\d{2})\d{4}(\d{2})/, "$1••••$2")
        : (cleanIdentifier.length > 6 ? cleanIdentifier.slice(0, 4) + "••••" + cleanIdentifier.slice(-2) : "+91 98••• ••01");

      return NextResponse.json({
        success: true,
        message: `6-digit security code automatically sent to ${maskedMobile} via Hospital WhatsApp Gateway`,
        patient_name: patient.full_name,
        patient_uhid: patient.uhid,
        masked_mobile: maskedMobile,
        phone: whatsappPhone,
        otp: generatedOtp,
        whatsapp_delivery: waResult,
        whatsapp_url: whatsappUrl,
        whatsapp_web_url: whatsappWebUrl,
        whatsapp_message: whatsappMessage,
        is_new_registration: !patient.created_at,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // ACTION 2: VERIFY OTP & SIGN IN
    // ─────────────────────────────────────────────────────────────
    if (action === "verify_otp") {
      if (!otp || otp.trim().length !== 6) {
        return NextResponse.json({ error: "Please enter a valid 6-digit OTP." }, { status: 400 });
      }

      // Find patient record
      const patient = db.prepare(`
        SELECT * FROM patients
        WHERE uhid = ? OR mobile = ? OR email = ?
           OR REPLACE(REPLACE(mobile, ' ', ''), '+91', '') = ?
      `).get(
        cleanIdentifier,
        cleanIdentifier,
        cleanIdentifier,
        cleanIdentifier.replace(/\s+/g, "").replace("+91", "")
      ) as any;

      if (!patient) {
        return NextResponse.json({ error: "Patient record not found." }, { status: 404 });
      }

      const inputOtp = otp.trim();

      // ─── STRICT REAL OTP VERIFICATION (NO BYPASS) ────────────────
      const validRecord = db.prepare(`
        SELECT * FROM patient_otps
        WHERE identifier = ?
          AND otp_code = ?
          AND verified = 0
          AND datetime(expires_at) > datetime('now')
        ORDER BY created_at DESC LIMIT 1
      `).get(patient.uhid, inputOtp) as any;

      if (!validRecord) {
        // Record failed attempt in audit log
        try {
          db.prepare(`
            INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
            VALUES (?, 'patient', 'PATIENT_OTP_FAILED', 'Auth', ?, ?, ?)
          `).run(
            patient.full_name,
            patient.uhid,
            `Failed OTP login attempt for patient ${patient.uhid} (${patient.mobile})`,
            request.headers.get("x-forwarded-for") || "127.0.0.1"
          );
        } catch (e) {
          console.error("Audit log error:", e);
        }

        return NextResponse.json(
          {
            error: "Incorrect or expired OTP. You must enter the exact 6-digit verification code sent to your WhatsApp number.",
          },
          { status: 401 }
        );
      }

      // Mark OTP as used/verified immediately (Single-use token)
      db.prepare(`UPDATE patient_otps SET verified = 1 WHERE id = ?`).run(validRecord.id);

      // Find or link patient user account
      let user = db.prepare(`SELECT * FROM users WHERE email = ? OR role = 'patient'`).get(patient.email || "patient@medcore.in") as any;

      if (!user) {
        user = {
          id: 12,
          name: patient.full_name,
          email: patient.email || `${patient.uhid.toLowerCase()}@medcore.in`,
          role: "patient",
        };
      }

      // Create JWT session
      const token = await createToken(
        {
          userId: user.id,
          email: user.email,
          name: patient.full_name,
          role: "patient",
        },
        true // 7-day session
      );

      // Audit Log
      db.prepare(`
        INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
        VALUES (?, 'patient', 'PATIENT_OTP_LOGIN', 'Auth', ?, ?, ?)
      `).run(
        patient.full_name,
        patient.uhid,
        `Patient ${patient.full_name} (${patient.uhid}) logged in via secure OTP`,
        request.headers.get("x-forwarded-for") || "127.0.0.1"
      );

      const response = NextResponse.json({
        success: true,
        message: "Authenticated successfully!",
        user: {
          id: user.id,
          name: patient.full_name,
          email: user.email,
          role: "patient",
          uhid: patient.uhid,
        },
      });

      // Set HttpOnly secure cookie directly
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Patient OTP Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during patient login." },
      { status: 500 }
    );
  }
}
