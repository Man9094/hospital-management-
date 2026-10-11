# MedCore HMS — Hospital Management System

A decoupled full-stack Hospital Management Operating System featuring a dedicated **Express.js + MongoDB Backend** and a modern **Next.js 16 + React 19 Frontend**.

---

## 1. Project Architecture

```text
hospital-management/
│
├── frontend/                 # Next.js 16 Frontend App (Port 3000)
│   ├── src/
│   │   ├── app/              # Next.js App Router (Pages & Admin Dashboard)
│   │   ├── components/       # UI Components & Role-Based Panels
│   │   ├── context/          # Auth Context & State Management
│   │   └── services/         # Centralized API Service (api.ts)
│   ├── next.config.ts        # Transparent /api/* proxy to Express backend
│   ├── .env.example
│   ├── .env.local
│   └── package.json
│
├── backend/                  # Dedicated Express.js + Mongoose Service (Port 5000)
│   ├── src/
│   │   ├── config/           # MongoDB / Mongoose connection (db.js)
│   │   ├── models/           # Mongoose Data Models
│   │   ├── controllers/      # MVC API Controllers
│   │   ├── routes/           # Express Route definitions
│   │   ├── middleware/       # JWT Auth, RBAC, Error Handling
│   │   ├── utils/            # JWT Token management
│   │   ├── seed.js           # Comprehensive Indian hospital seed script
│   │   └── server.js         # Express App Entry Point
│   ├── test-api.js           # Automated backend test suite
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## 2. Quick Start Guide

### Step 1: Start MongoDB
Ensure MongoDB is running locally on port 27017, or configure your cloud MongoDB Atlas URI in `backend/.env`.
```text
mongodb://127.0.0.1:27017/hospital_management
```

### Step 2: Setup & Run Backend
```bash
cd backend
npm install
npm run seed       # Seeds master data, departments, beds & 12 roles
npm run dev        # Starts Express server on http://localhost:5000
```

### Step 3: Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev        # Starts Next.js app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Authentication & Security Highlights

- **HTTP-Only Cookies**: JWT authentication tokens are saved in secure, `httpOnly: true`, `sameSite: "lax"` cookies to eliminate XSS token leakage.
- **Bcrypt Password Hashing**: Passwords are securely hashed with bcrypt before storing in MongoDB.
- **Server-Side RBAC**: Admin and role-restricted endpoints verify JWT tokens and roles on the backend directly (`requireRole(...)`).
- **No Mock Auth**: Real authentication flow connected from frontend forms -> Express API -> MongoDB.
- **Rate Limiting & Helmet**: Login endpoints are protected against brute-force attacks via express-rate-limit; HTTP security headers enforced by Helmet.

---

## 4. Default Seed Credentials

All default seed accounts use the password: `MedCore@2026`

| Role | Email |
|---|---|
| Super Admin | `superadmin@medcore.in` |
| Hospital Admin | `admin@medcore.in` |
| Doctor (OPD) | `doctor@medcore.in` |
| Doctor (Cardio) | `doctor.shah@medcore.in` |
| Nurse | `nurse@medcore.in` |
| Reception | `reception@medcore.in` |
| Lab Tech | `lab@medcore.in` |
| Radiology | `radiology@medcore.in` |
| Pharmacy | `pharmacy@medcore.in` |
| Billing | `billing@medcore.in` |
| Patient | `patient@medcore.in` |

---

## 5. Dual Environment Architecture (Local & Production)

### Local Development
- **Frontend**: `http://localhost:3000` (Next.js 16)
- **Backend**: `http://localhost:5000` (Express)
- **Database**: MongoDB Atlas or Local MongoDB

### Production Deployment
- **Frontend**: Hosted on [Vercel](https://vercel.com)
  - Environment Variable: `NEXT_PUBLIC_API_URL=https://<your-deployed-backend-url>`
- **Backend**: Hosted on [Render](https://render.com) or [Railway](https://railway.app)
  - Environment Variables:
    - `NODE_ENV=production`
    - `PORT=5000` (or host provided)
    - `MONGODB_URI=<your-mongodb-atlas-connection-string>`
    - `JWT_SECRET=<your-jwt-secret>`
    - `FRONTEND_URL=https://<your-vercel-domain>.vercel.app`
- **Database**: MongoDB Atlas

