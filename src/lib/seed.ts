/**
 * MedCore HMS — Database Seed Script
 * 
 * Run with: npm run seed
 * Creates demo accounts for all 7 roles with hashed passwords.
 * Idempotent: skips if accounts already exist.
 */

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "medcore.db");

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Ensure tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'hospital_admin', 'doctor', 'patient', 'reception', 'lab', 'pharmacy')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login TEXT
  );
`);

const DEMO_PASSWORD = "MedCore@2026";
const SALT_ROUNDS = 12;

interface SeedUser {
  name: string;
  email: string;
  role: string;
}

const seedUsers: SeedUser[] = [
  {
    name: "Rajesh Kumar (Super Admin)",
    email: "superadmin@medcore.in",
    role: "super_admin",
  },
  {
    name: "Priya Sharma",
    email: "admin@medcore.in",
    role: "hospital_admin",
  },
  {
    name: "Dr. Sarah Jenkins",
    email: "doctor@medcore.in",
    role: "doctor",
  },
  {
    name: "Alexander Vance",
    email: "patient@medcore.in",
    role: "patient",
  },
  {
    name: "Elena Rostova",
    email: "reception@medcore.in",
    role: "reception",
  },
  {
    name: "David Chen",
    email: "lab@medcore.in",
    role: "lab",
  },
  {
    name: "Maria Santos",
    email: "pharmacy@medcore.in",
    role: "pharmacy",
  },
];

async function seed() {
  console.log("🏥 MedCore HMS — Seeding Database...\n");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, status)
    VALUES (?, ?, ?, ?, 'active')
  `);

  const checkStmt = db.prepare(`SELECT id FROM users WHERE email = ?`);

  let created = 0;
  let skipped = 0;

  for (const user of seedUsers) {
    const existing = checkStmt.get(user.email);
    if (existing) {
      console.log(`  ⏭  ${user.role.padEnd(16)} — ${user.email} (already exists)`);
      skipped++;
    } else {
      insertStmt.run(user.name, user.email, passwordHash, user.role);
      console.log(`  ✅ ${user.role.padEnd(16)} — ${user.email} (created)`);
      created++;
    }
  }

  console.log(`\n📊 Results: ${created} created, ${skipped} skipped`);
  console.log(`🔑 Demo password for all accounts: ${DEMO_PASSWORD}`);
  console.log(`📁 Database location: ${DB_PATH}\n`);

  db.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
