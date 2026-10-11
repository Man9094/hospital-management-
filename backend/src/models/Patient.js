const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    uhid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    dob: String,
    age: Number,
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      index: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: String,
    city: {
      type: String,
      default: "Ahmedabad",
    },
    state: {
      type: String,
      default: "Gujarat",
    },
    pincode: String,
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null, ""],
    },
    allergies: String,
    chronic_conditions: String,
    abha_id: {
      type: String,
      index: true,
      trim: true,
    },
    insurance_provider: String,
    insurance_policy_number: String,
    emergency_contact_name: String,
    emergency_contact_phone: String,
    emergency_contact_relation: String,
    status: {
      type: String,
      enum: ["active", "inpatient", "discharged", "deceased"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.patientId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

PatientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    const highest = await this.constructor.findOne().sort("-patientId");
    this.patientId = highest && highest.patientId ? highest.patientId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Patient", PatientSchema);
