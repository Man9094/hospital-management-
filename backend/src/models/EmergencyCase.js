const mongoose = require("mongoose");

const EmergencyCaseSchema = new mongoose.Schema(
  {
    caseId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    er_number: {
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
    triage_color: {
      type: String,
      required: true,
      enum: ["Red", "Orange", "Yellow", "Green"],
      index: true,
    },
    triage_reason: {
      type: String,
      required: true,
    },
    arrival_mode: {
      type: String,
      required: true,
      enum: ["Ambulance", "Walk-in", "Police Referral", "Hospital Transfer"],
    },
    assigned_doctor_id: Number,
    bed_allocated: String,
    disposition: {
      type: String,
      enum: ["ICU Admission", "IPD Ward", "Emergency OT", "Discharged", "Transferred", null],
    },
    status: {
      type: String,
      enum: ["active", "stabilized", "admitted", "discharged", "transferred"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.caseId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

EmergencyCaseSchema.pre("save", async function (next) {
  if (!this.caseId) {
    const highest = await this.constructor.findOne().sort("-caseId");
    this.caseId = highest && highest.caseId ? highest.caseId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("EmergencyCase", EmergencyCaseSchema);
