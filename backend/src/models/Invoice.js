const mongoose = require("mongoose");

const InvoiceItemSchema = new mongoose.Schema(
  {
    item_description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    gst_percent: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const PaymentRecordSchema = new mongoose.Schema(
  {
    receipt_number: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_mode: {
      type: String,
      enum: ["UPI", "Cash", "Credit Card", "Debit Card", "Net Banking", "TPA Claim", "PM-JAY"],
      required: true,
    },
    transaction_reference: String,
    received_by: Number,
    payment_date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ClaimSchema = new mongoose.Schema(
  {
    claim_number: String,
    insurance_company: String,
    tpa_name: String,
    policy_number: String,
    pre_auth_status: {
      type: String,
      enum: ["pending", "approved", "rejected", "query_raised", null],
      default: "approved",
    },
    pre_auth_amount: {
      type: Number,
      default: 0,
    },
    claimed_amount: {
      type: Number,
      default: 0,
    },
    settled_amount: {
      type: Number,
      default: 0,
    },
    claim_status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "query_raised", "approved", "rejected", "settled", null],
      default: "submitted",
    },
    remarks: String,
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    invoice_number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patient_uhid: {
      type: String,
      required: true,
      index: true,
    },
    bill_type: {
      type: String,
      enum: ["OPD Consultation", "IPD Final Bill", "Pharmacy", "Lab Test", "Radiology", "Emergency", "Package"],
      default: "OPD Consultation",
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    gst_amount: {
      type: Number,
      default: 0,
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    insurance_share: {
      type: Number,
      default: 0,
    },
    patient_payable: {
      type: Number,
      default: 0,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    outstanding_amount: {
      type: Number,
      default: 0,
    },
    payment_status: {
      type: String,
      enum: ["pending", "partially_paid", "paid", "claim_in_process", "cancelled"],
      default: "pending",
      index: true,
    },
    items: [InvoiceItemSchema],
    payments: [PaymentRecordSchema],
    claim: ClaimSchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.invoiceId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

InvoiceSchema.pre("save", async function (next) {
  if (!this.invoiceId) {
    const highest = await this.constructor.findOne().sort("-invoiceId");
    this.invoiceId = highest && highest.invoiceId ? highest.invoiceId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
