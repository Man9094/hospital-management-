const mongoose = require("mongoose");

const ClinicalNoteSchema = new mongoose.Schema(
  {
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
    visit_date: {
      type: Date,
      default: Date.now,
    },
    chief_complaint: {
      type: String,
      required: true,
    },
    history_present_illness: String,
    past_medical_history: String,
    examination_findings: String,
    diagnosis: {
      type: String,
      required: true,
    },
    icd10_code: String,
    treatment_plan: String,
    follow_up_date: String,
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

module.exports = mongoose.model("ClinicalNote", ClinicalNoteSchema);
