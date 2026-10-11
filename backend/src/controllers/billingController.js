const { Invoice, Patient, AuditLog } = require("../models");

/**
 * Get Invoices or Insurance Claims
 * GET /api/billing
 */
const getBillingData = async (req, res, next) => {
  try {
    const { view } = req.query;

    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();

    const patientUhids = invoices.map((i) => i.patient_uhid);
    const patients = await Patient.find({ uhid: { $in: patientUhids } }).lean();
    const patMap = {};
    patients.forEach((p) => {
      patMap[p.uhid] = p;
    });

    if (view === "claims") {
      const claims = [];
      invoices.forEach((inv) => {
        if (inv.claim && inv.claim.claim_number) {
          const pat = patMap[inv.patient_uhid] || {};
          claims.push({
            ...inv.claim,
            invoice_id: inv.invoiceId || inv._id,
            invoice_number: inv.invoice_number,
            patient_uhid: inv.patient_uhid,
            total_amount: inv.total_amount,
            patient_name: pat.full_name || "Unknown Patient",
            patient_mobile: pat.mobile || "",
          });
        }
      });

      return res.status(200).json({
        success: true,
        claims,
      });
    }

    const enrichedInvoices = invoices.map((inv) => {
      const pat = patMap[inv.patient_uhid] || {};
      return {
        ...inv,
        id: inv.invoiceId || inv._id,
        patient_name: pat.full_name || "Unknown Patient",
        patient_mobile: pat.mobile || "",
        insurance_provider: pat.insurance_provider || "",
      };
    });

    // Summary calculations
    const total_revenue = invoices.reduce((acc, i) => acc + (i.total_amount || 0), 0);
    const total_collected = invoices.reduce((acc, i) => acc + (i.paid_amount || 0), 0);
    const total_outstanding = invoices.reduce((acc, i) => acc + (i.outstanding_amount || 0), 0);
    const total_insurance_claims = invoices.reduce((acc, i) => acc + (i.insurance_share || 0), 0);

    return res.status(200).json({
      success: true,
      invoices: enrichedInvoices,
      summary: {
        total_revenue,
        total_collected,
        total_outstanding,
        total_insurance_claims,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Invoice or Record Payment
 * POST /api/billing
 */
const postBilling = async (req, res, next) => {
  try {
    const { action } = req.body || {};

    if (action === "record_payment") {
      const { invoice_id, amount, payment_mode, transaction_reference } = req.body;

      if (!invoice_id || !amount) {
        return res.status(400).json({ success: false, error: "Invoice ID and payment amount are required." });
      }

      const query = isNaN(invoice_id) ? { _id: invoice_id } : { invoiceId: parseInt(invoice_id) };
      const invoice = await Invoice.findOne(query);

      if (!invoice) {
        return res.status(404).json({ success: false, error: "Invoice not found." });
      }

      const receiptNumber = `RCP-2026-${Date.now().toString().slice(-4)}`;
      const paymentAmount = parseFloat(amount);

      invoice.payments.push({
        receipt_number: receiptNumber,
        amount: paymentAmount,
        payment_mode: payment_mode || "UPI",
        transaction_reference: transaction_reference || null,
        received_by: req.user ? req.user.userId : 1,
        payment_date: new Date(),
      });

      invoice.paid_amount = (invoice.paid_amount || 0) + paymentAmount;
      invoice.outstanding_amount = Math.max(0, invoice.total_amount - invoice.paid_amount);

      if (invoice.outstanding_amount === 0) {
        invoice.payment_status = "paid";
      } else if (invoice.paid_amount > 0) {
        invoice.payment_status = "partially_paid";
      }

      await invoice.save();

      // Audit log
      try {
        await AuditLog.create({
          user_name: req.user ? req.user.name : "Billing Officer",
          role: req.user ? req.user.role : "billing",
          action: "RECORD_PAYMENT",
          module: "Billing",
          patient_uhid: invoice.patient_uhid,
          details: `Recorded payment of ₹${paymentAmount} via ${payment_mode || "UPI"} for Invoice ${invoice.invoice_number}`,
          ip_address: req.ip || "127.0.0.1",
        });
      } catch (auditErr) {
        console.warn("Audit error:", auditErr.message);
      }

      return res.status(200).json({
        success: true,
        message: `Payment of ₹${paymentAmount} recorded successfully. Receipt #${receiptNumber} generated.`,
        receipt_number: receiptNumber,
        invoice,
      });
    }

    // Default: Create New Invoice
    const {
      patient_uhid,
      bill_type,
      items,
      discount_amount,
      insurance_share,
      claim,
    } = req.body;

    if (!patient_uhid || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Patient UHID and bill line items are required." });
    }

    const subtotal = items.reduce((acc, it) => acc + (it.total_price || (it.unit_price * it.quantity)), 0);
    const disc = parseFloat(discount_amount || 0);
    const insShare = parseFloat(insurance_share || 0);
    const gstTotal = items.reduce((acc, it) => acc + ((it.unit_price * it.quantity) * (it.gst_percent || 0) / 100), 0);
    const totalAmount = Math.max(0, subtotal + gstTotal - disc);
    const patientPayable = Math.max(0, totalAmount - insShare);

    const invCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-2026-000${101 + invCount}`;

    const newInvoice = await Invoice.create({
      invoice_number: invoiceNumber,
      patient_uhid,
      bill_type: bill_type || "OPD Consultation",
      subtotal,
      discount_amount: disc,
      gst_amount: gstTotal,
      total_amount: totalAmount,
      insurance_share: insShare,
      patient_payable: patientPayable,
      paid_amount: 0,
      outstanding_amount: totalAmount,
      payment_status: "pending",
      items,
      claim: claim || null,
    });

    return res.status(201).json({
      success: true,
      invoice_number: invoiceNumber,
      invoice: newInvoice,
      message: `Invoice ${invoiceNumber} created successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBillingData,
  postBilling,
};
