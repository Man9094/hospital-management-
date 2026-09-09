/**
 * MedCore HMS — Comprehensive Indian Hospital Seed Script
 * 
 * Run with: npm run seed
 * Populates realistic Indian hospital master data, staff accounts across all 12 roles,
 * UHID patient records, OPD/IPD queues, LIS/RIS catalog, pharmacy stock, and billing.
 */

import db from "./db";
import bcrypt from "bcryptjs";

const DEMO_PASSWORD = "MedCore@2026";
const SALT_ROUNDS = 10;

export async function runSeed() {
  console.log("🏥 MedCore HMS — Seeding Realistic Indian Hospital Database...\n");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  // 1. HOSPITAL
  db.prepare(`
    INSERT OR REPLACE INTO hospitals (id, name, tagline, registration_number, email, phone, address, city, state, pincode, gst_number, abha_facility_id)
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

  // 2. DEPARTMENTS
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
    INSERT OR REPLACE INTO departments (id, hospital_id, name, code, head_doctor_name, location, status)
    VALUES (?, 'HOSP-001', ?, ?, ?, ?, 'active')
  `);
  for (const d of departments) {
    insertDept.run(d.id, d.name, d.code, d.head, d.loc);
  }

  // 3. STAFF & USERS (12 ROLES)
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
    INSERT OR REPLACE INTO users (name, email, password_hash, role, department_id, qualification, registration_number, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `);
  for (const u of staffUsers) {
    insertUser.run(u.name, u.email, passwordHash, u.role, u.dept, u.qual, u.reg);
  }

  // 4. WARDS & BEDS
  const wards = [
    { id: "WARD-ICU", name: "Intensive Care Unit (ICU)", type: "ICU", floor: "2nd Floor", total: 12, rate: 6500 },
    { id: "WARD-GEN-M", name: "General Ward (Male)", type: "General", floor: "3rd Floor", total: 20, rate: 1200 },
    { id: "WARD-GEN-F", name: "General Ward (Female)", type: "General", floor: "3rd Floor", total: 20, rate: 1200 },
    { id: "WARD-SEMI", name: "Semi-Private Ward", type: "Semi-Private", floor: "4th Floor", total: 16, rate: 2800 },
    { id: "WARD-DELUXE", name: "Deluxe Private Rooms", type: "Deluxe", floor: "5th Floor", total: 10, rate: 5500 },
    { id: "WARD-EMER", name: "Emergency Observation Bay", type: "Emergency", floor: "Ground Floor", total: 8, rate: 2000 }
  ];

  const insertWard = db.prepare(`
    INSERT OR REPLACE INTO wards (id, name, ward_type, floor, total_beds, charge_per_day, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `);
  for (const w of wards) {
    insertWard.run(w.id, w.name, w.type, w.floor, w.total, w.rate);
  }

  // 5. PATIENTS (UNIFIED UHID DIRECTORY)
  const patients = [
    {
      uhid: "MC-2026-000101",
      name: "Rameshbhai Patel",
      age: 58,
      gender: "Male",
      mobile: "+91 98250 14892",
      email: "ramesh.patel@gmail.com",
      address: "B-204 Shivalik Heights, Satellite",
      city: "Ahmedabad",
      state: "Gujarat",
      blood: "B+",
      allergies: "Penicillin, Sulfa drugs",
      chronic: "Type 2 Diabetes, Hypertension",
      abha: "91-4091-2094-1102",
      insurance: "Star Health & Allied Insurance",
      policy: "SH-90412891",
      em_name: "Ketan Patel (Son)",
      em_phone: "+91 98250 99881",
      status: "inpatient"
    },
    {
      uhid: "MC-2026-000102",
      name: "Sunitaben Shah",
      age: 46,
      gender: "Female",
      mobile: "+91 94260 88123",
      email: "sunita.shah@yahoo.in",
      address: "12, Sharda Society, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      blood: "O+",
      allergies: "None known",
      chronic: "Mild Hypothyroidism",
      abha: "91-8812-4019-3391",
      insurance: "PM-JAY Ayushman Bharat",
      policy: "PMJAY-GJ-2024-8841",
      em_name: "Nilesh Shah (Husband)",
      em_phone: "+91 94260 77112",
      status: "inpatient"
    },
    {
      uhid: "MC-2026-000103",
      name: "Kishorbhai Joshi",
      age: 63,
      gender: "Male",
      mobile: "+91 97277 55432",
      email: "kishor.joshi@gmail.com",
      address: "Flat 401, Galaxy Tower, Vastrapur",
      city: "Ahmedabad",
      state: "Gujarat",
      blood: "A+",
      allergies: "Aspirin, NSAIDs",
      chronic: "Coronary Artery Disease (CAD)",
      abha: "91-5512-9901-4432",
      insurance: "HDFC ERGO General Insurance",
      policy: "HD-MED-2025-1049",
      em_name: "Meena Joshi (Wife)",
      em_phone: "+91 97277 55430",
      status: "inpatient"
    },
    {
      uhid: "MC-2026-000104",
      name: "Vikram Rathore",
      age: 52,
      gender: "Male",
      mobile: "+91 99090 12345",
      email: "v.rathore@outlook.com",
      address: "Plot 88, Sector 21",
      city: "Gandhinagar",
      state: "Gujarat",
      blood: "AB+",
      allergies: "None",
      chronic: "Acute Coronary Syndrome post Angioplasty",
      abha: "91-2290-7711-8823",
      insurance: "ICICI Lombard Health Shield",
      policy: "IC-884019-2026",
      em_name: "Anita Rathore (Wife)",
      em_phone: "+91 99090 54321",
      status: "inpatient"
    },
    {
      uhid: "MC-2026-000105",
      name: "Manjulaben Prajapati",
      age: 71,
      gender: "Female",
      mobile: "+91 98980 44556",
      email: "manjula.prajapati@rediffmail.com",
      address: "5, Ramnagar Society, Sabarmati",
      city: "Ahmedabad",
      state: "Gujarat",
      blood: "O-",
      allergies: "Ciprofloxacin",
      chronic: "Chronic Kidney Disease Stage 3",
      abha: "91-7712-4401-2299",
      insurance: "PM-JAY Ayushman Bharat",
      policy: "PMJAY-GJ-2025-9921",
      em_name: "Bharat Prajapati (Son)",
      em_phone: "+91 98980 11223",
      status: "inpatient"
    },
    {
      uhid: "MC-2026-000106",
      name: "Alexander Vance",
      age: 38,
      gender: "Male",
      mobile: "+91 98240 66778",
      email: "patient@medcore.in",
      address: "A-502, Iscon Elegance, Prahlad Nagar",
      city: "Ahmedabad",
      state: "Gujarat",
      blood: "O+",
      allergies: "Penicillin",
      chronic: "Mild Asthma, Allergic Rhinitis",
      abha: "91-3312-9988-1144",
      insurance: "Bajaj Allianz Health Guard",
      policy: "BA-991204-2025",
      em_name: "Claire Vance (Spouse)",
      em_phone: "+91 98240 66779",
      status: "active"
    },
    {
      uhid: "MC-2026-000107",
      name: "Dr. Ananya Iyer",
      age: 34,
      gender: "Female",
      mobile: "+91 98795 33211",
      email: "ananya.iyer@gmail.com",
      address: "Tower 3, Godrej Garden City",
      city: "Ahmedabad",
      state: "Gujarat",
      blood: "A-",
      allergies: "Latex",
      chronic: "None",
      abha: "91-4491-0022-8877",
      insurance: "Care Health Insurance",
      policy: "CARE-882190-2026",
      em_name: "Karthik Iyer (Brother)",
      em_phone: "+91 98795 33212",
      status: "active"
    }
  ];

  const insertPatient = db.prepare(`
    INSERT OR REPLACE INTO patients (
      uhid, full_name, age, gender, mobile, email, address, city, state, blood_group,
      allergies, chronic_conditions, abha_id, insurance_provider, insurance_policy_number,
      emergency_contact_name, emergency_contact_phone, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of patients) {
    insertPatient.run(
      p.uhid, p.name, p.age, p.gender, p.mobile, p.email, p.address, p.city, p.state, p.blood,
      p.allergies, p.chronic, p.abha, p.insurance, p.policy, p.em_name, p.em_phone, p.status
    );
  }

  // Pre-populate individual beds
  const insertBed = db.prepare(`
    INSERT OR REPLACE INTO beds (id, ward_id, bed_number, status, current_patient_uhid, allocated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const initialBeds = [
    { id: "ICU-101", ward: "WARD-ICU", num: "Bed 101", status: "occupied", uhid: "MC-2026-000104", time: "2026-09-08 14:30:00" },
    { id: "ICU-102", ward: "WARD-ICU", num: "Bed 102", status: "occupied", uhid: "MC-2026-000105", time: "2026-09-09 03:15:00" },
    { id: "ICU-103", ward: "WARD-ICU", num: "Bed 103", status: "available", uhid: null, time: null },
    { id: "ICU-104", ward: "WARD-ICU", num: "Bed 104", status: "cleaning", uhid: null, time: null },
    { id: "GEN-201", ward: "WARD-GEN-M", num: "Bed 201", status: "occupied", uhid: "MC-2026-000101", time: "2026-09-07 10:00:00" },
    { id: "GEN-202", ward: "WARD-GEN-M", num: "Bed 202", status: "available", uhid: null, time: null },
    { id: "GEN-203", ward: "WARD-GEN-M", num: "Bed 203", status: "available", uhid: null, time: null },
    { id: "GEN-204", ward: "WARD-GEN-M", num: "Bed 204", status: "reserved", uhid: null, time: null },
    { id: "DEL-301", ward: "WARD-DELUXE", num: "Suite 301", status: "occupied", uhid: "MC-2026-000103", time: "2026-09-06 18:00:00" },
    { id: "DEL-302", ward: "WARD-DELUXE", num: "Suite 302", status: "available", uhid: null, time: null },
    { id: "SEMI-401", ward: "WARD-SEMI", num: "Bed 401A", status: "occupied", uhid: "MC-2026-000102", time: "2026-09-08 11:20:00" },
    { id: "SEMI-402", ward: "WARD-SEMI", num: "Bed 401B", status: "available", uhid: null, time: null }
  ];

  for (const b of initialBeds) {
    insertBed.run(b.id, b.ward, b.num, b.status, b.uhid, b.time);
  }

  // 6. APPOINTMENTS (OPD QUEUE)
  const doctorUser = db.prepare(`SELECT id FROM users WHERE email = 'doctor@medcore.in'`).get() as { id: number };
  const cardDoctor = db.prepare(`SELECT id FROM users WHERE email = 'doctor.shah@medcore.in'`).get() as { id: number };

  const appointments = [
    { num: "APT-2026-001", uhid: "MC-2026-000106", doc: doctorUser?.id || 3, dept: "DEP-MED", date: "2026-09-09", slot: "10:00 AM", token: "A-101", status: "in_consultation", complaint: "Persistent dry cough, mild wheezing and fatigue for 4 days" },
    { num: "APT-2026-002", uhid: "MC-2026-000107", doc: cardDoctor?.id || 4, dept: "DEP-CARD", date: "2026-09-09", slot: "10:30 AM", token: "A-102", status: "waiting", complaint: "Routine cardiovascular screening, episodic palpitations" },
    { num: "APT-2026-003", uhid: "MC-2026-000101", doc: doctorUser?.id || 3, dept: "DEP-MED", date: "2026-09-09", slot: "11:00 AM", token: "A-103", status: "waiting", complaint: "Follow-up diabetic HbA1c evaluation & neuropathy review" },
    { num: "APT-2026-004", uhid: "MC-2026-000102", doc: doctorUser?.id || 3, dept: "DEP-MED", date: "2026-09-09", slot: "11:30 AM", token: "A-104", status: "scheduled", complaint: "Thyroid profile review & routine health checkup" }
  ];

  const insertAppt = db.prepare(`
    INSERT OR REPLACE INTO appointments (appointment_number, patient_uhid, doctor_id, department_id, appointment_date, slot_time, token_number, type, consultation_type, status, chief_complaint, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Walk-in', 'In-Person', ?, ?, 'Normal')
  `);
  for (const a of appointments) {
    insertAppt.run(a.num, a.uhid, a.doc, a.dept, a.date, a.slot, a.token, a.status, a.complaint);
  }

  // 7. VITALS RECORDS
  const vitals = [
    { uhid: "MC-2026-000106", appt: 1, sys: 124, dia: 82, hr: 76, temp: 98.4, spo2: 98, rr: 18, wt: 74.5, ht: 175, bmi: 24.3, notes: "Vitals stable. Mild wheeze in right lower zone." },
    { uhid: "MC-2026-000101", appt: 3, sys: 142, dia: 90, hr: 84, temp: 98.6, spo2: 97, rr: 20, wt: 82.0, ht: 168, bmi: 29.0, notes: "BP slightly elevated above target 130/80." },
    { uhid: "MC-2026-000104", appt: null, sys: 130, dia: 84, hr: 88, temp: 99.1, spo2: 95, rr: 22, wt: 78.0, ht: 172, bmi: 26.4, notes: "ICU continuous monitoring. Post-angioplasty." }
  ];

  const insertVital = db.prepare(`
    INSERT INTO vitals (patient_uhid, appointment_id, bp_systolic, bp_diastolic, heart_rate, temperature, spo2, respiratory_rate, weight_kg, height_cm, bmi, notes, is_abnormal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const v of vitals) {
    insertVital.run(v.uhid, v.appt, v.sys, v.dia, v.hr, v.temp, v.spo2, v.rr, v.wt, v.ht, v.bmi, v.notes, v.sys > 140 ? 1 : 0);
  }

  // 8. CLINICAL NOTES (EMR)
  const insertClinical = db.prepare(`
    INSERT OR REPLACE INTO clinical_notes (id, patient_uhid, doctor_id, appointment_id, chief_complaint, history_present_illness, examination_findings, diagnosis, icd10_code, treatment_plan, follow_up_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertClinical.run(
    1,
    "MC-2026-000106",
    doctorUser?.id || 3,
    1,
    "4-day history of productive cough, mild wheezing on exertion",
    "Patient has prior history of mild asthma. Symptoms aggravated after dust exposure. No fever or hemoptysis.",
    "Bilateral vesicular breath sounds with scattered expiratory rhonchi in right base. Throat mildly congested.",
    "Acute Bronchitis with Reactive Airway Disease Exacerbation",
    "J20.9",
    "1. Inhaled Budesonide + Formoterol DPI\n2. Oral Montelukast + Levocetirizine\n3. Steam inhalation TDS\n4. Chest X-Ray PA view ordered",
    "2026-09-16"
  );

  // 9. PRESCRIPTIONS & ITEMS
  const insertRx = db.prepare(`
    INSERT OR REPLACE INTO prescriptions (id, rx_number, patient_uhid, doctor_id, appointment_id, diagnosis, general_advice, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertRx.run(
    1,
    "RX-2026-000101",
    "MC-2026-000106",
    doctorUser?.id || 3,
    1,
    "Acute Bronchitis with Reactive Airway Disease",
    "Avoid cold beverages, wear mask in dusty environments, steam inhalation 2x daily.",
    "active"
  );

  const insertRxItem = db.prepare(`
    INSERT INTO prescription_items (prescription_id, medicine_name, generic_name, dosage, frequency, timing, duration_days, quantity, instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertRxItem.run(1, "Montair-LC", "Montelukast 10mg + Levocetirizine 5mg", "1 Tab", "0-0-1 (Nightly)", "Bedtime", 7, 7, "Take at bedtime with water");
  insertRxItem.run(1, "Augmentin 625 Duo", "Amoxicillin 500mg + Clavulanic Acid 125mg", "625mg", "1-0-1 (Twice daily)", "After Food", 5, 10, "Complete full 5-day course");
  insertRxItem.run(1, "Ascoril-LS Syrup", "Levosalbutamol + Ambroxol + Guaiphenesin", "10 ml", "1-1-1 (Thrice daily)", "After Food", 5, 1, "Shake well before use");

  // 10. LAB TESTS & ORDERS (LIS)
  const labTests = [
    { id: "TEST-CBC", code: "CBC", name: "Complete Blood Count (CBC with ESR)", cat: "Hematology", sample: "Whole Blood (EDTA)", ref: "Hb: 13-17 g/dL, WBC: 4000-11000 /cumm, Platelets: 1.5-4.5 L", unit: "Various", rate: 350, tat: 2 },
    { id: "TEST-LIPID", code: "LIPID", name: "Lipid Profile Comprehensive", cat: "Biochemistry", sample: "Serum (Gel Tube)", ref: "Cholesterol: <200 mg/dL, Triglycerides: <150 mg/dL, HDL: >40 mg/dL", unit: "mg/dL", rate: 750, tat: 4 },
    { id: "TEST-HBA1C", code: "HBA1C", name: "Glycated Hemoglobin (HbA1c)", cat: "Biochemistry", sample: "Whole Blood (EDTA)", ref: "<5.7% Normal, 5.7-6.4% Prediabetic, >6.5% Diabetic", unit: "%", rate: 550, tat: 3 },
    { id: "TEST-LFT", code: "LFT", name: "Liver Function Test (LFT)", cat: "Biochemistry", sample: "Serum", ref: "Bilirubin: 0.2-1.2, SGPT: <45, SGOT: <40", unit: "IU/L", rate: 850, tat: 4 },
    { id: "TEST-KFT", code: "KFT", name: "Kidney Function Test (BUN & Creatinine)", cat: "Biochemistry", sample: "Serum", ref: "Creatinine: 0.7-1.3 mg/dL, Urea: 15-40 mg/dL", unit: "mg/dL", rate: 600, tat: 3 },
    { id: "TEST-TROP-I", code: "TROP-I", name: "Troponin-I High Sensitivity (Cardiac)", cat: "Biochemistry", sample: "Serum", ref: "<0.04 ng/mL Normal", unit: "ng/mL", rate: 1200, tat: 1 }
  ];

  const insertLabTest = db.prepare(`
    INSERT OR REPLACE INTO lab_tests (id, code, name, category, sample_type, reference_range, unit, standard_rate, turnaround_time_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const lt of labTests) {
    insertLabTest.run(lt.id, lt.code, lt.name, lt.cat, lt.sample, lt.ref, lt.unit, lt.rate, lt.tat);
  }

  const labOrders = [
    { num: "LAB-2026-00101", uhid: "MC-2026-000106", doc: doctorUser?.id || 3, test: "TEST-CBC", status: "verified", bc: "BC-9041281", val: "Hb: 14.8 g/dL, WBC: 8,400 /cumm, Platelets: 2.8 L", unit: "Normal Range", ref: "Hb: 13-17, WBC: 4-11k", crit: 0, remarks: "Normal leukocyte count. No toxic granules." },
    { num: "LAB-2026-00102", uhid: "MC-2026-000101", doc: doctorUser?.id || 3, test: "TEST-HBA1C", status: "result_ready", bc: "BC-9041282", val: "7.8%", unit: "%", ref: "<5.7% Normal", crit: 1, remarks: "Suboptimal glycemic control. Doctor review needed." },
    { num: "LAB-2026-00103", uhid: "MC-2026-000104", doc: cardDoctor?.id || 4, test: "TEST-TROP-I", status: "verified", bc: "BC-9041283", val: "0.02 ng/mL", unit: "ng/mL", ref: "<0.04 ng/mL", crit: 0, remarks: "Troponin within normal baseline." }
  ];

  const insertLabOrder = db.prepare(`
    INSERT OR REPLACE INTO lab_orders (order_number, patient_uhid, doctor_id, test_id, sample_barcode, status, result_value, result_unit, reference_range, is_critical, verified_at, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
  `);
  for (const lo of labOrders) {
    insertLabOrder.run(lo.num, lo.uhid, lo.doc, lo.test, lo.bc, lo.status, lo.val, lo.unit, lo.ref, lo.crit, lo.remarks);
  }

  // 11. RADIOLOGY (RIS)
  const radOrders = [
    { num: "RAD-2026-001", uhid: "MC-2026-000106", doc: doctorUser?.id || 3, mod: "X-Ray", part: "Chest PA View", ind: "4-day bronchitis cough rule out consolidation", status: "verified", find: "Both lung fields are clear. Costophrenic angles are acute. Cardiac shadow within normal limits.", imp: "No active focal bronchopneumonic consolidation." },
    { num: "RAD-2026-002", uhid: "MC-2026-000103", doc: cardDoctor?.id || 4, mod: "Echocardiogram", part: "2D Echo with Color Doppler", ind: "Post CAD evaluation", status: "verified", find: "Normal LV size. LVEF estimated at 55%. No regional wall motion abnormality at rest. Mild MR.", imp: "Preserved LV systolic function with Grade 1 Diastolic Dysfunction." }
  ];

  const insertRadOrder = db.prepare(`
    INSERT OR REPLACE INTO radiology_orders (order_number, patient_uhid, doctor_id, modality, body_part, clinical_indication, status, findings, impression, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  for (const ro of radOrders) {
    insertRadOrder.run(ro.num, ro.uhid, ro.doc, ro.mod, ro.part, ro.ind, ro.status, ro.find, ro.imp);
  }

  // 12. PHARMACY INVENTORY & FEFO BATCHES
  const pharmacyItems = [
    { code: "MED-001", brand: "Augmentin 625 Duo", generic: "Amoxicillin 500mg + Potassium Clavulanate 125mg", cat: "Tablet", unit: "Strip of 10", gst: 12.0, reorder: 40, batch: "AUG-2026-01", exp: "2027-10", mrp: 204.50, cost: 145.00, qty: 320 },
    { code: "MED-002", brand: "Montair-LC", generic: "Montelukast Sodium 10mg + Levocetirizine 5mg", cat: "Tablet", unit: "Strip of 10", gst: 12.0, reorder: 50, batch: "MLC-8812", exp: "2028-04", mrp: 185.00, cost: 110.00, qty: 450 },
    { code: "MED-003", brand: "Dolo 650", generic: "Paracetamol 650mg", cat: "Tablet", unit: "Strip of 15", gst: 12.0, reorder: 100, batch: "DOL-9901", exp: "2028-09", mrp: 34.00, cost: 18.50, qty: 1200 },
    { code: "MED-004", brand: "Telma 40", generic: "Telmisartan 40mg", cat: "Tablet", unit: "Strip of 15", gst: 12.0, reorder: 50, batch: "TEL-4091", exp: "2027-12", mrp: 142.00, cost: 92.00, qty: 280 },
    { code: "MED-005", brand: "Glycomet-GP 2", generic: "Glimepiride 2mg + Metformin 500mg SR", cat: "Tablet", unit: "Strip of 15", gst: 12.0, reorder: 60, batch: "GLY-2210", exp: "2027-08", mrp: 198.00, cost: 125.00, qty: 310 },
    { code: "MED-006", brand: "Pantocid 40", generic: "Pantoprazole 40mg Gastro-resistant", cat: "Tablet", unit: "Strip of 15", gst: 12.0, reorder: 80, batch: "PAN-8891", exp: "2028-02", mrp: 165.00, cost: 98.00, qty: 540 },
    { code: "MED-007", brand: "Normal Saline 0.9% IV", generic: "Sodium Chloride 0.9% w/v", cat: "IV Fluid", unit: "500ml Bottle", gst: 12.0, reorder: 150, batch: "NS-7712", exp: "2027-06", mrp: 48.00, cost: 24.00, qty: 650 }
  ];

  const insertPharmItem = db.prepare(`
    INSERT OR REPLACE INTO pharmacy_items (id, item_code, brand_name, generic_name, category, unit, gst_rate, reorder_level, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `);
  const insertBatch = db.prepare(`
    INSERT OR REPLACE INTO medicine_batches (id, item_id, batch_number, expiry_date, mrp, purchase_price, stock_quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  pharmacyItems.forEach((item, idx) => {
    const itemId = idx + 1;
    insertPharmItem.run(itemId, item.code, item.brand, item.generic, item.cat, item.unit, item.gst, item.reorder);
    insertBatch.run(itemId, itemId, item.batch, item.exp, item.mrp, item.cost, item.qty);
  });

  // 13. BILLING, INVOICES & PAYMENTS
  const insertInvoice = db.prepare(`
    INSERT OR REPLACE INTO invoices (
      id, invoice_number, patient_uhid, bill_type, subtotal, discount_amount, gst_amount,
      total_amount, insurance_share, patient_payable, paid_amount, outstanding_amount, payment_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertInvItem = db.prepare(`
    INSERT INTO invoice_items (invoice_id, item_description, category, quantity, unit_price, gst_percent, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPayment = db.prepare(`
    INSERT OR REPLACE INTO payments (id, receipt_number, invoice_id, patient_uhid, amount, payment_mode, transaction_reference)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Invoice 1: OPD Visit for Alexander Vance
  insertInvoice.run(1, "INV-2026-000101", "MC-2026-000106", "OPD Consultation", 1300, 0, 84, 1384, 0, 1384, 1384, 0, "paid");
  insertInvItem.run(1, "Senior Specialist OPD Consultation (Dr. Rajesh Patel)", "Consultation", 1, 500, 0, 500);
  insertInvItem.run(1, "Complete Blood Count (CBC with ESR)", "Lab", 1, 350, 0, 350);
  insertInvItem.run(1, "Chest X-Ray Digital PA View", "Radiology", 1, 450, 0, 450);
  insertInvItem.run(1, "Prescribed Medications (Augmentin, Montair-LC, Ascoril)", "Pharmacy", 1, 384, 12, 384);
  insertPayment.run(1, "RCP-2026-000101", 1, "MC-2026-000106", 1384, "UPI", "UPI-HDFC-904128912");

  // Invoice 2: IPD Admission for Kishorbhai Joshi (Star Health TPA)
  insertInvoice.run(2, "INV-2026-000102", "MC-2026-000103", "IPD Final Bill", 68500, 2500, 4200, 70200, 60000, 10200, 10200, 0, "paid");
  insertInvItem.run(2, "Deluxe Room Bed Charges (3 Days @ ₹5500)", "Bed", 3, 5500, 0, 16500);
  insertInvItem.run(2, "ICU Monitoring & Critical Care (1 Day @ ₹6500)", "Bed", 1, 6500, 0, 6500);
  insertInvItem.run(2, "Coronary Angiography Diagnostic Study", "Procedure", 1, 22000, 0, 22000);
  insertInvItem.run(2, "Cardiology Consultant Daily Rounds & Review", "Consultation", 4, 1500, 0, 6000);
  insertInvItem.run(2, "Nursing Care & IV Infusion Charges", "Nursing", 4, 1200, 0, 4800);
  insertInvItem.run(2, "Inpatient Pharmacy & Injectables", "Pharmacy", 1, 14400, 12, 14400);

  // Insurance Claim for Invoice 2
  db.prepare(`
    INSERT OR REPLACE INTO insurance_claims (
      id, claim_number, invoice_id, patient_uhid, insurance_company, tpa_name, policy_number,
      pre_auth_status, pre_auth_amount, claimed_amount, settled_amount, claim_status, remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    1,
    "CLM-STAR-2026-8812",
    2,
    "MC-2026-000103",
    "Star Health & Allied Insurance",
    "Medi Assist India TPA",
    "HD-MED-2025-1049",
    "approved",
    60000,
    60000,
    60000,
    "settled",
    "Cashless hospitalization approved under Cardiac Care Policy package."
  );

  // 14. AUDIT LOG ENTRIES
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (user_name, role, action, module, patient_uhid, details, ip_address, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  insertAudit.run("Elena Rostova", "reception", "REGISTER_PATIENT", "Reception", "MC-2026-000106", "Generated UHID MC-2026-000106 for Alexander Vance with linked ABHA ID", "192.168.1.104", "-2 hours");
  insertAudit.run("Elena Rostova", "reception", "ISSUE_OPD_TOKEN", "OPD", "MC-2026-000106", "Issued Token A-101 for General Medicine (Dr. Rajesh Patel)", "192.168.1.104", "-115 minutes");
  insertAudit.run("Sister Anjali Nair", "nurse", "RECORD_VITALS", "Nursing", "MC-2026-000106", "Recorded baseline vitals: BP 124/82, HR 76, SpO2 98%", "192.168.1.112", "-100 minutes");
  insertAudit.run("Dr. Rajesh Patel", "doctor", "CONSULTATION_COMPLETED", "EMR", "MC-2026-000106", "Completed clinical consultation, diagnosed Acute Bronchitis, created Rx and lab order", "192.168.1.120", "-85 minutes");
  insertAudit.run("David Chen", "lab", "VERIFIED_LAB_RESULT", "LIS", "MC-2026-000106", "Verified Complete Blood Count results and released PDF report", "192.168.1.135", "-60 minutes");
  insertAudit.run("Maria Santos", "pharmacy", "DISPENSE_PRESCRIPTION", "Pharmacy", "MC-2026-000106", "Dispensed Rx #RX-2026-000101 from batch AUG-2026-01 & MLC-8812 with inventory reduction", "192.168.1.140", "-40 minutes");
  insertAudit.run("Ketan Trivedi", "billing", "PAYMENT_COLLECTED", "Billing", "MC-2026-000106", "Received ₹1,384 via UPI (Ref: UPI-HDFC-904128912) for invoice INV-2026-000101", "192.168.1.150", "-30 minutes");

  console.log("✅ Seed completed successfully!");
  console.log("📊 Summary of populated data:");
  console.log("   - 1 Superspeciality Hospital");
  console.log("   - 10 Clinical & Operational Departments");
  console.log("   - 12 Role-based Staff & Demo User Accounts");
  console.log("   - 6 Hospital Wards & 12 Pre-allocated Beds");
  console.log("   - 7 Indian Patient Records with Unique UHIDs & ABHA IDs");
  console.log("   - 4 OPD Queue Appointments with Tokens");
  console.log("   - LIS Diagnostics Catalog, RIS Imaging Studies, Pharmacy FEFO Stock");
  console.log("   - GST Invoices, Star Health TPA Cashless Claim, and Audit Logs");
  console.log(`\n🔑 Demo Password for all accounts: ${DEMO_PASSWORD}`);
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
}
