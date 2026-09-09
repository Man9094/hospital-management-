"use client";

import React, { useState } from "react";
import {
  Bed,
  Users,
  CreditCard,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Save,
  Plus,
  Trash2,
  Sliders,
  Globe,
  Settings,
  Sparkles,
  Phone,
  Building2,
  Megaphone
} from "lucide-react";

export default function HospitalAdminPanel() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "hero_cms" | "doctors_cms" | "beds_cms" | "notice_cms">("dashboard");

  // Website Editable State
  const [siteSettings, setSiteSettings] = useState({
    brandTitle: "MEDINNOVA care",
    helplinePhone: "+91 1800-MEDCORE",
    opdFee: "49",
    ipdFee: "199",
    heroTitleGu: "તમારા અનુકૂળ ડોક્ટર અને બેડ ઘરેથી જ પસંદ કરો",
    heroSubGu: "દર્દીઓ ઘરે બેઠા જ પોતાની અનુકૂળતા મુજબ ડોક્ટર પસંદ કરી શકે છે, ઓપીડી લાઇન નંબર બુક કરી શકે છે અને હોસ્પિટલમાં બેડ કન્ફર્મ કરી શકે છે.",
    noticeTextGu: "૨૪/૭ ઈમરજન્સી સેવા અને ઘરે બેઠા બેડ બુકિંગ સુવિધા સક્રિય છે. હેલ્પલાઇન: 1800-MEDCORE"
  });

  const [doctorsList, setDoctorsList] = useState([
    { id: "1", name: "ડો. રાજેશ પટેલ", degree: "M.D. Medicine", specialty: "જનરલ ફિઝિશિયન", fee: "₹49", status: "Active" },
    { id: "2", name: "ડો. સ્નેહા શાહ", degree: "M.D. Cardiology", specialty: "હૃદય રોગ નિષ્ણાત", fee: "₹49", status: "Active" },
    { id: "3", name: "ડો. અમિત મહેતા", degree: "M.S. Orthopedics", specialty: "હાડકાના નિષ્ણાત", fee: "₹49", status: "Active" },
    { id: "4", name: "ડો. પૂજા જોશી", degree: "M.D. Pediatrics", specialty: "બાળ રોગ નિષ્ણાત", fee: "₹49", status: "Active" }
  ]);

  const [bedsList, setBedsList] = useState([
    { code: "ICU-101", ward: "ICU Ward", status: "occupied", patient: "Patient #4081" },
    { code: "ICU-102", ward: "ICU Ward", status: "available", patient: "-" },
    { code: "ICU-103", ward: "ICU Ward", status: "available", patient: "-" },
    { code: "ICU-104", ward: "ICU Ward", status: "sanitizing", patient: "-" },
    { code: "GEN-201", ward: "General Ward", status: "available", patient: "-" },
    { code: "GEN-202", ward: "General Ward", status: "occupied", patient: "Patient #4112" },
    { code: "DEL-301", ward: "Deluxe Suite", status: "available", patient: "-" },
    { code: "DEL-302", ward: "Deluxe Suite", status: "occupied", patient: "Patient #4095" }
  ]);

  const [newDoctor, setNewDoctor] = useState({ name: "", degree: "", specialty: "", fee: "₹49" });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name) return;
    setDoctorsList([
      ...doctorsList,
      { id: Date.now().toString(), name: newDoctor.name, degree: newDoctor.degree, specialty: newDoctor.specialty, fee: newDoctor.fee, status: "Active" }
    ]);
    setNewDoctor({ name: "", degree: "", specialty: "", fee: "₹49" });
  };

  const toggleBedStatus = (code: string) => {
    setBedsList(
      bedsList.map((b) => {
        if (b.code === code) {
          const nextStatus = b.status === "available" ? "occupied" : b.status === "occupied" ? "sanitizing" : "available";
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Command Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="text-xs font-extrabold text-[#13C5DD] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4" /> હોસ્પિટલ એડમિન મેનેજર વ્યુ (ADMIN CMS CONTROL)
          </div>
          <h1 className="text-2xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">
            વેબસાઇટ કન્ટેન્ટ અને સેક્શન કંટ્રોલર
          </h1>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-full bg-[#00C896] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md">
            <CheckCircle2 className="w-4 h-4" /> ફેરફારો વેબસાઇટ પર સેવ થઈ ગયા!
          </div>
        )}
      </div>

      {/* CMS Management Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === "dashboard"
              ? "bg-[#13C5DD] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          }`}
        >
          <TrendingUp className="w-4 h-4" /> ઓપરેશન્સ ડેશબોર્ડ
        </button>

        <button
          onClick={() => setActiveTab("hero_cms")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === "hero_cms"
              ? "bg-[#13C5DD] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Edit className="w-4 h-4" /> હીરો અને પ્રાઇસ મોડિફાય કરો
        </button>

        <button
          onClick={() => setActiveTab("doctors_cms")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === "doctors_cms"
              ? "bg-[#13C5DD] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Stethoscope className="w-4 h-4" /> ડોક્ટર મેનેજર
        </button>

        <button
          onClick={() => setActiveTab("beds_cms")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === "beds_cms"
              ? "bg-[#13C5DD] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Bed className="w-4 h-4" /> બેડ અને રૂમ મેનેજર
        </button>

        <button
          onClick={() => setActiveTab("notice_cms")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === "notice_cms"
              ? "bg-[#13C5DD] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          }`}
        >
          <Megaphone className="w-4 h-4" /> એનાઉન્સમેન્ટ નોટિસ
        </button>
      </div>

      {/* TAB 1: Dashboard Overview */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-medium">આજની કુલ આવક</div>
              <div className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">₹1,28,450</div>
              <div className="text-[11px] text-[#00C896] font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs ગઈકાલે
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-medium">ખાલી બેડ જગ્યા</div>
              <div className="text-3xl font-extrabold font-poppins text-[#13C5DD] mt-1">૧૮ બેડ ખાલી</div>
              <div className="text-[11px] text-[#00C896] font-semibold mt-1">ઓનલાઇન બુકિંગ સક્રિય</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-medium">આજના OPD દર્દીઓ</div>
              <div className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white mt-1">348 દર્દીઓ</div>
              <div className="text-[11px] text-[#00C896] font-semibold mt-1">સરેરાશ સમય: 4.2 મિનિટ</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-medium">પ્લાન્ડ સર્જરી (OT)</div>
              <div className="text-3xl font-extrabold font-poppins text-purple-500 mt-1">12 સર્જરી</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">3 સર્જરી પૂર્ણ થઈ</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hero & Website Settings CMS */}
      {activeTab === "hero_cms" && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#13C5DD]" /> હીરો સેક્શન અને સર્વિસ ફી એડિટર
            </h3>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-[#13C5DD] text-white text-xs font-extrabold uppercase flex items-center gap-1.5 shadow-md">
              <Save className="w-4 h-4" /> ફેરફારો સેવ કરો
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
                હીરો મેઇન હેડલાઇન (ગુજરાતી)
              </label>
              <input
                type="text"
                value={siteSettings.heroTitleGu}
                onChange={(e) => setSiteSettings({ ...siteSettings, heroTitleGu: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
                ઇમરજન્સી હેલ્પલાઇન ફોન નંબર
              </label>
              <input
                type="text"
                value={siteSettings.helplinePhone}
                onChange={(e) => setSiteSettings({ ...siteSettings, helplinePhone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
                OPD ટોકન બુકિંગ સર્વિસ ચાર્જ (₹)
              </label>
              <input
                type="text"
                value={siteSettings.opdFee}
                onChange={(e) => setSiteSettings({ ...siteSettings, opdFee: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
                IPD બેડ એડમિશન સર્વિસ ચાર્જ (₹)
              </label>
              <input
                type="text"
                value={siteSettings.ipdFee}
                onChange={(e) => setSiteSettings({ ...siteSettings, ipdFee: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
              હીરો ડિસ્ક્રિપ્શન વિગત
            </label>
            <textarea
              rows={3}
              value={siteSettings.heroSubGu}
              onChange={(e) => setSiteSettings({ ...siteSettings, heroSubGu: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>
        </form>
      )}

      {/* TAB 3: Doctor Manager CMS */}
      {activeTab === "doctors_cms" && (
        <div className="space-y-6">
          {/* Add New Doctor Card */}
          <form onSubmit={handleAddDoctor} className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold font-poppins text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#13C5DD]" /> નવો ડોક્ટર ઉમેરો (Add New Doctor Profile)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="ડોક્ટરનું નામ"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="ડિગ્રી (M.D. Medicine)"
                value={newDoctor.degree}
                onChange={(e) => setNewDoctor({ ...newDoctor, degree: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="વિભાગ (જનરલ ફિઝિશિયન)"
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button type="submit" className="py-2.5 rounded-xl bg-[#13C5DD] text-white text-xs font-extrabold uppercase shadow-md">
                + ડોક્ટર ઉમેરો
              </button>
            </div>
          </form>

          {/* Active Doctor Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-extrabold uppercase">
                <tr>
                  <th className="p-3">ડોક્ટરનું નામ</th>
                  <th className="p-3">ડિગ્રી</th>
                  <th className="p-3">વિભાગ</th>
                  <th className="p-3">ફી</th>
                  <th className="p-3">સ્ટેટસ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {doctorsList.map((doc) => (
                  <tr key={doc.id}>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{doc.name}</td>
                    <td className="p-3 text-slate-500">{doc.degree}</td>
                    <td className="p-3 text-[#13C5DD] font-bold">{doc.specialty}</td>
                    <td className="p-3 font-extrabold text-[#00C896]">{doc.fee}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#00C896]/20 text-[#00C896] font-bold text-[10px]">
                        ● {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Bed & Room Blueprint CMS */}
      {activeTab === "beds_cms" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#13C5DD]" /> લાઇવ બેડ સ્ટેટસ મેનેજર (Click to Toggle Status)
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              લીલો: ખાલી | લાલ: બુક | પીળો: સફાઈ
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {bedsList.map((bed) => (
              <button
                key={bed.code}
                onClick={() => toggleBedStatus(bed.code)}
                className={`p-3 rounded-2xl text-xs font-extrabold border text-center transition-all ${
                  bed.status === "available"
                    ? "bg-[#00C896] text-white shadow-md"
                    : bed.status === "occupied"
                    ? "bg-red-500 text-white"
                    : "bg-amber-400 text-slate-900"
                }`}
              >
                <div className="font-poppins">{bed.code}</div>
                <div className="text-[9px] opacity-90 mt-0.5">
                  {bed.status === "available" ? "ખાલી" : bed.status === "occupied" ? "બુક" : "સફાઈ"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Live Announcement Banner CMS */}
      {activeTab === "notice_cms" && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-extrabold font-poppins text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#13C5DD]" /> ટોપબાર એનાઉન્સમેન્ટ નોટિસ એડિટર
            </h3>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-[#13C5DD] text-white text-xs font-extrabold uppercase flex items-center gap-1.5 shadow-md">
              <Save className="w-4 h-4" /> નોટિસ પબ્લિશ કરો
            </button>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block mb-1">
              લાઇવ એનાઉન્સમેન્ટ મેસેજ (ગુજરાતી)
            </label>
            <textarea
              rows={3}
              value={siteSettings.noticeTextGu}
              onChange={(e) => setSiteSettings({ ...siteSettings, noticeTextGu: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            />
          </div>
        </form>
      )}

    </div>
  );
}
