require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore in environments where custom DNS servers cannot be set
}

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const doctorStatusRoutes = require("./routes/doctorStatusRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const bedRoutes = require("./routes/bedRoutes");
const nursingRoutes = require("./routes/nursingRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const labRoutes = require("./routes/labRoutes");
const radiologyRoutes = require("./routes/radiologyRoutes");
const billingRoutes = require("./routes/billingRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const emrRoutes = require("./routes/emrRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const auditRoutes = require("./routes/auditRoutes");
const seedRoutes = require("./routes/seedRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Enable reverse proxy trust (Render, Railway, Heroku, AWS ELB)
app.set("trust proxy", 1);

// Security Middleware
app.use(helmet());

// Build Allowed Origins list
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  allowedOrigins.push(...envOrigins);
}

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, "");
      const isAllowed = allowedOrigins.some(
        (allowed) => allowed.replace(/\/+$/, "") === normalizedOrigin
      );

      if (isAllowed) {
        return callback(null, true);
      }

      // In non-production, be permissive for local development
      if (!isProduction) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: Origin ${origin} is not allowed by CORS policy.`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Body parsing and Cookie parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

  res.status(200).json({
    status: "ok",
    service: "MedCore HMS Express Backend",
    database: states[dbState] || "unknown",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mount
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor-status", doctorStatusRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/nursing", nursingRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/radiology", radiologyRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/emr", emrRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/seed", seedRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Middleware
app.use(errorMiddleware);

// Initialize DB and Start Server
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Database initialized successfully.");
  } catch (err) {
    console.error("⚠️ Failed to connect to MongoDB at startup:", err.message);
    console.warn("⚠️ Server will start, but database queries will fail until MongoDB is running.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 MedCore HMS Backend Server listening on port ${PORT}`);
    console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Allowed Frontend Origins: ${allowedOrigins.join(", ")}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
