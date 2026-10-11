const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    appointment_number: {
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
      index: true,
    },
    department_id: {
      type: String,
      default: "DEP-MED",
    },
    appointment_date: {
      type: String,
      required: true,
      index: true,
    },
    slot_time: {
      type: String,
      required: true,
      default: "10:00 AM",
    },
    token_number: {
      type: String,
      required: true,
    },
    case_number: {
      type: Number,
      default: 1,
    },
    cabin_number: {
      type: String,
      default: "Cabin 104",
    },
    consultation_start_time: String,
    consultation_end_time: String,
    duration_minutes: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["Walk-in", "Online", "Follow-up", "Emergency"],
      default: "Walk-in",
    },
    consultation_type: {
      type: String,
      enum: ["In-Person", "Teleconsultation"],
      default: "In-Person",
    },
    status: {
      type: String,
      enum: ["scheduled", "waiting", "in_consultation", "completed", "cancelled", "no_show"],
      default: "waiting",
      index: true,
    },
    chief_complaint: {
      type: String,
      default: "Routine consultation",
    },
    priority: {
      type: String,
      enum: ["Normal", "Urgent", "Emergency", "Senior Citizen", "Follow-up"],
      default: "Normal",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.appointmentId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

AppointmentSchema.pre("save", async function (next) {
  if (!this.appointmentId) {
    const highest = await this.constructor.findOne().sort("-appointmentId");
    this.appointmentId = highest && highest.appointmentId ? highest.appointmentId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
