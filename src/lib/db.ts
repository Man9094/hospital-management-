import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  // On Vercel or read-only serverless environments, /var/task is read-only
  // The only writable directory is /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpPath = path.join("/tmp", "medcore.db");
    const localBundledPath = path.join(process.cwd(), "data", "medcore.db");
    if (!fs.existsSync(tmpPath) && fs.existsSync(localBundledPath)) {
      try {
        fs.copyFileSync(localBundledPath, tmpPath);
      } catch (e) {
        console.warn("Could not copy bundled DB to /tmp:", e);
      }
    }
    return tmpPath;
  }

  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, "medcore.db");
  } catch {
    return path.join("/tmp", "medcore.db");
  }
}

const DB_PATH = getDatabasePath();
const db = new Database(DB_PATH);

// Enable WAL mode if supported, fallback to DELETE journal mode
try {
  db.pragma("journal_mode = WAL");
} catch {
  try {
    db.pragma("journal_mode = DELETE");
  } catch (e) {
    console.warn("Could not set journal mode:", e);
  }
}

try {
  db.pragma("foreign_keys = ON");
} catch (e) {
  console.warn("Could not enable foreign keys:", e);
}

// ─── INITIALIZE COMPREHENSIVE MEDCORE HMS SCHEMA ───────────────
db.exec(`
  -- 1. HOSPITALS & BRANCHES
  CREATE TABLE IF NOT EXISTS hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    registration_number TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gst_number TEXT,
    abha_facility_id TEXT,
    logo_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- 2. DEPARTMENTS
  CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL DEFAULT 'HOSP-001',
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    head_doctor_name TEXT,
    location TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
  );

  -- 3. USERS (STAFF & PATIENTS)
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN (
      'super_admin', 'hospital_admin', 'doctor', 'nurse', 'reception', 
      'lab', 'radiology', 'pharmacist', 'billing', 'accountant', 'hr', 'patient'
    )),
    department_id TEXT,
    qualification TEXT,
    registration_number TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

  -- 4. PATIENTS (UNIFIED UHID FOUNDATION)
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uhid TEXT NOT NULL UNIQUE, -- e.g. MC-2026-000101
    full_name TEXT NOT NULL,
    dob TEXT,
    age INTEGER,
    gender TEXT NOT NULL CHECK(gender IN ('Male', 'Female', 'Other')),
    mobile TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    blood_group TEXT CHECK(blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    allergies TEXT,
    chronic_conditions TEXT,
    abha_id TEXT, -- e.g. 91-8812-4019-3391
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inpatient', 'discharged', 'deceased')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_patients_uhid ON patients(uhid);
  CREATE INDEX IF NOT EXISTS idx_patients_mobile ON patients(mobile);
  CREATE INDEX IF NOT EXISTS idx_patients_abha ON patients(abha_id);
  CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(full_name);

  -- 5. APPOINTMENTS & OPD QUEUE
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_number TEXT NOT NULL UNIQUE, -- e.g. APT-2026-001
    patient_uhid TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    department_id TEXT,
    appointment_date TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    token_number TEXT NOT NULL, -- e.g. A-101
    case_number INTEGER, -- e.g. 1, 2, 3 (Sequential daily case slot)
    cabin_number TEXT DEFAULT 'Cabin 104', -- Cabin/Room allocated
    consultation_start_time TEXT, -- e.g. 2026-09-11T10:05:00Z
    consultation_end_time TEXT, -- e.g. 2026-09-11T10:18:00Z
    duration_minutes REAL DEFAULT 0, -- Duration spent in minutes (e.g. 13.0)
    type TEXT NOT NULL DEFAULT 'Walk-in' CHECK(type IN ('Walk-in', 'Online', 'Follow-up', 'Emergency')),
    consultation_type TEXT NOT NULL DEFAULT 'In-Person' CHECK(consultation_type IN ('In-Person', 'Teleconsultation')),
    status TEXT NOT NULL DEFAULT 'waiting' CHECK(status IN ('scheduled', 'waiting', 'in_consultation', 'completed', 'cancelled', 'no_show')),
    chief_complaint TEXT,
    priority TEXT NOT NULL DEFAULT 'Normal' CHECK(priority IN ('Normal', 'Urgent', 'Emergency', 'Senior Citizen', 'Follow-up')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_appointments_uhid ON appointments(patient_uhid);
  CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
  CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);

  -- 6. VITALS RECORDS
  CREATE TABLE IF NOT EXISTS vitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_uhid TEXT NOT NULL,
    appointment_id INTEGER,
    ipd_admission_id INTEGER,
    recorded_by INTEGER,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    heart_rate INTEGER,
    temperature REAL, -- in Fahrenheit
    spo2 INTEGER, -- in %
    respiratory_rate INTEGER,
    weight_kg REAL,
    height_cm REAL,
    bmi REAL,
    blood_glucose REAL,
    notes TEXT,
    is_abnormal INTEGER NOT NULL DEFAULT 0,
    recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_vitals_uhid ON vitals(patient_uhid);

  -- 7. CLINICAL NOTES / EMR CONSULTATIONS
  CREATE TABLE IF NOT EXISTS clinical_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_uhid TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    visit_date TEXT NOT NULL DEFAULT (datetime('now')),
    chief_complaint TEXT NOT NULL,
    history_present_illness TEXT,
    past_medical_history TEXT,
    examination_findings TEXT,
    diagnosis TEXT NOT NULL,
    icd10_code TEXT,
    treatment_plan TEXT,
    follow_up_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_notes_uhid ON clinical_notes(patient_uhid);

  -- 8. PRESCRIPTIONS & PRESCRIPTION ITEMS
  CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rx_number TEXT NOT NULL UNIQUE, -- e.g. RX-2026-0001
    patient_uhid TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    diagnosis TEXT,
    general_advice TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'dispensed', 'partially_dispensed', 'cancelled')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS prescription_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prescription_id INTEGER NOT NULL,
    medicine_name TEXT NOT NULL,
    generic_name TEXT,
    dosage TEXT NOT NULL, -- e.g. 500mg
    frequency TEXT NOT NULL, -- e.g. 1-0-1 (Twice Daily)
    timing TEXT NOT NULL DEFAULT 'After Food' CHECK(timing IN ('After Food', 'Before Food', 'With Food', 'Bedtime', 'As Needed')),
    duration_days INTEGER NOT NULL, -- e.g. 5
    quantity INTEGER NOT NULL, -- e.g. 10
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
  );

  -- 9. WARDS & BEDS (IPD MATRIX)
  CREATE TABLE IF NOT EXISTS wards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ward_type TEXT NOT NULL CHECK(ward_type IN ('General', 'Semi-Private', 'Deluxe', 'ICU', 'NICU', 'Emergency', 'Post-Op')),
    floor TEXT NOT NULL,
    total_beds INTEGER NOT NULL DEFAULT 10,
    charge_per_day REAL NOT NULL DEFAULT 1500,
    status TEXT NOT NULL DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS beds (
    id TEXT PRIMARY KEY, -- e.g. ICU-101, GEN-201
    ward_id TEXT NOT NULL,
    bed_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'occupied', 'reserved', 'cleaning', 'maintenance')),
    current_patient_uhid TEXT,
    allocated_at TEXT,
    FOREIGN KEY (ward_id) REFERENCES wards(id) ON DELETE CASCADE,
    FOREIGN KEY (current_patient_uhid) REFERENCES patients(uhid) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_beds_ward ON beds(ward_id);
  CREATE INDEX IF NOT EXISTS idx_beds_status ON beds(status);

  -- 10. IPD ADMISSIONS & DISCHARGE
  CREATE TABLE IF NOT EXISTS ipd_admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admission_number TEXT NOT NULL UNIQUE, -- e.g. IPD-2026-001
    patient_uhid TEXT NOT NULL,
    bed_id TEXT NOT NULL,
    admitting_doctor_id INTEGER NOT NULL,
    primary_nurse_id INTEGER,
    admission_date TEXT NOT NULL DEFAULT (datetime('now')),
    admission_reason TEXT NOT NULL,
    initial_diagnosis TEXT,
    discharge_date TEXT,
    discharge_type TEXT CHECK(discharge_type IN ('Normal', 'Against Medical Advice (LAMA)', 'Transferred', 'Deceased')),
    discharge_summary TEXT,
    discharge_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'admitted' CHECK(status IN ('admitted', 'transferred', 'discharged')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE CASCADE,
    FOREIGN KEY (admitting_doctor_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_ipd_uhid ON ipd_admissions(patient_uhid);
  CREATE INDEX IF NOT EXISTS idx_ipd_status ON ipd_admissions(status);

  -- 11. NURSING DAILY LOGS & ORDERS
  CREATE TABLE IF NOT EXISTS nursing_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ipd_admission_id INTEGER NOT NULL,
    patient_uhid TEXT NOT NULL,
    nurse_id INTEGER NOT NULL,
    shift TEXT NOT NULL CHECK(shift IN ('Morning', 'Evening', 'Night')),
    notes TEXT NOT NULL,
    iv_fluids TEXT,
    intake_output TEXT,
    medication_administered TEXT,
    recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ipd_admission_id) REFERENCES ipd_admissions(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (nurse_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 12. LABORATORY (LIS) - TEST CATALOG, ORDERS & RESULTS
  CREATE TABLE IF NOT EXISTS lab_tests (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Hematology, Biochemistry, Microbiology, Serology
    sample_type TEXT NOT NULL, -- Whole Blood, Serum, Urine, Swab
    reference_range TEXT,
    unit TEXT,
    standard_rate REAL NOT NULL,
    turnaround_time_hours INTEGER NOT NULL DEFAULT 4
  );

  CREATE TABLE IF NOT EXISTS lab_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE, -- e.g. LAB-2026-001
    patient_uhid TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    test_id TEXT NOT NULL,
    sample_barcode TEXT,
    status TEXT NOT NULL DEFAULT 'ordered' CHECK(status IN ('ordered', 'sample_collected', 'processing', 'result_ready', 'verified', 'cancelled')),
    sample_collected_at TEXT,
    result_value TEXT,
    result_unit TEXT,
    reference_range TEXT,
    is_critical INTEGER NOT NULL DEFAULT 0,
    pathologist_id INTEGER,
    verified_at TEXT,
    remarks TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES lab_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (pathologist_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_lab_uhid ON lab_orders(patient_uhid);
  CREATE INDEX IF NOT EXISTS idx_lab_status ON lab_orders(status);

  -- 13. RADIOLOGY (RIS) - STUDIES & REPORTS
  CREATE TABLE IF NOT EXISTS radiology_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE, -- e.g. RAD-2026-001
    patient_uhid TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    modality TEXT NOT NULL CHECK(modality IN ('X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Echocardiogram')),
    body_part TEXT NOT NULL,
    clinical_indication TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'study_completed', 'report_drafted', 'verified')),
    pacs_image_url TEXT,
    findings TEXT,
    impression TEXT,
    radiologist_id INTEGER,
    verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (radiologist_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_rad_uhid ON radiology_orders(patient_uhid);

  -- 14. PHARMACY INVENTORY & FEFO BATCHES
  CREATE TABLE IF NOT EXISTS pharmacy_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code TEXT NOT NULL UNIQUE,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    category TEXT NOT NULL, -- Tablet, Syrup, Injection, Ointment, IV Fluid, Consumable
    unit TEXT NOT NULL, -- Strip, Bottle, Ampoule, Box
    hsn_code TEXT,
    gst_rate REAL NOT NULL DEFAULT 12.0, -- 5%, 12%, 18%
    reorder_level INTEGER NOT NULL DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS medicine_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    batch_number TEXT NOT NULL,
    expiry_date TEXT NOT NULL, -- YYYY-MM
    mrp REAL NOT NULL,
    purchase_price REAL NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (item_id) REFERENCES pharmacy_items(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_batches_expiry ON medicine_batches(expiry_date);

  -- 15. EMERGENCY (ER) TRIAGE DESK
  CREATE TABLE IF NOT EXISTS emergency_triage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    er_number TEXT NOT NULL UNIQUE,
    patient_uhid TEXT NOT NULL,
    triage_color TEXT NOT NULL CHECK(triage_color IN ('Red', 'Orange', 'Yellow', 'Green')),
    triage_reason TEXT NOT NULL,
    arrival_mode TEXT NOT NULL CHECK(arrival_mode IN ('Ambulance', 'Walk-in', 'Police Referral', 'Hospital Transfer')),
    assigned_doctor_id INTEGER,
    bed_allocated TEXT,
    disposition TEXT CHECK(disposition IN ('ICU Admission', 'IPD Ward', 'Emergency OT', 'Discharged', 'Transferred')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'stabilized', 'admitted', 'discharged', 'transferred')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE
  );

  -- 16. OT (OPERATION THEATRE) MANAGEMENT
  CREATE TABLE IF NOT EXISTS ot_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_number TEXT NOT NULL UNIQUE,
    patient_uhid TEXT NOT NULL,
    procedure_name TEXT NOT NULL,
    ot_room TEXT NOT NULL,
    lead_surgeon_id INTEGER NOT NULL,
    anesthetist_name TEXT,
    scheduled_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    pre_op_checklist_verified INTEGER NOT NULL DEFAULT 0,
    post_op_notes TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'in_progress', 'completed', 'postponed', 'cancelled')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE,
    FOREIGN KEY (lead_surgeon_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 17. BLOOD BANK INVENTORY
  CREATE TABLE IF NOT EXISTS blood_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_number TEXT NOT NULL UNIQUE,
    blood_group TEXT NOT NULL CHECK(blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    component TEXT NOT NULL CHECK(component IN ('Whole Blood', 'Packed Red Blood Cells (PRBC)', 'Fresh Frozen Plasma (FFP)', 'Platelet Concentrate')),
    volume_ml INTEGER NOT NULL DEFAULT 350,
    collection_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    testing_status TEXT NOT NULL DEFAULT 'tested_safe' CHECK(testing_status IN ('pending', 'tested_safe', 'discarded')),
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'reserved', 'issued', 'expired')),
    issued_to_uhid TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (issued_to_uhid) REFERENCES patients(uhid) ON DELETE SET NULL
  );

  -- 18. BILLING, INVOICES & PAYMENTS
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL UNIQUE, -- e.g. INV-2026-0001
    patient_uhid TEXT NOT NULL,
    bill_type TEXT NOT NULL CHECK(bill_type IN ('OPD Consultation', 'IPD Final Bill', 'Pharmacy', 'Lab Test', 'Radiology', 'Emergency', 'Package')),
    subtotal REAL NOT NULL DEFAULT 0,
    discount_amount REAL NOT NULL DEFAULT 0,
    gst_amount REAL NOT NULL DEFAULT 0,
    total_amount REAL NOT NULL DEFAULT 0,
    insurance_share REAL NOT NULL DEFAULT 0,
    patient_payable REAL NOT NULL DEFAULT 0,
    paid_amount REAL NOT NULL DEFAULT 0,
    outstanding_amount REAL NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending', 'partially_paid', 'paid', 'claim_in_process', 'cancelled')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    item_description TEXT NOT NULL,
    category TEXT NOT NULL, -- Consultation, Bed, Nursing, Lab, Radiology, Pharmacy, Procedure
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price REAL NOT NULL,
    gst_percent REAL NOT NULL DEFAULT 0,
    total_price REAL NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_number TEXT NOT NULL UNIQUE, -- e.g. RCP-2026-0001
    invoice_id INTEGER NOT NULL,
    patient_uhid TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_mode TEXT NOT NULL CHECK(payment_mode IN ('UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'TPA Claim', 'PM-JAY')),
    transaction_reference TEXT,
    received_by INTEGER,
    payment_date TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE
  );

  -- 19. INSURANCE & TPA CLAIMS (PM-JAY / CASHLESS)
  CREATE TABLE IF NOT EXISTS insurance_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_number TEXT NOT NULL UNIQUE,
    invoice_id INTEGER NOT NULL,
    patient_uhid TEXT NOT NULL,
    insurance_company TEXT NOT NULL, -- e.g. Star Health, PM-JAY Ayushman Bharat, ICICI Lombard, Bajaj Allianz
    tpa_name TEXT, -- e.g. Medi Assist, Paramount, MD India
    policy_number TEXT NOT NULL,
    pre_auth_status TEXT NOT NULL DEFAULT 'approved' CHECK(pre_auth_status IN ('pending', 'approved', 'rejected', 'query_raised')),
    pre_auth_amount REAL NOT NULL DEFAULT 0,
    claimed_amount REAL NOT NULL DEFAULT 0,
    settled_amount REAL NOT NULL DEFAULT 0,
    claim_status TEXT NOT NULL DEFAULT 'submitted' CHECK(claim_status IN ('draft', 'submitted', 'under_review', 'query_raised', 'approved', 'rejected', 'settled')),
    settlement_date TEXT,
    remarks TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_uhid) REFERENCES patients(uhid) ON DELETE CASCADE
  );

  -- 20. AUDIT LOGS (IMMUTABLE LOGGING)
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_name TEXT,
    role TEXT,
    action TEXT NOT NULL, -- LOGIN, VIEW_PATIENT, UPDATE_PRESCRIPTION, DISPENSE_MEDICINE, ADMIT_PATIENT, BILL_CREATED, etc.
    module TEXT NOT NULL, -- EMR, OPD, IPD, LIS, RIS, Pharmacy, Billing, Auth, Admin
    patient_uhid TEXT,
    details TEXT,
    ip_address TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_logs(module);
  CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(timestamp);
  CREATE INDEX IF NOT EXISTS idx_audit_uhid ON audit_logs(patient_uhid);

  -- 21. PASSWORD RESET TOKENS & LOGIN ATTEMPTS
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    email TEXT NOT NULL,
    success INTEGER NOT NULL DEFAULT 0,
    attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- 22. DOCTOR LIVE CABIN STATUS & DELAY MANAGEMENT
  CREATE TABLE IF NOT EXISTS doctor_status (
    doctor_id INTEGER PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'in_cabin', 'running_late', 'on_rounds', 'emergency_call', 'on_break')),
    delay_minutes INTEGER NOT NULL DEFAULT 0,
    delay_reason TEXT,
    cabin_number TEXT NOT NULL DEFAULT 'Cabin 104',
    active_case_number INTEGER,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- 23. PATIENT OTP AUTHENTICATION
  CREATE TABLE IF NOT EXISTS patient_otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_patient_otps_ident ON patient_otps(identifier);

  -- 24. WHATSAPP AUTOMATED GATEWAY SETTINGS & TRANSMISSION LOGS
  CREATE TABLE IF NOT EXISTS whatsapp_gateway_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hospital_number TEXT NOT NULL DEFAULT '+91 79 2658 9000',
    sender_name TEXT NOT NULL DEFAULT 'Apex MedCore Hospital',
    provider TEXT NOT NULL DEFAULT 'auto_gateway',
    api_endpoint TEXT,
    api_key TEXT,
    instance_id TEXT,
    is_enabled INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL UNIQUE,
    recipient_phone TEXT NOT NULL,
    patient_uhid TEXT,
    otp_code TEXT NOT NULL,
    message_body TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'delivered',
    gateway_response TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_wa_phone ON whatsapp_messages(recipient_phone);
  CREATE INDEX IF NOT EXISTS idx_wa_time ON whatsapp_messages(created_at);
`);

// Safe column migrations for existing SQLite database file
try {
  const tableInfo = db.prepare(`PRAGMA table_info(appointments)`).all() as Array<{ name: string }>;
  const existingCols = new Set(tableInfo.map((col) => col.name));

  if (!existingCols.has("case_number")) {
    db.prepare(`ALTER TABLE appointments ADD COLUMN case_number INTEGER`).run();
  }
  if (!existingCols.has("cabin_number")) {
    db.prepare(`ALTER TABLE appointments ADD COLUMN cabin_number TEXT DEFAULT 'Cabin 104'`).run();
  }
  if (!existingCols.has("consultation_start_time")) {
    db.prepare(`ALTER TABLE appointments ADD COLUMN consultation_start_time TEXT`).run();
  }
  if (!existingCols.has("consultation_end_time")) {
    db.prepare(`ALTER TABLE appointments ADD COLUMN consultation_end_time TEXT`).run();
  }
  if (!existingCols.has("duration_minutes")) {
    db.prepare(`ALTER TABLE appointments ADD COLUMN duration_minutes REAL DEFAULT 0`).run();
  }

  db.prepare(`CREATE INDEX IF NOT EXISTS idx_appointments_case ON appointments(case_number)`).run();
} catch (migErr) {
  console.log("DB migration info:", migErr);
}

// Auto-seed default hospital & users if users table is empty
try {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount && userCount.count === 0) {
    const DEMO_PASSWORD = "MedCore@2026";
    const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

    db.prepare(`
      INSERT OR IGNORE INTO hospitals (id, name, tagline, registration_number, email, phone, address, city, state, pincode, gst_number, abha_facility_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "HOSP-001",
      "Apex MedCore Superspeciality Hospital",
      "Indian Hospital Operating System & Advanced Healthcare Center",
      "GJ-AHM-MED-2024-8841",
      "contact@apexmedcore.in",
      "+91 79 2658 9000",
      "Plot 42, SG Highway, Bodakdev",
      "Ahmedabad",
      "Gujarat",
      "380054",
      "24AAACH1234F1Z5",
      "IN2400049182"
    );

    const departments = [
      { id: "DEP-MED", name: "General Medicine", code: "MED", head: "Dr. Rajesh Patel", loc: "Ground Floor, Block A" },
      { id: "DEP-CARD", name: "Cardiology", code: "CARD", head: "Dr. Sneha Shah", loc: "2nd Floor, Heart Wing" },
      { id: "DEP-ORTH", name: "Orthopedics & Joint Replacement", code: "ORTH", head: "Dr. Amit Mehta", loc: "1st Floor, Block B" },
      { id: "DEP-PED", name: "Pediatrics & Neonatology", code: "PED", head: "Dr. Pooja Joshi", loc: "3rd Floor, Mother & Child" },
      { id: "DEP-SURG", name: "General & Laparoscopic Surgery", code: "SURG", head: "Dr. Vikram Deshmukh", loc: "4th Floor, OT Complex" },
      { id: "DEP-EMER", name: "Emergency & Trauma Command", code: "EMER", head: "Dr. Sandeep Rao", loc: "Ground Floor, ER Bay" },
      { id: "DEP-LAB", name: "Pathology & Diagnostics (LIS)", code: "LAB", head: "Dr. Kirit Solanki", loc: "Basement 1" },
      { id: "DEP-RAD", name: "Radiology & Imaging (RIS)", code: "RAD", head: "Dr. Alpa Bhatt", loc: "Ground Floor, Imaging Wing" },
      { id: "DEP-PHARM", name: "Pharmacy & Store", code: "PHARM", head: "Pravin Bhai Parmar", loc: "Ground Floor, Main Lobby" },
      { id: "DEP-ADMIN", name: "Hospital Administration & Billing", code: "ADMIN", head: "Priya Sharma", loc: "5th Floor, Executive Wing" }
    ];

    const insertDept = db.prepare(`
      INSERT OR IGNORE INTO departments (id, hospital_id, name, code, head_doctor_name, location, status)
      VALUES (?, 'HOSP-001', ?, ?, ?, ?, 'active')
    `);
    for (const d of departments) {
      insertDept.run(d.id, d.name, d.code, d.head, d.loc);
    }

    const staffUsers = [
      { name: "Rajesh Kumar", email: "superadmin@medcore.in", role: "super_admin", dept: "DEP-ADMIN", qual: "M.Tech, MBA", reg: "SYS-001" },
      { name: "Priya Sharma", email: "admin@medcore.in", role: "hospital_admin", dept: "DEP-ADMIN", qual: "MHA (Hospital Admin)", reg: "MHA-2018-91" },
      { name: "Dr. Rajesh Patel", email: "doctor@medcore.in", role: "doctor", dept: "DEP-MED", qual: "M.D. (Internal Medicine), FICP", reg: "GMC-G-40912" },
      { name: "Dr. Sneha Shah", email: "doctor.shah@medcore.in", role: "doctor", dept: "DEP-CARD", qual: "M.D., D.M. (Cardiology)", reg: "GMC-G-38102" },
      { name: "Dr. Amit Mehta", email: "doctor.mehta@medcore.in", role: "doctor", dept: "DEP-ORTH", qual: "M.S. (Orthopedics), MCh", reg: "GMC-G-44190" },
      { name: "Sister Anjali Nair", email: "nurse@medcore.in", role: "nurse", dept: "DEP-MED", qual: "B.Sc Nursing, Critical Care", reg: "GNC-N-50124" },
      { name: "Elena Rostova", email: "reception@medcore.in", role: "reception", dept: "DEP-ADMIN", qual: "B.Com, Healthcare Mgmt", reg: "STF-2022-10" },
      { name: "David Chen", email: "lab@medcore.in", role: "lab", dept: "DEP-LAB", qual: "M.Sc (Medical Laboratory Tech)", reg: "MLT-88912" },
      { name: "Dr. Alpa Bhatt", email: "radiology@medcore.in", role: "radiology", dept: "DEP-RAD", qual: "M.D. (Radio-Diagnosis)", reg: "GMC-G-29910" },
      { name: "Maria Santos", email: "pharmacy@medcore.in", role: "pharmacist", dept: "DEP-PHARM", qual: "B.Pharm, Registered Pharmacist", reg: "GPC-P-99214" },
      { name: "Ketan Trivedi", email: "billing@medcore.in", role: "billing", dept: "DEP-ADMIN", qual: "B.Com, GST & TPA Specialist", reg: "ACC-2021-08" },
      { name: "Alexander Vance (Patient)", email: "patient@medcore.in", role: "patient", dept: null, qual: "Patient Portal User", reg: "PAT-001" }
    ];

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password_hash, role, department_id, qualification, registration_number, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `);
    for (const u of staffUsers) {
      insertUser.run(u.name, u.email, passwordHash, u.role, u.dept, u.qual, u.reg);
    }
  }
} catch (seedErr) {
  console.warn("Auto-seed error:", seedErr);
}

export default db;
