import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getWhatsAppConfig, sendAutomatedWhatsAppOtp } from "@/lib/whatsapp";

// GET: Retrieve Gateway Status & Message History
export async function GET() {
  try {
    const config = getWhatsAppConfig();

    const messages = db.prepare(`
      SELECT * FROM whatsapp_messages
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    const totalSent = (db.prepare(`SELECT COUNT(*) as count FROM whatsapp_messages`).get() as any)?.count || 0;
    const totalDelivered = (db.prepare(`SELECT COUNT(*) as count FROM whatsapp_messages WHERE status = 'delivered'`).get() as any)?.count || 0;

    return NextResponse.json({
      success: true,
      config,
      stats: {
        total_messages: totalSent,
        delivered: totalDelivered,
        success_rate: totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 100,
      },
      recent_messages: messages,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

// POST: Update Gateway Settings or Send Test Message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, provider, hospitalNumber, senderName, apiEndpoint, apiKey, instanceId, isEnabled, testPhone } = body;

    // ACTION: Update Gateway Settings
    if (action === "update_settings") {
      db.prepare(`
        INSERT INTO whatsapp_gateway_settings (id, hospital_number, sender_name, provider, api_endpoint, api_key, instance_id, is_enabled, updated_at)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          hospital_number = excluded.hospital_number,
          sender_name = excluded.sender_name,
          provider = excluded.provider,
          api_endpoint = excluded.api_endpoint,
          api_key = excluded.api_key,
          instance_id = excluded.instance_id,
          is_enabled = excluded.is_enabled,
          updated_at = datetime('now')
      `).run(
        hospitalNumber || "+91 79 2658 9000",
        senderName || "Apex MedCore Hospital",
        provider || "auto_gateway",
        apiEndpoint || null,
        apiKey || null,
        instanceId || null,
        isEnabled !== false ? 1 : 0
      );

      return NextResponse.json({
        success: true,
        message: "WhatsApp Gateway settings updated successfully!",
        config: getWhatsAppConfig(),
      });
    }

    // ACTION: Send Automated Test Message
    if (action === "send_test") {
      if (!testPhone) {
        return NextResponse.json({ error: "Please provide a valid recipient phone number" }, { status: 400 });
      }

      const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await sendAutomatedWhatsAppOtp(testPhone, "Test Recipient", "MC-TEST-9999", testOtp);

      return NextResponse.json({
        success: result.success,
        delivery: result,
        otp_sent: testOtp,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}
