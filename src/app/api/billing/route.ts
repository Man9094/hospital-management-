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

    if (view === "claims") {
      const claims = db.prepare(`
        SELECT ic.*, p.full_name as patient_name, p.mobile as patient_mobile, inv.invoice_number, inv.total_amount
        FROM insurance_claims ic
        JOIN patients p ON ic.patient_uhid = p.uhid
        JOIN invoices inv ON ic.invoice_id = inv.id
        ORDER BY ic.created_at DESC
      `).all();
      return NextResponse.json({ success: true, claims });
    }

    const invoices = db.prepare(`
      SELECT inv.*, p.full_name as patient_name, p.mobile as patient_mobile, p.insurance_provider
      FROM invoices inv
      JOIN patients p ON inv.patient_uhid = p.uhid
      ORDER BY inv.created_at DESC
    `).all() as any[];

    for (const inv of invoices) {
      inv.items = db.prepare(`SELECT * FROM invoice_items WHERE invoice_id = ?`).all(inv.id);
      inv.payments = db.prepare(`SELECT * FROM payments WHERE invoice_id = ?`).all(inv.id);
      inv.claim = db.prepare(`SELECT * FROM insurance_claims WHERE invoice_id = ?`).get(inv.id);
    }

    // Totals summary
    const summary = db.prepare(`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(paid_amount), 0) as total_collected,
        COALESCE(SUM(outstanding_amount), 0) as total_outstanding,
        COALESCE(SUM(insurance_share), 0) as total_insurance_claims
      FROM invoices
    `).get();

    return NextResponse.json({ success: true, invoices, summary });
  } catch (error: any) {
    console.error("Failed to fetch billing data:", error);
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
    const { action } = body;

    // Action 1: Create Invoice
    if (action === "create_invoice") {
      const {
        patient_uhid,
        bill_type,
        items,
        discount_amount = 0,
        insurance_share = 0,
        insurance_details,
      } = body;

      if (!patient_uhid || !items || items.length === 0) {
        return NextResponse.json({ error: "Patient UHID and bill line items required" }, { status: 400 });
      }

      let subtotal = 0;
      let gstTotal = 0;

      for (const item of items) {
        const itemTotal = (item.unit_price || 0) * (item.quantity || 1);
        const gst = itemTotal * ((item.gst_percent || 0) / 100);
        subtotal += itemTotal;
        gstTotal += gst;
      }

      const totalAmount = Math.max(0, subtotal - discount_amount + gstTotal);
      const patientPayable = Math.max(0, totalAmount - insurance_share);
      const invoiceNumber = `INV-2026-${Date.now().toString().slice(-5)}`;

      const invStmt = db.prepare(`
        INSERT INTO invoices (
          invoice_number, patient_uhid, bill_type, subtotal, discount_amount, gst_amount,
          total_amount, insurance_share, patient_payable, paid_amount, outstanding_amount, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'pending')
      `);

      const invRes = invStmt.run(
        invoiceNumber,
        patient_uhid,
        bill_type || "OPD Consultation",
        subtotal,
        discount_amount,
        gstTotal,
        totalAmount,
        insurance_share,
        patientPayable,
        patientPayable
      );
      const invoiceId = invRes.lastInsertRowid;

      const itemStmt = db.prepare(`
        INSERT INTO invoice_items (invoice_id, item_description, category, quantity, unit_price, gst_percent, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        itemStmt.run(
          invoiceId,
          item.description,
          item.category || "General",
          item.quantity || 1,
          item.unit_price,
          item.gst_percent || 0,
          (item.unit_price * (item.quantity || 1))
        );
      }

      // If insurance claim exists
      if (insurance_share > 0 && insurance_details) {
        const claimNumber = `CLM-${Date.now().toString().slice(-6)}`;
        db.prepare(`
          INSERT INTO insurance_claims (
            claim_number, invoice_id, patient_uhid, insurance_company, tpa_name, policy_number,
            pre_auth_status, pre_auth_amount, claimed_amount, settled_amount, claim_status, remarks
          ) VALUES (?, ?, ?, ?, ?, ?, 'approved', ?, ?, 0, 'submitted', ?)
        `).run(
          claimNumber,
          invoiceId,
          patient_uhid,
          insurance_details.company || "Ayushman Bharat PM-JAY",
          insurance_details.tpa || "State Health Agency",
          insurance_details.policy_no || "TPA-POL-2026",
          insurance_share,
          insurance_share,
          insurance_details.remarks || "Cashless claim submitted"
        );
      }

      return NextResponse.json({
        success: true,
        invoice_number: invoiceNumber,
        invoice_id: invoiceId,
        message: `Invoice ${invoiceNumber} created successfully!`,
      });
    }

    // Action 2: Collect Payment
    if (action === "collect_payment") {
      const { invoice_id, patient_uhid, amount, payment_mode, transaction_reference } = body;

      if (!invoice_id || !amount || !payment_mode) {
        return NextResponse.json({ error: "Invoice ID, amount and payment mode required" }, { status: 400 });
      }

      const receiptNumber = `RCP-2026-${Date.now().toString().slice(-5)}`;

      db.prepare(`
        INSERT INTO payments (receipt_number, invoice_id, patient_uhid, amount, payment_mode, transaction_reference, received_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(receiptNumber, invoice_id, patient_uhid, amount, payment_mode, transaction_reference || null, user.id);

      // Update invoice paid & outstanding amounts
      const inv = db.prepare(`SELECT * FROM invoices WHERE id = ?`).get(invoice_id) as any;
      const newPaid = (inv.paid_amount || 0) + Number(amount);
      const newOutstanding = Math.max(0, (inv.total_amount || 0) - (inv.insurance_share || 0) - newPaid);
      const newStatus = newOutstanding === 0 ? "paid" : "partially_paid";

      db.prepare(`
        UPDATE invoices SET paid_amount = ?, outstanding_amount = ?, payment_status = ? WHERE id = ?
      `).run(newPaid, newOutstanding, newStatus, invoice_id);

      return NextResponse.json({
        success: true,
        receipt_number: receiptNumber,
        message: `Payment of ₹${amount} recorded via ${payment_mode}. Receipt: ${receiptNumber}`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Billing operation failed:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
