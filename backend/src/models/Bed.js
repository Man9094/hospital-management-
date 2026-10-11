const mongoose = require("mongoose");

const BedSchema = new mongoose.Schema(
  {
    bedId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ward_id: {
      type: String,
      required: true,
      index: true,
    },
    bed_number: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved", "cleaning", "maintenance"],
      default: "available",
      index: true,
    },
    current_patient_uhid: {
      type: String,
      default: null,
    },
    allocated_at: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.bedId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Bed", BedSchema);
