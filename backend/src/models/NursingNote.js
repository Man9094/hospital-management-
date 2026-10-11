const mongoose = require("mongoose");

const NursingNoteSchema = new mongoose.Schema(
  {
    ipd_admission_id: {
      type: Number,
      required: true,
      index: true,
    },
    patient_uhid: {
      type: String,
      required: true,
      index: true,
    },
    nurse_id: {
      type: Number,
      required: true,
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
      default: "Morning",
    },
    notes: {
      type: String,
      required: true,
    },
    iv_fluids: String,
    intake_output: String,
    medication_administered: String,
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

module.exports = mongoose.model("NursingNote", NursingNoteSchema);
