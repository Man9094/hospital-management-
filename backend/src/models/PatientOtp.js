const mongoose = require("mongoose");

const PatientOtpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    otp_code: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    verified: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
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

module.exports = mongoose.model("PatientOtp", PatientOtpSchema);
