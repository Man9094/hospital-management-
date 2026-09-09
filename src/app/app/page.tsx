"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/dashboard/PortalLayout";
import { usePortal } from "@/context/PortalContext";
import { useAuth } from "@/context/AuthContext";
import SuperAdminPanel from "@/components/dashboard/panels/SuperAdminPanel";
import HospitalAdminPanel from "@/components/dashboard/panels/HospitalAdminPanel";
import DoctorPanel from "@/components/dashboard/panels/DoctorPanel";
import PatientPanel from "@/components/dashboard/panels/PatientPanel";
import ReceptionPanel from "@/components/dashboard/panels/ReceptionPanel";
import LabPanel from "@/components/dashboard/panels/LabPanel";
import PharmacyPanel from "@/components/dashboard/panels/PharmacyPanel";
import BedMatrixSection from "@/components/landing/BedMatrixSection";
import AIAssistantWidget from "@/components/ui/AIAssistantWidget";
import {
  Calendar,
  Users,
  Bed,
  FlaskConical,
  Pill,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  FileText,
  TrendingUp,
  Download,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function SaaSAppPage() {
  const { activeRole } = usePortal();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleHash = () => {
      setHash(window.location.hash || "");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#13C5DD] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Middleware handles the redirect, but show nothing if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Use the authenticated user's role (not the portal context role)
  const userRole = user?.role || activeRole;

  return (
    <PortalLayout>
      {/* Route according to URL Hash Anchor */}
      {hash === "" && (
        <>
          {userRole === "super_admin" && <SuperAdminPanel />}
          {userRole === "hospital_admin" && <HospitalAdminPanel />}
          {userRole === "doctor" && <DoctorPanel />}
          {userRole === "patient" && <PatientPanel />}
          {userRole === "reception" && <ReceptionPanel />}
          {userRole === "lab" && <LabPanel />}
          {userRole === "pharmacy" && <PharmacyPanel />}
        </>
      )}

      {/* #appointments: Appointments Queue Manager */}
      {hash === "#appointments" && <AppointmentsQueueView />}

      {/* #patients: Patient EHR Records */}
      {hash === "#patients" && <PatientEhrView />}

      {/* #beds: IPD Bed Status Matrix */}
      {hash === "#beds" && <BedMatrixSection />}

      {/* #lab: Lab Diagnostics Queue */}
      {hash === "#lab" && <LabDiagnosticsView />}

      {/* #pharmacy: Pharmacy POS & Inventory */}
      {hash === "#pharmacy" && <PharmacyPosView />}

      {/* #billing: Billing & Cashless Claims */}
      {hash === "#billing" && <BillingClaimsView />}

      {/* #security: HIPAA & ABDM Security Logs */}
      {hash === "#security" && <SecurityAuditView />}

      <AIAssistantWidget />
    </PortalLayout>
  );
}

// -------------------------------------------------------------
// SECTION 1: Appointments Queue View
// -------------------------------------------------------------
function AppointmentsQueueView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> OPD એપોઇન્ટમેન્ટ ક્યુ (APPOINTMENTS QUEUE)
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            આજની ઓપીડી ટોકન લિસ્ટ અને વેઇટિંગ ટાઇમ
          </h1>
        </div>
        <button className="px-4 py-2.5 rounded-full bg-[#13C5DD] text-white text-xs font-extrabold uppercase shadow-md">
          + નવું OPD ટોકન બુક કરો (₹49)
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
            <tr>
              <th className="p-3">ટોકન #</th>
              <th className="p-3">દર્દીનું નામ</th>
              <th className="p-3">ફાળવેલ ડોક્ટર</th>
              <th className="p-3">સમય slot</th>
              <th className="p-3">ચાર્જ</th>
              <th className="p-3">સ્ટેટસ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#A-101</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">રમેશભાઈ પટેલ</td>
              <td className="p-3">ડો. રાજેશ પટેલ (MD)</td>
              <td className="p-3">10:15 AM</td>
              <td className="p-3 font-bold text-[#00C896]">₹49 (Paid)</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#00C896]/20 text-[#00C896] font-bold">● કન્સલ્ટિંગ ચાલુ</span></td>
            </tr>
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#A-102</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">સુનીતાબેન શાહ</td>
              <td className="p-3">ડો. સ્નેહા શાહ (Cardiology)</td>
              <td className="p-3">10:30 AM</td>
              <td className="p-3 font-bold text-[#00C896]">₹49 (Paid)</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 font-bold">● રાઇટિંગ રૂમમાં</span></td>
            </tr>
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#A-103</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">કિશોરભાઈ જોશી</td>
              <td className="p-3">ડો. અમિત મહેતા (Orthopedic)</td>
              <td className="p-3">10:45 AM</td>
              <td className="p-3 font-bold text-[#00C896]">₹49 (Paid)</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#00C896]/20 text-[#00C896] font-bold">● કન્ફર્મ</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 2: Patient EHR Records View
// -------------------------------------------------------------
function PatientEhrView() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-4 h-4" /> ABDM પેશન્ટ ઇલેક્ટ્રોનિક હેલ્થ રેકોર્ડ્સ (EHR RECORDS)
        </div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
          દર્દી મેડિકલ પ્રોફાઇલ અને હિસ્ટ્રી
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">દર્દી: રમેશભાઈ પટેલ (MRN #90412)</h3>
              <div className="text-xs text-slate-400">ABHA ID: 91-4091-2094-1102</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#00C896]/20 text-[#00C896] text-xs font-bold">
              વેરિફાઇડ ABHA
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <div>• <strong>નિદાન:</strong> હાઈ બ્લડ પ્રેશર અને સામાન્ય તાવ</div>
            <div>• <strong>એલર્જી:</strong> પેનિસિલિનથી એલર્જી</div>
            <div>• <strong>છેલ્લી મુલાકાત:</strong> ૧૯ ઓગસ્ટ ૨૦૨૬ (ડો. રાજેશ પટેલ)</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">દર્દી: સુનીતાબેન શાહ (MRN #90415)</h3>
              <div className="text-xs text-slate-400">ABHA ID: 91-8812-4019-3391</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#00C896]/20 text-[#00C896] text-xs font-bold">
              વેરિફાઇડ ABHA
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <div>• <strong>નિદાન:</strong> હૃદયની નિયમિત તપાસ (Cardiology Checkup)</div>
            <div>• <strong>એલર્જી:</strong> કોઈ એલર્જી નથી</div>
            <div>• <strong>છેલ્લી મુલાકાત:</strong> ૧૮ ઓગસ્ટ ૨૦૨૬ (ડો. સ્નેહા શાહ)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 3: Lab Diagnostics View
// -------------------------------------------------------------
function LabDiagnosticsView() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md flex justify-between items-center">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4" /> પેથોલોજી લેબ મેનેજર (LAB DIAGNOSTICS)
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            લેબ ટેસ્ટ સેમ્પલ અને ઓટો PDF રિપોર્ટ્સ
          </h1>
        </div>
        <button className="px-4 py-2.5 rounded-full bg-[#13C5DD] text-white text-xs font-extrabold uppercase shadow-md">
          + હોમ સેમ્પલ રિક્વેસ્ટ (₹29)
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
            <tr>
              <th className="p-3">સેમ્પલ ID</th>
              <th className="p-3">દર્દીનું નામ</th>
              <th className="p-3">ટેસ્ટનું નામ</th>
              <th className="p-3">સેમ્પલ પ્રકાર</th>
              <th className="p-3">રિપોર્ટ સ્ટેટસ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#LAB-881</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">રમેશભાઈ પટેલ</td>
              <td className="p-3">Complete Blood Count (CBC)</td>
              <td className="p-3">ઘરેથી કલેક્ટ (Home)</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#00C896]/20 text-[#00C896] font-bold">● PDF વોટ્સએપ મોકલેલ</span></td>
            </tr>
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#LAB-882</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">સુનીતાબેન શાહ</td>
              <td className="p-3">Lipid Profile & Lipid Panel</td>
              <td className="p-3">લેબ મુલાકાત</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-500 font-bold">● પ્રોસેસિંગ ચાલુ</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 4: Pharmacy POS View
// -------------------------------------------------------------
function PharmacyPosView() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
          <Pill className="w-4 h-4" /> બારકોડ મેડિસિન ફાર્મસી POS (PHARMACY POS)
        </div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
          પ્રિસ્ક્રિપ્શન બારકોડ સ્કેન અને સ્ટોક ઇન્વેન્ટરી
        </h1>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
            <tr>
              <th className="p-3">દવાનું નામ</th>
              <th className="p-3">બેચ નંબર</th>
              <th className="p-3">એક્સપાયરી</th>
              <th className="p-3">સ્ટોક જથ્થો</th>
              <th className="p-3">કિંમત (MRP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            <tr>
              <td className="p-3 font-bold text-slate-900 dark:text-white">Amoxicillin 500mg</td>
              <td className="p-3 text-slate-400">#AX-2026</td>
              <td className="p-3">12/2027</td>
              <td className="p-3 font-bold text-[#00C896]">320 સ્ટ્રીપ ઉપલબ્ધ</td>
              <td className="p-3 font-extrabold text-slate-900 dark:text-white">₹85</td>
            </tr>
            <tr>
              <td className="p-3 font-bold text-slate-900 dark:text-white">Paracetamol 650mg</td>
              <td className="p-3 text-slate-400">#PCM-991</td>
              <td className="p-3">08/2028</td>
              <td className="p-3 font-bold text-[#00C896]">1,200 સ્ટ્રીપ ઉપલબ્ધ</td>
              <td className="p-3 font-extrabold text-slate-900 dark:text-white">₹32</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 5: Billing & Claims View
// -------------------------------------------------------------
function BillingClaimsView() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-4 h-4" /> GST બિલિંગ અને આયુષ્માન ભારત ક્લેમ (BILLING & CLAIMS)
        </div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
          ઓનલાઇન ચૂકવણી અને કેશલેસ TPA વીમો
        </h1>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
            <tr>
              <th className="p-3">ઇન્વૉઇસ #</th>
              <th className="p-3">દર્દીનું નામ</th>
              <th className="p-3">સેવા પ્રકાર</th>
              <th className="p-3">રકમ (₹)</th>
              <th className="p-3">ચૂકવણી સ્ટેટસ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#INV-9012</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">રમેશભાઈ પટેલ</td>
              <td className="p-3">IPD Bed Admission Fee</td>
              <td className="p-3 font-extrabold text-[#00C896]">₹199</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#00C896]/20 text-[#00C896] font-bold">● UPI ચૂકવાયેલ</span></td>
            </tr>
            <tr>
              <td className="p-3 font-extrabold text-[#13C5DD]">#INV-9013</td>
              <td className="p-3 font-bold text-slate-900 dark:text-white">સુનીતાબેન શાહ</td>
              <td className="p-3">PM-JAY આયુષ્માન ક્લેમ</td>
              <td className="p-3 font-extrabold text-[#13C5DD]">₹45,000</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded bg-[#13C5DD]/20 text-[#13C5DD] font-bold">● કેશલેસ મંજૂર</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 6: Security Audit View
// -------------------------------------------------------------
function SecurityAuditView() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> ABDM સુરક્ષા અને ઓડિટ લોગ્સ (SECURITY LOGS)
        </div>
        <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
          એન્ક્રિપ્ટેડ ક્લાઉડ લોગ્સ અને સુરક્ષા ચકાસણી
        </h1>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-900 text-green-400">
          [2026-08-19 21:46:02] INFO: ABDM Health Data Exchange API v2.0 - Signature Validated (AES-256 GCM)
        </div>
        <div className="p-3 rounded-xl bg-slate-900 text-green-400">
          [2026-08-19 21:45:18] INFO: Cloud Backup Completed Successfully - Encrypted Payload Saved (Mumbai Region)
        </div>
        <div className="p-3 rounded-xl bg-slate-900 text-blue-400">
          [2026-08-19 21:44:00] AUTH: Hospital Director Login Verified from IP 103.220.xx.xx
        </div>
      </div>
    </div>
  );
}
