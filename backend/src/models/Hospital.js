const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      required: true,
      unique: true,
      default: "HOSP-001",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: String,
    registration_number: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    gst_number: String,
    abha_facility_id: String,
    logo_url: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.hospitalId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Hospital", HospitalSchema);
