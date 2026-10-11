const mongoose = require("mongoose");

const IpdAdmissionSchema = new mongoose.Schema(
  {
    admissionId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    admission_number: {
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
    bed_id: {
      type: String,
      required: true,
    },
    admitting_doctor_id: {
      type: Number,
      required: true,
    },
    primary_nurse_id: Number,
    admission_date: {
      type: Date,
      default: Date.now,
    },
    admission_reason: {
      type: String,
      required: true,
    },
    initial_diagnosis: String,
    discharge_date: Date,
    discharge_type: {
      type: String,
      enum: ["Normal", "Against Medical Advice (LAMA)", "Transferred", "Deceased", null],
    },
    discharge_summary: String,
    discharge_instructions: String,
    status: {
      type: String,
      enum: ["admitted", "transferred", "discharged"],
      default: "admitted",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.admissionId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

IpdAdmissionSchema.pre("save", async function (next) {
  if (!this.admissionId) {
    const highest = await this.constructor.findOne().sort("-admissionId");
    this.admissionId = highest && highest.admissionId ? highest.admissionId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("IpdAdmission", IpdAdmissionSchema);
