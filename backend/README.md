# MedCore HMS — Backend Service

A separated, production-grade Express.js & MongoDB/Mongoose backend for the MedCore Hospital Management System.

---

## 1. Architecture Overview

```text
hospital-management/
├── frontend/                 # Next.js 16 + React 19 Hospital Web Portal (Port 3000)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts        # Transparent Next.js API proxy to Express backend
│   └── .env.local
│
└── backend/                  # Dedicated Express.js + Mongoose Service (Port 5000)
    ├── src/
    │   ├── config/
    │   │   └── db.js         # Mongoose connection & connection lifecycle
    │   │
    │   ├── models/           # Mongoose schemas & indexes
    │   │   ├── User.js
    │   │   ├── Patient.js
    │   │   ├── Doctor.js & DoctorStatus.js
    │   │   ├── Appointment.js
    │   │   ├── Department.js
    │   │   ├── Prescription.js
    │   │   ├── PharmacyItem.js & Medicine.js
    │   │   ├── Ward.js & Bed.js
    │   │   ├── IpdAdmission.js & NursingNote.js
    │   │   ├── LabTest.js & LabOrder.js
    │   │   ├── RadiologyOrder.js
    │   │   ├── EmergencyCase.js
    │   │   ├── Invoice.js
    │   │   ├── AuditLog.js
    │   │   └── ...
    │   │
    │   ├── controllers/      # Business logic & responses
    │   │   ├── authController.js
    │   │   ├── patientController.js
    │   │   ├── doctorController.js
    │   │   ├── appointmentController.js
    │   │   ├── bedController.js
    │   │   ├── nursingController.js
    │   │   ├── pharmacyController.js
    │   │   ├── labController.js
    │   │   ├── radiologyController.js
    │   │   ├── billingController.js
    │   │   ├── emergencyController.js
    │   │   ├── emrController.js
    │   │   ├── analyticsController.js
    │   │   ├── auditController.js
    │   │   └── seedController.js
    │   │
    │   ├── routes/           # REST endpoints
    │   │   ├── authRoutes.js
    │   │   ├── patientRoutes.js
    │   │   ├── doctorRoutes.js
    │   │   ├── doctorStatusRoutes.js
    │   │   ├── appointmentRoutes.js
    │   │   ├── bedRoutes.js
    │   │   ├── nursingRoutes.js
    │   │   ├── pharmacyRoutes.js
    │   │   ├── labRoutes.js
    │   │   ├── radiologyRoutes.js
    │   │   ├── billingRoutes.js
    │   │   ├── emergencyRoutes.js
    │   │   ├── emrRoutes.js
    │   │   ├── analyticsRoutes.js
    │   │   ├── auditRoutes.js
    │   │   └── seedRoutes.js
    │   │
    │   ├── middleware/       # JWT Auth, RBAC, and centralized error handling
    │   │   ├── authMiddleware.js
    │   │   ├── roleMiddleware.js
    │   │   └── errorMiddleware.js
    │   │
    │   ├── utils/
    │   │   └── token.js
    │   │
    │   ├── seed.js           # Comprehensive Indian hospital seed script
    │   └── server.js         # Express app entry point
    │
    ├── test-api.js           # Automated backend test suite
    ├── .env
    ├── .env.example
    ├── package.json
    └── README.md
```

---

## 2. Technology Stack

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (`jsonwebtoken`) stored in HTTP-only cookies (`cookie-parser`)
- **Password Hashing**: `bcryptjs` (salt rounds: 10)
- **Security**: Helmet, CORS with strict origin validation and credentials, express-rate-limit

---

## 3. Environment Variables

Create `.env` in the `backend/` folder based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hospital_management
JWT_SECRET=medcore_hms_jwt_secret_key_change_in_production_2026
FRONTEND_URL=http://localhost:3000
SEED_ADMIN_EMAIL=admin@medcore.in
SEED_ADMIN_PASSWORD=MedCore@2026
```

---

## 4. Setup & Running the Backend

### Prerequisites
1. Node.js (v18+)
2. MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string set in `MONGODB_URI`.

### Installation
```bash
cd backend
npm install
```

### Seed Database
Populates hospital profiles, departments, beds, LIS/RIS catalog, and accounts for all 12 roles:
```bash
npm run seed
```

### Start in Development Mode (with hot-reload)
```bash
npm run dev
```

### Start in Production Mode
```bash
npm start
```

### Run Automated Tests
```bash
node test-api.js
```

---

## 5. API Endpoints Reference

### Health
- `GET /api/health` — Service health & uptime status

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate user, returns safe user payload and sets HTTP-only `medcore-auth-token` cookie
- `GET /api/auth/me` — Returns current authenticated user (requires auth cookie)
- `POST /api/auth/logout` — Clears HTTP-only session cookie
- `POST /api/auth/forgot-password` — Generates secure reset token
- `POST /api/auth/reset-password` — Resets password with valid token
- `POST /api/auth/patient-otp` — Sends or verifies patient mobile OTP

### Patients (`/api/patients`)
- `GET /api/patients` — Search and filter patient directory
- `POST /api/patients` — Register new patient (generates sequential `MC-2026-XXXXXX` UHID)
- `GET /api/patients/:uhid` — Comprehensive EHR Dossier (appointments, vitals, clinical notes, prescriptions, lab results, radiology, IPD history, invoices, audit trail)
- `PUT /api/patients/:uhid` — Update patient demographics
- `DELETE /api/patients/:uhid` — Discharge/deactivate patient

### Doctors & Status (`/api/doctors`, `/api/doctor-status`)
- `GET /api/doctors` — List of doctors
- `GET /api/doctors/:id` — Doctor profile
- `GET /api/doctor-status` — Real-time cabin queue, delay status, and active patient in consultation
- `POST /api/doctor-status` — Update doctor delay or cabin status

### Appointments (`/api/appointments`)
- `GET /api/appointments` — OPD appointments queue with dynamic estimated consultation time based on doctor delay
- `POST /api/appointments` — Book appointment and issue token number (`A-10X`)
- `PATCH /api/appointments` — Start consultation, complete consultation, or update status

### Clinical & Operational
- `GET /api/beds`, `PATCH /api/beds` — Bed management matrix across wards (ICU, Deluxe, Semi-Private, General)
- `GET /api/nursing`, `POST /api/nursing` — Inpatient nursing observation chart and vitals
- `GET /api/pharmacy`, `POST /api/pharmacy` — Medicine inventory with batches and prescription dispensing
- `GET /api/lab`, `PATCH /api/lab` — Diagnostic test catalog, sample collection, and result verification
- `GET /api/radiology`, `PATCH /api/radiology` — RIS imaging studies and radiologist report verification
- `GET /api/billing`, `POST /api/billing` — Invoices, payments, and PM-JAY / TPA cashless claims
- `GET /api/emergency`, `POST /api/emergency` — ER triage queue with color coding (Red, Orange, Yellow, Green)
- `POST /api/emr` — End-to-end clinical consultation submission (Note, Vitals, Rx, Lab orders)
- `GET /api/analytics` — Hospital operational metrics and KPIs
- `GET /api/audit` — Immutable audit trail (requires `hospital_admin` or `super_admin`)
- `POST /api/seed` — Administrative database re-seed endpoint

---

## 6. Roles & RBAC Matrix

MedCore HMS enforces server-side Role-Based Access Control:

| Role | Access Level |
|---|---|
| `super_admin` | Unrestricted system-wide access |
| `hospital_admin` | Hospital executive management, audit logs, billing, staff, bed configuration |
| `doctor` | OPD/IPD queue, EMR consultation, prescriptions, lab orders, cabin status |
| `nurse` | Nursing logs, vitals recording, bed allocation, inpatient monitoring |
| `reception` | Patient registration, UHID creation, appointment booking & token issuance |
| `lab` | Laboratory orders, barcode collection, result entry |
| `radiology` | RIS imaging orders, diagnostic reporting |
| `pharmacist` | Inventory management, batch stock levels, dispensing prescriptions |
| `billing` | Invoicing, payment collection, TPA/PM-JAY insurance claims |
| `patient` | Personal patient portal (appointments, vitals, prescriptions, discharge summary) |

---

## 7. Default Credentials (Development)

Password for all seeded accounts: `MedCore@2026`

- **Super Admin**: `superadmin@medcore.in`
- **Hospital Admin**: `admin@medcore.in`
- **Doctor (Internal Med)**: `doctor@medcore.in`
- **Doctor (Cardiology)**: `doctor.shah@medcore.in`
- **Nurse**: `nurse@medcore.in`
- **Reception**: `reception@medcore.in`
- **Laboratory**: `lab@medcore.in`
- **Radiology**: `radiology@medcore.in`
- **Pharmacy**: `pharmacy@medcore.in`
- **Billing**: `billing@medcore.in`
- **Patient**: `patient@medcore.in`

---

## 8. Production Deployment Guide (Render / Railway)

### Deploying to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository.
3. Configure settings:
   - **Root Directory**: `backend` (if repo root has both frontend and backend)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `PORT`: (provided automatically by Render, or default 5000)
   - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
   - `JWT_SECRET`: `<a-long-random-secret-string>`
   - `FRONTEND_URL`: `https://<your-vercel-domain>.vercel.app`
5. Test: Check `https://<your-render-url>/api/health`.

### Deploying to Railway
1. Create a new project on [Railway](https://railway.app).
2. Select **Deploy from GitHub repo**.
3. Under service settings:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in Railway:
   - `NODE_ENV`: `production`
   - `PORT`: (provided automatically by Railway, or 5000)
   - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
   - `JWT_SECRET`: `<a-long-random-secret-string>`
   - `FRONTEND_URL`: `https://<your-vercel-domain>.vercel.app`
5. Test: Check `https://<your-railway-url>/api/health`.

