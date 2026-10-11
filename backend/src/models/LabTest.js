const mongoose = require("mongoose");

const LabTestSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    sample_type: {
      type: String,
      required: true,
    },
    reference_range: String,
    unit: String,
    standard_rate: {
      type: Number,
      required: true,
    },
    turnaround_time_hours: {
      type: Number,
      default: 4,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.testId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("LabTest", LabTestSchema);
