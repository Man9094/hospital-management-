require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const {
  Hospital,
  Department,
  User,
  Patient,
  DoctorStatus,
  Appointment,
  Vital,
  ClinicalNote,
  Prescription,
  PharmacyItem,
  Ward,
  Bed,
  IpdAdmission,
  NursingNote,
  LabTest,
  LabOrder,
  RadiologyOrder,
  EmergencyCase,
  Invoice,
  AuditLog,
} = require("./models");

const DEMO_PASSWORD = "MedCore@2026";
const DEMO_ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || "admin@medcore.in").trim().toLowerCase();

const runSeed = async () => {
  console.log("🌱 MedCore HMS — Starting Comprehensive MongoDB Database Seed...\n");

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "MedCore@2026";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const demoStaffPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1. Hospital
  await Hospital.findOneAndUpdate(
    { hospitalId: "HOSP-001" },
    {
      hospitalId: "HOSP-001",
      name: "Apex MedCore Superspeciality Hospital",
      tagline: "Indian Hospital Operating System & Advanced Healthcare Center",
      registration_number: "GJ-AHM-MED-2024-8841",
      email: "contact@apexmedcore.in",
      phone: "+91 79 2658 9000",
      address: "Plot 42, SG Highway, Bodakdev",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380054",
      gst_number: "24AAACH1234F1Z5",
      abha_facility_id: "IN2400049182",
    },
    { upsert: true, new: true }
  );

  // 2. Departments
  const departments = [
    { deptId: "DEP-MED", name: "General Medicine", code: "MED", head_doctor_name: "Dr. Rajesh Patel", location: "Ground Floor, Block A" },
    { deptId: "DEP-CARD", name: "Cardiology", code: "CARD", head_doctor_name: "Dr. Sneha Shah", location: "2nd Floor, Heart Wing" },
    { deptId: "DEP-ORTH", name: "Orthopedics & Joint Replacement", code: "ORTH", head_doctor_name: "Dr. Amit Mehta", location: "1st Floor, Block B" },
    { deptId: "DEP-PED", name: "Pediatrics & Neonatology", code: "PED", head_doctor_name: "Dr. Pooja Joshi", location: "3rd Floor, Mother & Child" },
    { deptId: "DEP-SURG", name: "General & Laparoscopic Surgery", code: "SURG", head_doctor_name: "Dr. Vikram Deshmukh", location: "4th Floor, OT Complex" },
    { deptId: "DEP-EMER", name: "Emergency & Trauma Command", code: "EMER", head_doctor_name: "Dr. Sandeep Rao", location: "Ground Floor, ER Bay" },
    { deptId: "DEP-LAB", name: "Pathology & Diagnostics (LIS)", code: "LAB", head_doctor_name: "Dr. Kirit Solanki", location: "Basement 1" },
    { deptId: "DEP-RAD", name: "Radiology & Imaging (RIS)", code: "RAD", head_doctor_name: "Dr. Alpa Bhatt", location: "Ground Floor, Imaging Wing" },
    { deptId: "DEP-PHARM", name: "Pharmacy & Store", code: "PHARM", head_doctor_name: "Pravin Bhai Parmar", location: "Ground Floor, Main Lobby" },
    { deptId: "DEP-ADMIN", name: "Hospital Administration & Billing", code: "ADMIN", head_doctor_name: "Priya Sharma", location: "5th Floor, Executive Wing" },
  ];

  for (const dept of departments) {
    await Department.findOneAndUpdate({ deptId: dept.deptId }, dept, { upsert: true });
  }

  // 3. Staff & Users (12 Roles)
  const staffUsers = [
    { userId: 1, name: "Rajesh Kumar", email: "superadmin@medcore.in", role: "super_admin", department_id: "DEP-ADMIN", qualification: "M.Tech, MBA", registration_number: "SYS-001" },
    { userId: 2, name: "Priya Sharma", email: DEMO_ADMIN_EMAIL, role: "hospital_admin", department_id: "DEP-ADMIN", qualification: "MHA (Hospital Admin)", registration_number: "MHA-2018-91" },
    { userId: 3, name: "Dr. Rajesh Patel", email: "doctor@medcore.in", role: "doctor", department_id: "DEP-MED", qualification: "M.D. (Internal Medicine), FICP", registration_number: "GMC-G-40912" },
    { userId: 4, name: "Dr. Sneha Shah", email: "doctor.shah@medcore.in", role: "doctor", department_id: "DEP-CARD", qualification: "M.D., D.M. (Cardiology)", registration_number: "GMC-G-38102" },
    { userId: 5, name: "Dr. Amit Mehta", email: "doctor.mehta@medcore.in", role: "doctor", department_id: "DEP-ORTH", qualification: "M.S. (Orthopedics), MCh", registration_number: "GMC-G-44190" },
    { userId: 6, name: "Sister Anjali Nair", email: "nurse@medcore.in", role: "nurse", department_id: "DEP-MED", qualification: "B.Sc Nursing, Critical Care", registration_number: "GNC-N-50124" },
    { userId: 7, name: "Elena Rostova", email: "reception@medcore.in", role: "reception", department_id: "DEP-ADMIN", qualification: "B.Com, Healthcare Mgmt", registration_number: "STF-2022-10" },
    { userId: 8, name: "David Chen", email: "lab@medcore.in", role: "lab", department_id: "DEP-LAB", qualification: "M.Sc (Medical Laboratory Tech)", registration_number: "MLT-88912" },
    { userId: 9, name: "Dr. Alpa Bhatt", email: "radiology@medcore.in", role: "radiology", department_id: "DEP-RAD", qualification: "M.D. (Radio-Diagnosis)", registration_number: "GMC-G-29910" },
    { userId: 10, name: "Maria Santos", email: "pharmacy@medcore.in", role: "pharmacist", department_id: "DEP-PHARM", qualification: "B.Pharm, Registered Pharmacist", registration_number: "GPC-P-99214" },
    { userId: 11, name: "Ketan Trivedi", email: "billing@medcore.in", role: "billing", department_id: "DEP-ADMIN", qualification: "B.Com, GST & TPA Specialist", registration_number: "ACC-2021-08" },
    { userId: 12, name: "Alexander Vance (Patient)", email: "patient@medcore.in", role: "patient", department_id: null, qualification: "Patient Portal User", registration_number: "PAT-001" },
  ];

  for (const u of staffUsers) {
    const cleanEmail = u.email.trim().toLowerCase();
    const userPasswordHash = u.role === "hospital_admin" ? adminPasswordHash : demoStaffPasswordHash;

    // If upserting hospital_admin, align any existing record to avoid duplicate key conflicts
    if (u.role === "hospital_admin") {
      const existingAdmin = await User.findOne({
        $or: [{ email: cleanEmail }, { role: "hospital_admin" }, { userId: u.userId }],
      });
      if (existingAdmin) {
        existingAdmin.name = u.name;
        existingAdmin.email = cleanEmail;
        existingAdmin.role = "hospital_admin";
        existingAdmin.department_id = u.department_id;
        existingAdmin.qualification = u.qualification;
        existingAdmin.registration_number = u.registration_number;
        existingAdmin.passwordHash = adminPasswordHash;
        existingAdmin.status = "active";
        await existingAdmin.save();
        continue;
      }
    }

    await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        ...u,
        email: cleanEmail,
        passwordHash: userPasswordHash,
        status: "active",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // 4. Wards & Beds
  const wards = [
    { wardId: "WARD-ICU", name: "Intensive Care Unit (ICU)", ward_type: "ICU", floor: "2nd Floor", total_beds: 12, charge_per_day: 6500 },
    { wardId: "WARD-GEN-M", name: "General Ward (Male)", ward_type: "General", floor: "3rd Floor", total_beds: 20, charge_per_day: 1200 },
    { wardId: "WARD-GEN-F", name: "General Ward (Female)", ward_type: "General", floor: "3rd Floor", total_beds: 20, charge_per_day: 1200 },
    { wardId: "WARD-SEMI", name: "Semi-Private Ward", ward_type: "Semi-Private", floor: "4th Floor", total_beds: 16, charge_per_day: 2800 },
    { wardId: "WARD-DELUXE", name: "Deluxe Private Rooms", ward_type: "Deluxe", floor: "5th Floor", total_beds: 10, charge_per_day: 5500 },
    { wardId: "WARD-EMER", name: "Emergency Observation Bay", ward_type: "Emergency", floor: "Ground Floor", total_beds: 8, charge_per_day: 2000 },
  ];

  for (const w of wards) {
    await Ward.findOneAndUpdate({ wardId: w.wardId }, w, { upsert: true });
  }

  const initialBeds = [
    { bedId: "ICU-101", ward_id: "WARD-ICU", bed_number: "Bed 101", status: "occupied", current_patient_uhid: "MC-2026-000104", allocated_at: "2026-09-08 14:30:00" },
    { bedId: "ICU-102", ward_id: "WARD-ICU", bed_number: "Bed 102", status: "occupied", current_patient_uhid: "MC-2026-000105", allocated_at: "2026-09-09 03:15:00" },
    { bedId: "ICU-103", ward_id: "WARD-ICU", bed_number: "Bed 103", status: "available", current_patient_uhid: null, allocated_at: null },
    { bedId: "ICU-104", ward_id: "WARD-ICU", bed_number: "Bed 104", status: "cleaning", current_patient_uhid: null, allocated_at: null },
    { bedId: "GEN-201", ward_id: "WARD-GEN-M", bed_number: "Bed 201", status: "occupied", current_patient_uhid: "MC-2026-000101", allocated_at: "2026-09-07 10:00:00" },
    { bedId: "GEN-202", ward_id: "WARD-GEN-M", bed_number: "Bed 202", status: "available", current_patient_uhid: null, allocated_at: null },
    { bedId: "GEN-203", ward_id: "WARD-GEN-M", bed_number: "Bed 203", status: "available", current_patient_uhid: null, allocated_at: null },
    { bedId: "GEN-204", ward_id: "WARD-GEN-M", bed_number: "Bed 204", status: "reserved", current_patient_uhid: null, allocated_at: null },
    { bedId: "DEL-301", ward_id: "WARD-DELUXE", bed_number: "Suite 301", status: "occupied", current_patient_uhid: "MC-2026-000103", allocated_at: "2026-09-06 18:00:00" },
    { bedId: "DEL-302", ward_id: "WARD-DELUXE", bed_number: "Suite 302", status: "available", current_patient_uhid: null, allocated_at: null },
    { bedId: "SEMI-401", ward_id: "WARD-SEMI", bed_number: "Bed 401A", status: "occupied", current_patient_uhid: "MC-2026-000102", allocated_at: "2026-09-08 11:20:00" },
    { bedId: "SEMI-402", ward_id: "WARD-SEMI", bed_number: "Bed 401B", status: "available", current_patient_uhid: null, allocated_at: null },
  ];

  for (const b of initialBeds) {
    await Bed.findOneAndUpdate({ bedId: b.bedId }, b, { upsert: true });
  }

  // 5. Patients
  const patients = [
    {
      patientId: 101,
      uhid: "MC-2026-000101",
      full_name: "Rameshbhai Patel",
      age: 58,
      gender: "Male",
      mobile: "+91 98250 14892",
      email: "ramesh.patel@gmail.com",
      address: "B-204 Shivalik Heights, Satellite",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "B+",
      allergies: "Penicillin, Sulfa drugs",
      chronic_conditions: "Type 2 Diabetes, Hypertension",
      abha_id: "91-4091-2094-1102",
      insurance_provider: "Star Health & Allied Insurance",
      insurance_policy_number: "SH-90412891",
      emergency_contact_name: "Ketan Patel (Son)",
      emergency_contact_phone: "+91 98250 99881",
      status: "inpatient",
    },
    {
      patientId: 102,
      uhid: "MC-2026-000102",
      full_name: "Sunitaben Shah",
      age: 46,
      gender: "Female",
      mobile: "+91 94260 88123",
      email: "sunita.shah@yahoo.in",
      address: "12, Sharda Society, Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "O+",
      allergies: "None known",
      chronic_conditions: "Mild Hypothyroidism",
      abha_id: "91-8812-4019-3391",
      insurance_provider: "PM-JAY Ayushman Bharat",
      insurance_policy_number: "PMJAY-GJ-2024-8841",
      emergency_contact_name: "Nilesh Shah (Husband)",
      emergency_contact_phone: "+91 94260 77112",
      status: "inpatient",
    },
    {
      patientId: 103,
      uhid: "MC-2026-000103",
      full_name: "Kishorbhai Joshi",
      age: 63,
      gender: "Male",
      mobile: "+91 97277 55432",
      email: "kishor.joshi@gmail.com",
      address: "Flat 401, Galaxy Tower, Vastrapur",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "A+",
      allergies: "Aspirin, NSAIDs",
      chronic_conditions: "Coronary Artery Disease (CAD)",
      abha_id: "91-5512-9901-4432",
      insurance_provider: "HDFC ERGO General Insurance",
      insurance_policy_number: "HD-MED-2025-1049",
      emergency_contact_name: "Meena Joshi (Wife)",
      emergency_contact_phone: "+91 97277 55430",
      status: "inpatient",
    },
    {
      patientId: 104,
      uhid: "MC-2026-000104",
      full_name: "Vikram Rathore",
      age: 52,
      gender: "Male",
      mobile: "+91 99090 12345",
      email: "v.rathore@outlook.com",
      address: "Plot 88, Sector 21",
      city: "Gandhinagar",
      state: "Gujarat",
      blood_group: "AB+",
      allergies: "None",
      chronic_conditions: "Acute Coronary Syndrome post Angioplasty",
      abha_id: "91-2290-7711-8823",
      insurance_provider: "ICICI Lombard Health Shield",
      insurance_policy_number: "IC-884019-2026",
      emergency_contact_name: "Anita Rathore (Wife)",
      emergency_contact_phone: "+91 99090 54321",
      status: "inpatient",
    },
    {
      patientId: 105,
      uhid: "MC-2026-000105",
      full_name: "Manjulaben Prajapati",
      age: 71,
      gender: "Female",
      mobile: "+91 98980 44556",
      email: "manjula.prajapati@rediffmail.com",
      address: "5, Ramnagar Society, Sabarmati",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "O-",
      allergies: "Ciprofloxacin",
      chronic_conditions: "Chronic Kidney Disease Stage 3",
      abha_id: "91-7712-4401-2299",
      insurance_provider: "PM-JAY Ayushman Bharat",
      insurance_policy_number: "PMJAY-GJ-2025-9921",
      emergency_contact_name: "Bharat Prajapati (Son)",
      emergency_contact_phone: "+91 98980 11223",
      status: "inpatient",
    },
    {
      patientId: 106,
      uhid: "MC-2026-000106",
      full_name: "Alexander Vance",
      age: 38,
      gender: "Male",
      mobile: "+91 98240 66778",
      email: "patient@medcore.in",
      address: "A-502, Iscon Elegance, Prahlad Nagar",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "O+",
      allergies: "Penicillin",
      chronic_conditions: "Mild Asthma, Allergic Rhinitis",
      abha_id: "91-3312-9988-1144",
      insurance_provider: "Bajaj Allianz Health Guard",
      insurance_policy_number: "BA-991204-2025",
      emergency_contact_name: "Claire Vance (Spouse)",
      emergency_contact_phone: "+91 98240 66779",
      status: "active",
    },
    {
      patientId: 107,
      uhid: "MC-2026-000107",
      full_name: "Dr. Ananya Iyer",
      age: 34,
      gender: "Female",
      mobile: "+91 98795 33211",
      email: "ananya.iyer@gmail.com",
      address: "Tower 3, Godrej Garden City",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "A-",
      allergies: "Latex",
      chronic_conditions: "None",
      abha_id: "91-4491-0022-8877",
      insurance_provider: "Care Health Insurance",
      insurance_policy_number: "CARE-882190-2026",
      emergency_contact_name: "Karthik Iyer (Brother)",
      emergency_contact_phone: "+91 98795 33212",
      status: "active",
    },
    {
      patientId: 108,
      uhid: "MC-2026-000108",
      full_name: "Man Chaudhary",
      age: 24,
      gender: "Male",
      mobile: "+91 93288 98884",
      email: "man.chaudhary@gmail.com",
      address: "102, Shanti Heights, Ring Road",
      city: "Ahmedabad",
      state: "Gujarat",
      blood_group: "B+",
      allergies: "None",
      chronic_conditions: "Routine OPD Health Checkup",
      abha_id: "91-9328-8988-8884",
      insurance_provider: "Star Health Premier Guard",
      insurance_policy_number: "SH-93288988",
      emergency_contact_name: "Chaudhary Family",
      emergency_contact_phone: "+91 93288 98884",
      status: "active",
    },
  ];

  for (const p of patients) {
    await Patient.findOneAndUpdate({ uhid: p.uhid }, p, { upsert: true });
  }

  // 6. Doctor Status & Live Delays
  const doctorStatuses = [
    { doctor_id: 3, status: "in_cabin", delay_minutes: 15, delay_reason: "Emergency Ward Round & Morning Handover", cabin_number: "Cabin 104 (OPD Wing 1)", active_case_number: 1 },
    { doctor_id: 4, status: "available", delay_minutes: 0, delay_reason: null, cabin_number: "Cabin 201 (Heart Wing)", active_case_number: null },
    { doctor_id: 5, status: "on_rounds", delay_minutes: 30, delay_reason: "Post-Op ICU Dressing Rounds", cabin_number: "Cabin 108 (Ortho Wing)", active_case_number: null },
  ];

  for (const ds of doctorStatuses) {
    await DoctorStatus.findOneAndUpdate({ doctor_id: ds.doctor_id }, ds, { upsert: true });
  }

  // 7. Appointments (OPD Queue)
  const today = new Date().toISOString().split("T")[0];
  const appointments = [
    {
      appointmentId: 1,
      appointment_number: "APT-2026-001",
      patient_uhid: "MC-2026-000106",
      doctor_id: 3,
      department_id: "DEP-MED",
      appointment_date: today,
      slot_time: "10:00 AM",
      token_number: "A-101",
      case_number: 1,
      cabin_number: "Cabin 104",
      status: "in_consultation",
      chief_complaint: "Persistent dry cough, mild wheezing and fatigue for 4 days",
      consultation_start_time: `${today}T10:02:00Z`,
      duration_minutes: 8.5,
    },
    {
      appointmentId: 2,
      appointment_number: "APT-2026-002",
      patient_uhid: "MC-2026-000108",
      doctor_id: 3,
      department_id: "DEP-MED",
      appointment_date: today,
      slot_time: "10:20 AM",
      token_number: "A-102",
      case_number: 2,
      cabin_number: "Cabin 104",
      status: "waiting",
      chief_complaint: "Health checkup, routine vitals & general medical consultation",
      consultation_start_time: null,
      duration_minutes: 0,
    },
    {
      appointmentId: 3,
      appointment_number: "APT-2026-003",
      patient_uhid: "MC-2026-000107",
      doctor_id: 4,
      department_id: "DEP-CARD",
      appointment_date: today,
      slot_time: "10:30 AM",
      token_number: "A-103",
      case_number: 3,
      cabin_number: "Cabin 201",
      status: "waiting",
      chief_complaint: "Routine cardiovascular screening, episodic palpitations",
      consultation_start_time: null,
      duration_minutes: 0,
    },
    {
      appointmentId: 4,
      appointment_number: "APT-2026-004",
      patient_uhid: "MC-2026-000101",
      doctor_id: 3,
      department_id: "DEP-MED",
      appointment_date: today,
      slot_time: "11:00 AM",
      token_number: "A-104",
      case_number: 4,
      cabin_number: "Cabin 104",
      status: "waiting",
      chief_complaint: "Follow-up diabetic HbA1c evaluation & neuropathy review",
      consultation_start_time: null,
      duration_minutes: 0,
    },
    {
      appointmentId: 5,
      appointment_number: "APT-2026-005",
      patient_uhid: "MC-2026-000102",
      doctor_id: 3,
      department_id: "DEP-MED",
      appointment_date: today,
      slot_time: "11:30 AM",
      token_number: "A-105",
      case_number: 5,
      cabin_number: "Cabin 104",
      status: "scheduled",
      chief_complaint: "Thyroid profile review & routine health checkup",
      consultation_start_time: null,
      duration_minutes: 0,
    },
  ];

  for (const a of appointments) {
    await Appointment.findOneAndUpdate({ appointment_number: a.appointment_number }, a, { upsert: true });
  }

  // 8. Vitals
  const vitals = [
    { patient_uhid: "MC-2026-000106", appointment_id: 1, bp_systolic: 124, bp_diastolic: 82, heart_rate: 76, temperature: 98.4, spo2: 98, respiratory_rate: 18, weight_kg: 74.5, height_cm: 175, bmi: 24.3, notes: "Vitals stable. Mild wheeze in right lower zone.", is_abnormal: 0 },
    { patient_uhid: "MC-2026-000101", appointment_id: 4, bp_systolic: 142, bp_diastolic: 90, heart_rate: 84, temperature: 98.6, spo2: 97, respiratory_rate: 20, weight_kg: 82.0, height_cm: 168, bmi: 29.0, notes: "BP slightly elevated above target 130/80.", is_abnormal: 1 },
    { patient_uhid: "MC-2026-000104", appointment_id: null, bp_systolic: 130, bp_diastolic: 84, heart_rate: 88, temperature: 99.1, spo2: 95, respiratory_rate: 22, weight_kg: 78.0, height_cm: 172, bmi: 26.4, notes: "ICU continuous monitoring. Post-angioplasty.", is_abnormal: 0 },
  ];

  for (const v of vitals) {
    await Vital.findOneAndUpdate(
      { patient_uhid: v.patient_uhid, appointment_id: v.appointment_id },
      v,
      { upsert: true }
    );
  }

  // 9. Clinical Notes
  await ClinicalNote.findOneAndUpdate(
    { patient_uhid: "MC-2026-000106", appointment_id: 1 },
    {
      patient_uhid: "MC-2026-000106",
      doctor_id: 3,
      appointment_id: 1,
      chief_complaint: "4-day history of productive cough, mild wheezing on exertion",
      history_present_illness: "Patient has prior history of mild asthma. Symptoms aggravated after dust exposure.",
      examination_findings: "Bilateral vesicular breath sounds with scattered expiratory rhonchi in right base.",
      diagnosis: "Acute Bronchitis with Reactive Airway Disease Exacerbation",
      icd10_code: "J20.9",
      treatment_plan: "1. Inhaled Budesonide + Formoterol DPI\n2. Oral Montelukast + Levocetirizine\n3. Steam inhalation TDS",
      follow_up_date: "2026-09-16",
    },
    { upsert: true }
  );

  // 10. Prescriptions
  await Prescription.findOneAndUpdate(
    { rx_number: "RX-2026-000101" },
    {
      prescriptionId: 1,
      rx_number: "RX-2026-000101",
      patient_uhid: "MC-2026-000106",
      doctor_id: 3,
      appointment_id: 1,
      diagnosis: "Acute Bronchitis with Reactive Airway Disease",
      general_advice: "Avoid cold beverages, wear mask in dusty environments, steam inhalation 2x daily.",
      status: "active",
      items: [
        { medicine_name: "Montair-LC", generic_name: "Montelukast 10mg + Levocetirizine 5mg", dosage: "1 Tab", frequency: "0-0-1 (Nightly)", timing: "Bedtime", duration_days: 7, quantity: 7, instructions: "Take at bedtime with water" },
        { medicine_name: "Augmentin 625 Duo", generic_name: "Amoxicillin 500mg + Clavulanic Acid 125mg", dosage: "625mg", frequency: "1-0-1 (Twice daily)", timing: "After Food", duration_days: 5, quantity: 10, instructions: "Complete full 5-day course" },
      ],
    },
    { upsert: true }
  );

  // 11. Pharmacy Items & Batches
  const pharmacyCatalog = [
    {
      item_code: "MED-AUG625",
      brand_name: "Augmentin 625 Duo",
      generic_name: "Amoxicillin 500mg + Clavulanic Acid 125mg",
      category: "Tablet",
      unit: "Strip of 10",
      hsn_code: "30041000",
      gst_rate: 12.0,
      reorder_level: 50,
      batches: [
        { batch_number: "AUG-24B01", expiry_date: "2027-04", mrp: 204.5, purchase_price: 142.0, stock_quantity: 180 },
        { batch_number: "AUG-24E12", expiry_date: "2026-11", mrp: 198.0, purchase_price: 138.0, stock_quantity: 45 },
      ],
    },
    {
      item_code: "MED-MONLC",
      brand_name: "Montair-LC",
      generic_name: "Montelukast 10mg + Levocetirizine 5mg",
      category: "Tablet",
      unit: "Strip of 10",
      hsn_code: "30049099",
      gst_rate: 12.0,
      reorder_level: 60,
      batches: [
        { batch_number: "MON-25A03", expiry_date: "2027-08", mrp: 185.0, purchase_price: 120.0, stock_quantity: 240 },
      ],
    },
    {
      item_code: "MED-PAN40",
      brand_name: "Pan 40",
      generic_name: "Pantoprazole Gastro-Resistant 40mg",
      category: "Tablet",
      unit: "Strip of 15",
      hsn_code: "30049099",
      gst_rate: 12.0,
      reorder_level: 100,
      batches: [
        { batch_number: "PAN-25K09", expiry_date: "2028-01", mrp: 155.0, purchase_price: 95.0, stock_quantity: 450 },
      ],
    },
    {
      item_code: "MED-PCM650",
      brand_name: "Dolo 650",
      generic_name: "Paracetamol 650mg",
      category: "Tablet",
      unit: "Strip of 15",
      hsn_code: "30049099",
      gst_rate: 12.0,
      reorder_level: 120,
      batches: [
        { batch_number: "DOL-25C11", expiry_date: "2027-10", mrp: 34.0, purchase_price: 18.5, stock_quantity: 600 },
      ],
    },
  ];

  for (const pi of pharmacyCatalog) {
    await PharmacyItem.findOneAndUpdate({ item_code: pi.item_code }, pi, { upsert: true });
  }

  // 12. Lab Tests & Orders
  const labTests = [
    { testId: "LAB-CBC", code: "CBC", name: "Complete Blood Count (CBC) with ESR", category: "Hematology", sample_type: "Whole Blood (EDTA)", reference_range: "Hb: 12.0-16.0 g/dL, WBC: 4000-11000", unit: "Various", standard_rate: 350 },
    { testId: "LAB-LIPID", code: "LIPID", name: "Lipid Profile (Full)", category: "Biochemistry", sample_type: "Serum", reference_range: "Total Chol < 200 mg/dL, HDL > 40", unit: "mg/dL", standard_rate: 650 },
    { testId: "LAB-HBA1C", code: "HBA1C", name: "Glycated Hemoglobin (HbA1c)", category: "Biochemistry", sample_type: "Whole Blood (EDTA)", reference_range: "< 5.7% (Normal), > 6.5% (Diabetic)", unit: "%", standard_rate: 550 },
    { testId: "LAB-TFT", code: "TFT", name: "Thyroid Profile Total (T3, T4, TSH)", category: "Serology", sample_type: "Serum", reference_range: "TSH: 0.35 - 4.94 uIU/mL", unit: "uIU/mL", standard_rate: 500 },
    { testId: "LAB-KFT", code: "KFT", name: "Kidney Function Test (KFT / RFT)", category: "Biochemistry", sample_type: "Serum", reference_range: "Creatinine: 0.6 - 1.2 mg/dL", unit: "mg/dL", standard_rate: 600 },
  ];

  for (const lt of labTests) {
    await LabTest.findOneAndUpdate({ testId: lt.testId }, lt, { upsert: true });
  }

  await LabOrder.findOneAndUpdate(
    { order_number: "LAB-2026-000101" },
    {
      orderId: 101,
      order_number: "LAB-2026-000101",
      patient_uhid: "MC-2026-000106",
      doctor_id: 3,
      test_id: "LAB-CBC",
      status: "result_ready",
      sample_collected_at: `${today} 10:15:00`,
      result_value: "Hb: 14.2 g/dL, WBC: 8400 /uL, Platelets: 2.4 Lac",
      result_unit: "Comprehensive Profile",
      reference_range: "Normal Hemogram",
      is_critical: 0,
      pathologist_id: 8,
      remarks: "Sample hemolyzed: No. Cellular morphology within normal limits.",
    },
    { upsert: true }
  );

  // 13. Radiology Orders
  await RadiologyOrder.findOneAndUpdate(
    { order_number: "RAD-2026-000101" },
    {
      orderId: 101,
      order_number: "RAD-2026-000101",
      patient_uhid: "MC-2026-000106",
      doctor_id: 3,
      modality: "X-Ray",
      body_part: "Chest PA View",
      clinical_indication: "Acute bronchitis, reactive airway flare up",
      status: "verified",
      findings: "Bilateral lung fields appear clear. Bronchovascular markings mildly prominent. Heart size within normal limits. Both CP angles clear.",
      impression: "No acute focal consolidation or pleural effusion seen.",
      radiologist_id: 9,
      verified_at: `${today} 11:30:00`,
    },
    { upsert: true }
  );

  // 14. Emergency Cases
  await EmergencyCase.findOneAndUpdate(
    { er_number: "ER-2026-0091" },
    {
      caseId: 91,
      er_number: "ER-2026-0091",
      patient_uhid: "MC-2026-000104",
      triage_color: "Red",
      triage_reason: "Acute severe crushing chest pain with diaphoresis, BP 90/60",
      arrival_mode: "Ambulance",
      assigned_doctor_id: 4,
      bed_allocated: "ER Bay 1 (Crash Cart)",
      disposition: "ICU Admission",
      status: "stabilized",
    },
    { upsert: true }
  );

  // 15. IPD Admissions
  await IpdAdmission.findOneAndUpdate(
    { admission_number: "IPD-2026-00101" },
    {
      admissionId: 101,
      admission_number: "IPD-2026-00101",
      patient_uhid: "MC-2026-000101",
      bed_id: "GEN-201",
      admitting_doctor_id: 3,
      primary_nurse_id: 6,
      admission_reason: "Diabetic Ketoacidosis management & peripheral neuropathy stabilization",
      initial_diagnosis: "Type 2 Diabetes with secondary dehydration",
      status: "admitted",
    },
    { upsert: true }
  );

  // 16. Invoices & Billing
  await Invoice.findOneAndUpdate(
    { invoice_number: "INV-2026-000101" },
    {
      invoiceId: 101,
      invoice_number: "INV-2026-000101",
      patient_uhid: "MC-2026-000106",
      bill_type: "OPD Consultation",
      subtotal: 1050,
      discount_amount: 50,
      gst_amount: 0,
      total_amount: 1000,
      insurance_share: 0,
      patient_payable: 1000,
      paid_amount: 1000,
      outstanding_amount: 0,
      payment_status: "paid",
      items: [
        { item_description: "Senior Consultant OPD Consultation", category: "Consultation", quantity: 1, unit_price: 650, total_price: 650 },
        { item_description: "Chest X-Ray Digital (PA View)", category: "Radiology", quantity: 1, unit_price: 400, total_price: 400 },
      ],
      payments: [
        { receipt_number: "RCP-2026-0091", amount: 1000, payment_mode: "UPI", transaction_reference: "UPI/20260909/774128912", received_by: 11, payment_date: new Date() },
      ],
    },
    { upsert: true }
  );

  // 17. Audit Logs
  await AuditLog.findOneAndUpdate(
    { action: "SYSTEM_SEED", module: "Admin" },
    {
      user_id: 1,
      user_name: "Super Admin",
      role: "super_admin",
      action: "SYSTEM_SEED",
      module: "Admin",
      details: "Populated realistic master hospital dataset with 12 Indian healthcare staff roles and clinical inventory.",
      ip_address: "127.0.0.1",
    },
    { upsert: true }
  );

  console.log("✅ MedCore HMS database seeded successfully!\n");
  console.log("Default credentials:");
  console.log("- Super Admin: superadmin@medcore.in / MedCore@2026");
  console.log(`- Hospital Admin: ${DEMO_ADMIN_EMAIL} / ${process.env.SEED_ADMIN_PASSWORD ? "[Configured SEED_ADMIN_PASSWORD in .env] or MedCore@2026" : "MedCore@2026"}`);
  console.log("- Doctor: doctor@medcore.in / MedCore@2026");
  console.log("- Nurse: nurse@medcore.in / MedCore@2026");
  console.log("- Reception: reception@medcore.in / MedCore@2026");
  console.log("- Pathologist (LIS): lab@medcore.in / MedCore@2026");
  console.log("- Pharmacist: pharmacy@medcore.in / MedCore@2026");
};

if (require.main === module) {
  connectDB()
    .then(runSeed)
    .then(() => {
      console.log("Seeding finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err.message);
      process.exit(1);
    });
}

module.exports = { runSeed };
