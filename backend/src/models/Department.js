const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    deptId: {
      type: String,
      required: true,
      unique: true,
    },
    hospital_id: {
      type: String,
      default: "HOSP-001",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    head_doctor_name: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.deptId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Department", DepartmentSchema);
