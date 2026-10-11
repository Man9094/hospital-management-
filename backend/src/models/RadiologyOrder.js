const mongoose = require("mongoose");

const RadiologyOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    order_number: {
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
    doctor_id: {
      type: Number,
      required: true,
    },
    modality: {
      type: String,
      required: true,
      enum: ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Echocardiogram"],
    },
    body_part: {
      type: String,
      required: true,
    },
    clinical_indication: String,
    status: {
      type: String,
      enum: ["scheduled", "study_completed", "report_drafted", "verified"],
      default: "scheduled",
    },
    pacs_image_url: String,
    findings: String,
    impression: String,
    radiologist_id: Number,
    verified_at: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

RadiologyOrderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const highest = await this.constructor.findOne().sort("-orderId");
    this.orderId = highest && highest.orderId ? highest.orderId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("RadiologyOrder", RadiologyOrderSchema);
