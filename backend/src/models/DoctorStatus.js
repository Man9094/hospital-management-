const mongoose = require("mongoose");

const DoctorStatusSchema = new mongoose.Schema(
  {
    doctor_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["available", "in_cabin", "running_late", "on_rounds", "emergency_call", "on_break"],
      default: "available",
    },
    delay_minutes: {
      type: Number,
      default: 0,
    },
    delay_reason: String,
    cabin_number: {
      type: String,
      default: "Cabin 104",
    },
    active_case_number: {
      type: Number,
      default: null,
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

module.exports = mongoose.model("DoctorStatus", DoctorStatusSchema);
