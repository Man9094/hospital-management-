const mongoose = require("mongoose");

const WardSchema = new mongoose.Schema(
  {
    wardId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ward_type: {
      type: String,
      required: true,
      enum: ["General", "Semi-Private", "Deluxe", "ICU", "NICU", "Emergency", "Post-Op"],
    },
    floor: {
      type: String,
      required: true,
    },
    total_beds: {
      type: Number,
      default: 10,
    },
    charge_per_day: {
      type: Number,
      default: 1500,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.wardId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Ward", WardSchema);
