const mongoose = require("mongoose");
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore DNS config errors if in restricted environment
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is missing.");
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB_NAME || "hospital",
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection runtime error:", err.message);
});

module.exports = connectDB;
