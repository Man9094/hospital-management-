const mongoose = require("mongoose");

const VitalSchema = new mongoose.Schema(
  {
    patient_uhid: {
      type: String,
      required: true,
      index: true,
    },
    appointment_id: Number,
    ipd_admission_id: Number,
    recorded_by: Number,
    bp_systolic: Number,
    bp_diastolic: Number,
    heart_rate: Number,
    temperature: Number,
    spo2: Number,
    respiratory_rate: Number,
    weight_kg: Number,
    height_cm: Number,
    bmi: Number,
    blood_glucose: Number,
    notes: String,
    is_abnormal: {
      type: Number,
      default: 0,
    },
    recorded_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Vital", VitalSchema);
