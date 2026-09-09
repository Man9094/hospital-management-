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
    const view = searchParams.get("view");

    if (view === "prescriptions") {
      const prescriptions = db.prepare(`
        SELECT p.*, pt.full_name as patient_name, pt.age as patient_age, pt.gender as patient_gender,
               u.name as doctor_name
        FROM prescriptions p
        JOIN patients pt ON p.patient_uhid = pt.uhid
        JOIN users u ON p.doctor_id = u.id
        ORDER BY p.created_at DESC
      `).all() as any[];

      for (const rx of prescriptions) {
        rx.items = db.prepare(`
          SELECT * FROM prescription_items WHERE prescription_id = ?
        `).all(rx.id);
      }

      return NextResponse.json({ success: true, prescriptions });
    }

    // Default: Inventory items with batches and stock alerts
    const items = db.prepare(`
      SELECT pi.*, 
             COALESCE(SUM(mb.stock_quantity), 0) as total_stock,
             MIN(mb.expiry_date) as nearest_expiry,
             MIN(mb.mrp) as base_mrp
      FROM pharmacy_items pi
      LEFT JOIN medicine_batches mb ON pi.id = mb.item_id
      GROUP BY pi.id
      ORDER BY pi.brand_name ASC
    `).all() as any[];

    for (const item of items) {
      item.batches = db.prepare(`
        SELECT * FROM medicine_batches WHERE item_id = ? ORDER BY expiry_date ASC
      `).all(item.id);
    }

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error("Failed to fetch pharmacy data:", error);
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
    const { prescription_id, patient_uhid, items_to_dispense } = body;

    if (!prescription_id && !items_to_dispense) {
      return NextResponse.json({ error: "Prescription or items required" }, { status: 400 });
    }

    // Deduct stock for each batch
    if (items_to_dispense && Array.isArray(items_to_dispense)) {
      const updateBatch = db.prepare(`
        UPDATE medicine_batches
        SET stock_quantity = MAX(0, stock_quantity - ?)
        WHERE id = ?
      `);

      for (const item of items_to_dispense) {
        if (item.batch_id && item.quantity) {
          updateBatch.run(item.quantity, item.batch_id);
        }
      }
    }

    if (prescription_id) {
      db.prepare(`UPDATE prescriptions SET status = 'dispensed' WHERE id = ?`).run(prescription_id);
    }

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address)
      VALUES (?, ?, 'DISPENSE_MEDICINE', 'Pharmacy', ?, ?, ?)
    `).run(
      user.name,
      user.role,
      patient_uhid || null,
      `Dispensed medications for Rx #${prescription_id || 'Direct Sale'}`,
      request.headers.get("x-forwarded-for") || "127.0.0.1"
    );

    return NextResponse.json({ success: true, message: "Medications dispensed and inventory updated successfully!" });
  } catch (error: any) {
    console.error("Failed to dispense medications:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
