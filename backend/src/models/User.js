const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: [
        "super_admin",
        "hospital_admin",
        "doctor",
        "nurse",
        "reception",
        "lab",
        "radiology",
        "pharmacist",
        "billing",
        "accountant",
        "hr",
        "patient",
      ],
      default: "patient",
    },
    phone: {
      type: String,
      trim: true,
    },
    department_id: {
      type: String,
      ref: "Department",
    },
    qualification: {
      type: String,
      trim: true,
    },
    registration_number: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    last_login: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.userId || ret._id;
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Auto-assign sequential userId if not provided
UserSchema.pre("save", async function (next) {
  if (!this.userId) {
    const highestUser = await this.constructor.findOne().sort("-userId");
    this.userId = highestUser && highestUser.userId ? highestUser.userId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
