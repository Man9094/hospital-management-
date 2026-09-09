"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import PatientAdmissionModal from "@/components/modals/PatientAdmissionModal";
import {
  Stethoscope,
  Star,
  Clock,
  Award,
  Globe,
  Calendar,
  CheckCircle2,
  Phone,
  ArrowRight,
  Filter,
  UserCheck
} from "lucide-react";

export interface Doctor {
  id: string;
  nameGu: string;
  nameHi: string;
  nameEn: string;
  degree: string;
  specialtyGu: string;
  specialtyHi: string;
  specialtyEn: string;
  category: "physician" | "cardiology" | "orthopedic" | "pediatric" | "gynecology" | "neurology";
  expYears: number;
  timing: string;
  fee: string;
  rating: number;
  patientsCount: number;
  languages: string[];
  image: string;
}

export const DOCTORS_LIST: Doctor[] = [
  {
    id: "dr-rajesh-patel",
    nameGu: "ડો. રાજેશ પટેલ",
    nameHi: "डॉ. राजेश पटेल",
    nameEn: "Dr. Rajesh Patel",
    degree: "M.D. General Medicine (Gold Medalist)",
    specialtyGu: "જનરલ ફિઝિશિયન (તાવ, શરદી, ડાયાબિટીસ)",
    specialtyHi: "जनरल फिजिशियन (बुखार, सर्दी, डायबिटीज)",
    specialtyEn: "Senior General Physician & Diabetologist",
    category: "physician",
    expYears: 16,
    timing: "સવારે ૦૯:૦૦ થી બપોરે ૦૧:૦૦ | સાંજે ૦૫:૦૦ થી ૦૮:૦૦",
    fee: "₹49 OPD Token",
    rating: 4.9,
    patientsCount: 4200,
    languages: ["ગુજરાતી", "हिंदी", "English"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "dr-sneha-shah",
    nameGu: "ડો. સ્નેહા શાહ",
    nameHi: "डॉ. स्नेहा शाह",
    nameEn: "Dr. Sneha Shah",
    degree: "M.D., D.M. Cardiology (F.A.C.C.)",
    specialtyGu: "હૃદય રોગ નિષ્ણાત (Cardiologist)",
    specialtyHi: "हृदय रोग विशेषज्ञ (Cardiologist)",
    specialtyEn: "Senior Cardiologist & Heart Specialist",
    category: "cardiology",
    expYears: 14,
    timing: "સવારે ૧૦:૦૦ થી બપોરે ૦૨:૦૦",
    fee: "₹49 OPD Token",
    rating: 4.9,
    patientsCount: 3100,
    languages: ["ગુજરાતી", "हिंदी", "English"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "dr-[#-mehta",
    nameGu: "ડો. અમિત મહેતા",
    nameHi: "डॉ. अमित मेहता",
    nameEn: "Dr. Amit Mehta",
    degree: "M.S. Orthopedics (Joint Replacement)",
    specialtyGu: "હાડકા અને સાંધાના નિષ્ણાત (Orthopedic)",
    specialtyHi: "हड्डी एवं जोड़ रोग विशेषज्ञ (Orthopedic)",
    specialtyEn: "Orthopedic & Joint Replacement Surgeon",
    category: "orthopedic",
    expYears: 18,
    timing: "સવારે ૧૧:૦૦ થી બપોરે ૦૩:૦૦",
    fee: "₹49 OPD Token",
    rating: 4.8,
    patientsCount: 5400,
    languages: ["ગુજરાતી", "हिंदी", "English"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "dr-pujaben-joshi",
    nameGu: "ડો. પૂજાબેન જોશી",
    nameHi: "डॉ. पूजा जोशी",
    nameEn: "Dr. Pooja Joshi",
    degree: "M.D. Pediatrics (Child Specialist)",
    specialtyGu: "બાળ રોગ નિષ્ણાત (Pediatrician)",
    specialtyHi: "बाल रोग विशेषज्ञ (Pediatrician)",
    specialtyEn: "Senior Pediatrician & Child Specialist",
    category: "pediatric",
    expYears: 12,
    timing: "સવારે ૦૯:૩૦ થી બપોરે ૦૧:૩૦ | સાંજે ૦૪:૩૦ થી ૦૭:૩૦",
    fee: "₹49 OPD Token",
    rating: 4.9,
    patientsCount: 2800,
    languages: ["ગુજરાતી", "हिंदी", "English"],
    image: "https://images.unsplash.com/photo-1594824813566-78a9c2b9a700?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "dr-anita-desai",
    nameGu: "ડો. અનીતાબેન દેસાઈ",
    nameHi: "डॉ. अनीता देसाई",
    nameEn: "Dr. Anita Desai",
    degree: "M.S., D.G.O. Gynecologist",
    specialtyGu: "સ્ત્રી રોગ અને પ્રસુતિ નિષ્ણાત (Gynecologist)",
    specialtyHi: "स्त्री रोग एवं प्रसूति विशेषज्ञ (Gynecologist)",
    specialtyEn: "Gynecologist & Obstetrician",
    category: "gynecology",
    expYears: 15,
    timing: "સવારે ૧૦:૦૦ થી બપોરે ૦૨:૦૦",
    fee: "₹49 OPD Token",
    rating: 4.9,
    patientsCount: 3900,
    languages: ["ગુજરાતી", "हिंदी", "English"],
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "dr-vikram-rathod",
    nameGu: "ડો. વિક્રમ રાઠોડ",
    nameHi: "डॉ. विक्रम राठौड़",
    nameEn: "Dr. Vikram Rathod",
    degree: "M.D., D.M. Neurology",
    specialtyGu: "મગજ અને ચેતાતંત્ર નિષ્ણાત (Neurologist)",
    specialtyHi: "मस्तिष्क एवं तंत्रिका रोग विशेषज्ञ (Neurologist)",
    specialtyEn: "Senior Neurologist & Brain Specialist",
    category: "neurology",
    expYears: 20,
    timing: "બપોરે ૧૨:૦૦ થી સાંજે ૦૪:૦૦",
    fee: "₹49 OPD Token",
    rating: 4.9,
    patientsCount: 4800,
    languages: ["ગુજરાતી", "हिंदी", "English"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300"
  }
];

export default function DoctorsSection() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CATEGORIES = [
    { id: "all", label: language === "gu" ? "તમામ નિષ્ણાત ડોકટરો" : language === "hi" ? "सभी विशेषज्ञ डॉक्टर" : "All Doctors" },
    { id: "physician", label: language === "gu" ? "જનરલ ફિઝિશિયન" : language === "hi" ? "जनरल फिजिशियन" : "General Physician" },
    { id: "cardiology", label: language === "gu" ? "હૃદય રોગ (Cardiology)" : language === "hi" ? "हृदय रोग" : "Cardiology" },
    { id: "orthopedic", label: language === "gu" ? "હાડકા (Orthopedic)" : language === "hi" ? "हड्डी रोग" : "Orthopedics" },
    { id: "pediatric", label: language === "gu" ? "બાળ રોગ (Child)" : language === "hi" ? "बाल रोग" : "Pediatrics" },
    { id: "gynecology", label: language === "gu" ? "સ્ત્રી રોગ (Gynec)" : language === "hi" ? "स्त्री रोग" : "Gynecology" }
  ];

  const filteredDoctors =
    activeCategory === "all"
      ? DOCTORS_LIST
      : DOCTORS_LIST.filter((d) => d.category === activeCategory);

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setIsModalOpen(true);
  };

  return (
    <section id="doctors" className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Medinova Header Accent Line */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div>
            <span className="medinova-subheading text-xs">
              QUALIFIED HEALTHCARE PROFESSIONALS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-poppins text-[#1D2A4D] dark:text-white uppercase">
            {language === "gu"
              ? "તમારા અનુકૂળ નિષ્ણાત ડોક્ટર પસંદ કરો"
              : language === "hi"
              ? "अपनी सुविधा के अनुसार डॉक्टर चुनें"
              : "Select Your Preferred Specialist Doctor"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            અમારા અનુભવી અને સુવર્ણચંદ્રક વિજેતા ડોકટરો પાસેથી ઘરેથી જ સરળતાથી OPD એપોઇન્ટમેન્ટ બુક કરો.
          </p>
        </div>

        {/* Specialty Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "bg-[#13C5DD] text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#13C5DD]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const name = language === "gu" ? doc.nameGu : language === "hi" ? doc.nameHi : doc.nameEn;
            const specialty = language === "gu" ? doc.specialtyGu : language === "hi" ? doc.specialtyHi : doc.specialtyEn;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#13C5DD] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Doctor Image & Rating Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={doc.image}
                      alt={name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#13C5DD] shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.patientsCount}+ દર્દીઓ)</span>
                      </div>
                      <h3 className="text-lg font-extrabold font-poppins text-[#1D2A4D] dark:text-white">
                        {name}
                      </h3>
                      <div className="text-xs text-[#13C5DD] font-bold mt-0.5">
                        {doc.degree}
                      </div>
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 mb-4">
                    {specialty}
                  </div>

                  {/* Doctor Details List */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#00C896] shrink-0" />
                      <span>અનુભવ: <strong className="text-slate-900 dark:text-white">{doc.expYears}+ વર્ષ</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#13C5DD] shrink-0" />
                      <span className="truncate">સમય: <strong className="text-slate-900 dark:text-white">{doc.timing}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>ભાષાઓ: {doc.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">કન્સલ્ટેશન ફી</div>
                    <div className="text-sm font-extrabold text-[#00C896]">{doc.fee}</div>
                  </div>

                  <button
                    onClick={() => handleBookDoctor(doc)}
                    className="px-5 py-2.5 rounded-full bg-[#13C5DD] hover:bg-[#10b1c7] text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    આ ડોક્ટર પસંદ કરો
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      <PatientAdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
