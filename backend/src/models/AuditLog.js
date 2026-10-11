const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    user_id: Number,
    user_name: String,
    role: String,
    action: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    patient_uhid: {
      type: String,
      index: true,
    },
    details: String,
    ip_address: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
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

module.exports = mongoose.model("AuditLog", AuditLogSchema);
