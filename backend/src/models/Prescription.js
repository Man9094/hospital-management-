const mongoose = require("mongoose");

const PrescriptionItemSchema = new mongoose.Schema(
  {
    medicine_name: {
      type: String,
      required: true,
    },
    generic_name: String,
    dosage: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    timing: {
      type: String,
      enum: ["After Food", "Before Food", "With Food", "Bedtime", "As Needed"],
      default: "After Food",
    },
    duration_days: {
      type: Number,
      required: true,
      default: 5,
    },
    quantity: {
      type: Number,
      required: true,
      default: 10,
    },
    instructions: String,
  },
  { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    rx_number: {
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
      index: true,
    },
    appointment_id: Number,
    diagnosis: String,
    general_advice: String,
    status: {
      type: String,
      enum: ["active", "dispensed", "partially_dispensed", "cancelled"],
      default: "active",
      index: true,
    },
    items: [PrescriptionItemSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.prescriptionId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

PrescriptionSchema.pre("save", async function (next) {
  if (!this.prescriptionId) {
    const highest = await this.constructor.findOne().sort("-prescriptionId");
    this.prescriptionId = highest && highest.prescriptionId ? highest.prescriptionId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
