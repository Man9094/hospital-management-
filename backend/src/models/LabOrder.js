const mongoose = require("mongoose");

const LabOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    order_number: {
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
    doctor_id: {
      type: Number,
      required: true,
    },
    test_id: {
      type: String,
      required: true,
      index: true,
    },
    sample_barcode: String,
    status: {
      type: String,
      enum: ["ordered", "sample_collected", "processing", "result_ready", "verified", "cancelled"],
      default: "ordered",
      index: true,
    },
    sample_collected_at: String,
    result_value: String,
    result_unit: String,
    reference_range: String,
    is_critical: {
      type: Number,
      default: 0,
    },
    pathologist_id: Number,
    verified_at: String,
    remarks: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

LabOrderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const highest = await this.constructor.findOne().sort("-orderId");
    this.orderId = highest && highest.orderId ? highest.orderId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("LabOrder", LabOrderSchema);
