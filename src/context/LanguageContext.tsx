"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "gu" | "hi";

export interface Translations {
  // Brand & Nav
  brandTitle: string;
  brandTag: string;
  navFeatures: string;
  navDemo: string;
  navWorkflow: string;
  navDoctors: string;
  navTrust: string;
  signIn: string;
  startTrial: string;
  admitHome: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  ctaTrial: string;
  ctaDemo: string;
  trustHipa: string;
  trustSetup: string;
  trustSupport: string;

  // Stats Section
  statHospitals: string;
  statDoctors: string;
  statPatients: string;
  statAppointments: string;
  statHospitalsDesc: string;
  statDoctorsDesc: string;
  statPatientsDesc: string;
  statAppointmentsDesc: string;

  // Trusted Marquee
  trustedHeading: string;

  // Features Section
  featuresBadge: string;
  featuresTitle: string;
  featuresSub: string;
  catAll: string;
  catClinical: string;
  catDiagnostics: string;
  catOps: string;
  catAdmin: string;

  // Modules Grid
  modulesTitle: string;
  modulesSub: string;
  ipdTitle: string;
  ipdDesc: string;
  opdTitle: string;
  opdDesc: string;
  erTitle: string;
  erDesc: string;
  ambTitle: string;
  ambDesc: string;
  bloodTitle: string;
  bloodDesc: string;
  teleTitle: string;
  teleDesc: string;
  otTitle: string;
  otDesc: string;
  pacsTitle: string;
  pacsDesc: string;

  // Patient Journey Workflow
  workflowBadge: string;
  workflowTitle: string;
  workflowSub: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  step6: string;

  // Dashboard Role Switcher
  roleSuperAdmin: string;
  roleHospAdmin: string;
  roleDoctor: string;
  rolePatient: string;
  roleReception: string;
  roleLab: string;
  rolePharmacy: string;

  // Common Actions
  launchPortal: string;
  viewReport: string;
  bookAppointment: string;
  downloadPdf: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    brandTitle: "Medinnova Care",
    brandTag: "Pay-Per-Service Hospital Network",
    navFeatures: "Features",
    navDemo: "Live Demo",
    navWorkflow: "Patient Journey",
    navDoctors: "Our Doctors",
    navTrust: "ABDM & Security",
    signIn: "Hospital Login",
    startTrial: "Admit Patient From Home",
    admitHome: "Admit Patient From Home",

    heroBadge: "Zero Subscription Fee — Select Your Doctor & Book Service",
    heroTitle1: "Easily Select Doctor & Admit Patients",
    heroTitle2: "Directly From Home",
    heroSub: "Patients can easily choose their comfortable doctor, check OPD slots, check bed availability, and confirm hospital admissions from home with low service charges.",
    ctaTrial: "Admit Patient Now (From Home)",
    ctaDemo: "Check Hospital Beds",
    trustHipa: "Zero Monthly Subscription",
    trustSetup: "Pay Small Service Fee Per Booking",
    trustSupport: "24/7 Patient Assistance",

    statHospitals: "500+ Medical Centers",
    statDoctors: "12,000+ Qualified Doctors",
    statPatients: "4.5M+ Patients Served",
    statAppointments: "18M+ Bookings",
    statHospitalsDesc: "Trusted across Gujarat, Maharashtra & India",
    statDoctorsDesc: "Specialists available for OPD & Home Visit",
    statPatientsDesc: "Digital health passport & lab reports",
    statAppointmentsDesc: "Instant token confirmation",

    trustedHeading: "CONNECTED WITH TOP HOSPITALS & CLINICS ACROSS INDIA",

    featuresBadge: "Zero Subscription Features",
    featuresTitle: "Complete Hospital Care Accessible From Home",
    featuresSub: "Designed for easy home patient admissions, instant doctor consultations, and paperless billing.",
    catAll: "All Services",
    catClinical: "Home OPD & Bed Booking",
    catDiagnostics: "Home Sample Lab Tests",
    catOps: "Medicine Home Delivery",
    catAdmin: "Direct UPI & Insurance Pay",

    modulesTitle: "Key Healthcare Services",
    modulesSub: "Available 24/7 for patients from home and hospital staff.",
    ipdTitle: "Online Patient Bed Admission",
    ipdDesc: "Check ICU & Deluxe bed availability and book admission from home.",
    opdTitle: "Home & Clinic OPD Booking",
    opdDesc: "Book doctor OPD tokens online and avoid waiting room crowds.",
    erTitle: "24/7 Emergency Ambulance",
    erDesc: "Request immediate ambulance pick-up to hospital with live GPS.",
    ambTitle: "Home Medicine Delivery",
    ambDesc: "Order prescribed medicines directly to your doorstep.",
    bloodTitle: "Blood Donor Locator",
    bloodDesc: "Find urgent blood group donors near your location.",
    teleTitle: "Video Doctor Consultation",
    teleDesc: "Consult specialist doctors online from the comfort of home.",
    otTitle: "Surgery Booking & Clearance",
    otDesc: "Schedule elective surgeries and pre-op checkup clearance.",
    pacsTitle: "Home Lab Sample Collection",
    pacsDesc: "Book lab technicians to collect blood samples from home.",

    workflowBadge: "Home-to-Hospital Workflow",
    workflowTitle: "How Easy Patient Admission Works From Home",
    workflowSub: "Follow the 6 simple steps from home booking to complete recovery.",
    step1: "Select Doctor & Hospital From Home",
    step2: "Confirm Bed or OPD Slot Online",
    step3: "Pay Small Nominal Service Charge",
    step4: "Reach Hospital or Start Video Visit",
    step5: "Receive Treatment & Lab Reports",
    step6: "Paperless Discharge & Digital Bill",

    roleSuperAdmin: "Super Admin",
    roleHospAdmin: "Hospital Director",
    roleDoctor: "Doctor / Surgeon",
    rolePatient: "Patient Portal",
    roleReception: "Reception Desk",
    roleLab: "Lab Pathologist",
    rolePharmacy: "Pharmacist",

    launchPortal: "Launch Live Workspace",
    viewReport: "View Report",
    bookAppointment: "Book Appointment",
    downloadPdf: "Download PDF"
  },

  gu: {
    brandTitle: "મેડિનોવા કેર",
    brandTag: "કોઈ માસિક ફી નથી - ડોક્ટર સિલેક્શન સેવા",
    navFeatures: "મુખ્ય સુવિધાઓ",
    navDemo: "લાઇવ ડેમો",
    navWorkflow: "એડમિશનની રીત",
    navDoctors: "અમારા ડોકટરો",
    navTrust: "સુરક્ષા અને ABDM",
    signIn: "હોસ્પિટલ લોગિન",
    startTrial: "ઘરે બેઠા દર્દી એડમિટ કરો",
    admitHome: "ઘરે બેઠા દર્દી એડમિટ કરો",

    heroBadge: "કોઈ માસિક સબ્સ્ક્રિપ્શન ફી નથી — અનુકૂળ ડોક્ટર પસંદ કરો અને સેવા બુક કરો",
    heroTitle1: "તમારા અનુકૂળ ડોક્ટર પસંદ કરો",
    heroTitle2: "અને ઘરેથી દર્દી એડમિટ કરો",
    heroSub: "દર્દીઓ ઘરે બેઠા જ પોતાની અનુકૂળતા મુજબ ડોક્ટર પસંદ કરી શકે છે, ઓપીડી લાઇન નંબર બુક કરી શકે છે, હોસ્પિટલમાં ICU/બેડ જોઈ શકે છે અને માત્ર નાનો સર્વિસ ચાર્જ આપીને એડમિશન મેળવી શકે છે.",
    ctaTrial: "ઘરે બેઠા દર્દી એડમિટ કરો",
    ctaDemo: "બેડની જગ્યા તપાસો",
    trustHipa: "કોઈ માસિક સબ્સ્ક્રિપ્શન ચાર્જ નથી",
    trustSetup: "માત્ર બુકિંગ વખતે નાનો સર્વિસ ચાર્જ",
    trustSupport: "૨૪/૭ દર્દી સહાયતા સેવા",

    statHospitals: "૫૦૦+ હોસ્પિટલો જોડાયેલી",
    statDoctors: "૧૨,૦૦૦+ અનુભવી ડોકટરો",
    statPatients: "૪૫ લાખ+ સેવા આપેલા દર્દીઓ",
    statAppointments: "૧.૮ કરોડ+ સફળ બુકિંગ",
    statHospitalsDesc: "ગુજરાત અને સમગ્ર ભારતમાં વિસ્તરેલું નેટવર્ક",
    statDoctorsDesc: "ઘરે મુલાકાત અને ઓપીડી માટે ઉપલબ્ધ",
    statPatientsDesc: "ડિજિટલ હેલ્થ રેકોર્ડ અને રિપોર્ટ",
    statAppointmentsDesc: "ઇન્સ્ટન્ટ બુકિંગ કન્ફર્મેશન",

    trustedHeading: "ભારતની અગ્રણી હોસ્પિટલો સાથે સીધું જોડાણ",

    featuresBadge: "ઝીરો સબ્સ્ક્રિપ્શન સેવાઓ",
    featuresTitle: "ઘરે બેઠા સંપૂર્ણ હોસ્પિટલ સેવાઓ મેળવો",
    featuresSub: "દર્દીઓ માટે ઘરેથી સરળતાથી એડમિશન લેવા, ડોક્ટર સલાહ મેળવવા અને ઓનલાઇન બિલ ચૂકવવા માટે ખાસ ડિઝાઇન કરેલ.",
    catAll: "તમામ સેવાઓ",
    catClinical: "ઘરેથી બેડ અને OPD બુકિંગ",
    catDiagnostics: "ઘરે લેબ સેમ્પલ કલેક્શન",
    catOps: "દવાઓની હોમ ડિલિવરી",
    catAdmin: "UPI અને ઓનલાઇન બિલ પેમેન્ટ",

    modulesTitle: "મુખ્ય આરોગ્ય સેવાઓ",
    modulesSub: "દર્દીઓ માટે ઘરેથી અને હોસ્પિટલ સ્ટાફ માટે ૨૪ કલાક ઉપલબ્ધ.",
    ipdTitle: "ઓનલાઇન દર્દી એડમિશન બુકિંગ",
    ipdDesc: "ઘરે બેઠા જ ICU અને જનરલ બેડની જગ્યા જુઓ અને એડમિશન મેળવો.",
    opdTitle: "ઘરેથી OPD બુકિંગ",
    opdDesc: "ડોક્ટરનો લાઇન નંબર ઓનલાઇન બુક કરો અને હોસ્પિટલમાં રાહ જોવાથી બચો.",
    erTitle: "૨૪/૭ ઇમરજન્સી એમ્બ્યુલન્સ",
    erDesc: "જીપીએસ ટ્રેકિંગ સાથે તાત્કાલિક એમ્બ્યુલન્સ ઘરે બોલાવો.",
    ambTitle: "દવાઓની હોમ ડિલિવરી",
    ambDesc: "ડોક્ટરના પ્રિસ્ક્રિપ્શન મુજબ દવાઓ ઘરે મેળવો.",
    bloodTitle: "બ્લડ ડોનર શોધો",
    bloodDesc: "ઇમરજન્સીમાં નજીકના લોહી આપનાર વ્યક્તિની વિગત મેળવો.",
    teleTitle: "ઓનલાઇન વીડિયો કન્સલ્ટેશન",
    teleDesc: "ઘરે બેઠા જ નિષ્ણાત ડોક્ટર સાથે વીડિયો કોલ પર સલાહ લો.",
    otTitle: "ઓપરેશન અને સર્જરી બુકિંગ",
    otDesc: "પ્લાન્ડ સર્જરી અને ઓપરેશનની તારીખ ઘરેથી નક્કી કરો.",
    pacsTitle: "ઘરેથી લેબ ટેસ્ટ સેમ્પલિંગ",
    pacsDesc: "લેબ ટેકનિશિયનને લોહીના સેમ્પલ લેવા માટે ઘરે બોલાવો.",

    workflowBadge: "ઘરેથી હોસ્પિટલ પ્રક્રિયા",
    workflowTitle: "ઘરેથી જ દર્દીને એડમિટ કરવાની સરળ રીત",
    workflowSub: "ઘરે બુકિંગથી લઈને સંપૂર્ણ સાજા થવા સુધીના ૬ સરળ તબક્કા.",
    step1: "ઘરે બેઠા ડોક્ટર અને હોસ્પિટલ પસંદ કરો",
    step2: "ઓનલાઇન બેડ અથવા OPD સમય કન્ફર્મ કરો",
    step3: "માત્ર નાનો સર્વિસ ચાર્જ ચૂકવો",
    step4: "હોસ્પિટલ પહોંચો અથવા વીડિયો કોલ શરૂ કરો",
    step5: "યોગ્ય સારવાર અને લેબ રિપોર્ટ મેળવો",
    step6: "ડિજિટલ ડિસ્ચાર્જ અને ઓનલાઇન બિલ પાવતી",

    roleSuperAdmin: "સુપર એડમિન",
    roleHospAdmin: "હોસ્પિટલ ડાયરેક્ટર",
    roleDoctor: "ડોક્ટર / સર્જન",
    rolePatient: "દર્દી પોર્ટલ",
    roleReception: "રિસેપ્શનિસ્ટ (ફ્રન્ટ ડેસ્ક)",
    roleLab: "લેબ પેથોલોજિસ્ટ",
    rolePharmacy: "ફાર્માસિસ્ટ (મેડિકલ)",

    launchPortal: "લાઇવ વર્કસ્પેસ ખોલો",
    viewReport: "રિપોર્ટ જુઓ",
    bookAppointment: "એપોઇન્ટમેન્ટ બુક કરો",
    downloadPdf: "PDF ડાઉનલોડ કરો"
  },

  hi: {
    brandTitle: "मेडिनोवा केयर",
    brandTag: "कोई मासिक शुल्क नहीं - डॉक्टर सिलेक्शन सेवा",
    navFeatures: "मुख्य विशेषताएं",
    navDemo: "लाइव डेमो",
    navWorkflow: "एडमिशन की प्रक्रिया",
    navDoctors: "हमारे डॉक्टर",
    navTrust: "सुरक्षा और ABDM",
    signIn: "अस्पताल लॉगिन",
    startTrial: "घर बैठे मरीज एडमिट करें",
    admitHome: "घर बैठे मरीज एडमिट करें",

    heroBadge: "कोई मासिक सब्सक्रिप्शन शुल्क नहीं — पसंदीदा डॉक्टर चुनें और सेवा बुक करें",
    heroTitle1: "अपनी सुविधा से डॉक्टर चुनें",
    heroTitle2: "और घर बैठे मरीज एडमिट करें",
    heroSub: "मरीज घर बैठे ही अपनी सुविधा अनुसार डॉक्टर चुन सकते हैं, ओपीडी टोकन बुक कर सकते हैं, अस्पताल में बेड देख सकते हैं और कम सर्विस चार्ज में एडमिशन प्राप्त कर सकते हैं।",
    ctaTrial: "घर बैठे मरीज एडमिट करें",
    ctaDemo: "बेड की उपलब्धता जांचें",
    trustHipa: "कोई मासिक सब्सक्रिप्शन शुल्क नहीं",
    trustSetup: "केवल बुकिंग के समय छोटा सर्विस चार्ज",
    trustSupport: "24/7 मरीज सहायता सेवा",

    statHospitals: "500+ अस्पताल जुड़े हुए",
    statDoctors: "12,000+ अनुभवी डॉक्टर",
    statPatients: "45 लाख+ सेवा प्राप्त मरीज",
    statAppointments: "1.8 करोड़+ सफल बुकिंग",
    statHospitalsDesc: "गुजरात, महाराष्ट्र और पूरे भारत में फैला नेटवर्क",
    statDoctorsDesc: "होम विजिट और ओपीडी के लिए उपलब्ध",
    statPatientsDesc: "डिजिटल हेल्थ रिकॉर्ड और रिपोर्ट",
    statAppointmentsDesc: "तुरंत बुकिंग कन्फर्मेशन",

    trustedHeading: "भारत के प्रमुख अस्पतालों के साथ सीधा जुड़ाव",

    featuresBadge: "जीरो सब्सक्रिप्शन सेवाएं",
    featuresTitle: "घर बैठे संपूर्ण अस्पताल सेवाएं प्राप्त करें",
    featuresSub: "मरीजों के लिए घर से आसानी से एडमिशन लेने, डॉक्टर से सलाह लेने और ऑनलाइन बिल भुगतान के लिए विशेष रूप से डिज़ाइन किया गया।",
    catAll: "सभी सेवाएं",
    catClinical: "घर से बेड और OPD बुकिंग",
    catDiagnostics: "घर पर लैब सैंपल कलेक्शन",
    catOps: "दवाइयों की होम डिलीवरी",
    catAdmin: "UPI और ऑनलाइन बिल भुगतान",

    modulesTitle: "मुख्य स्वास्थ्य सेवाएं",
    modulesSub: "मरीजों के लिए घर से और अस्पताल कर्मचारियों के लिए 24 घंटे उपलब्ध।",
    ipdTitle: "ऑनलाइन मरीज एडमिशन बुकिंग",
    ipdDesc: "घर बैठे ही ICU और जनरल बेड की स्थिति देखें और एडमिशन लें।",
    opdTitle: "घर से OPD बुकिंग",
    opdDesc: "डॉक्टर का लाइन नंबर ऑनलाइन बुक करें और अस्पताल में इंतजार से बचें।",
    erTitle: "24/7 इमरजेंसी एम्बुलेंस",
    erDesc: "जीपीएस ट्रैकिंग के साथ तुरंत एम्बुलेंस घर बुलाएं।",
    ambTitle: "दवाइयों की होम डिलीवरी",
    ambDesc: "डॉक्टर के पर्चे के अनुसार दवाइयां घर पर प्राप्त करें।",
    bloodTitle: "ब्लड डोनर खोजें",
    bloodDesc: "इमरजेंसी में नजदीकी रक्तदाता की जानकारी प्राप्त करें।",
    teleTitle: "ऑनलाइन वीडियो परामर्श",
    teleDesc: "घर बैठे ही विशेषज्ञ डॉक्टर से वीडियो कॉल पर सलाह लें।",
    otTitle: "ऑपरेशन और सर्जरी बुकिंग",
    otDesc: "सर्जरी की तारीख घर से तय करें।",
    pacsTitle: "घर से लैब टेस्ट सैंपलिंग",
    pacsDesc: "लैब तकनीशियन को ब्लड सैंपल लेने के लिए घर बुलाएं।",

    workflowBadge: "घर से अस्पताल प्रक्रिया",
    workflowTitle: "घर से ही मरीज को एडमिट करने का आसान तरीका",
    workflowSub: "घर पर बुकिंग से लेकर पूरी तरह ठीक होने तक 6 आसान चरण।",
    step1: "घर बैठे डॉक्टर और अस्पताल चुनें",
    step2: "ऑनलाइन बेड या OPD समय कन्फर्म करें",
    step3: "केवल छोटा सर्विस चार्ज दें",
    step4: "अस्पताल पहुंचे या वीडियो कॉल शुरू करें",
    step5: "उचित इलाज और लैब रिपोर्ट प्राप्त करें",
    step6: "डिजिटल डिस्चार्ज और ऑनलाइन बिल रसीद",

    roleSuperAdmin: "सुपर एडमिन",
    roleHospAdmin: "अस्पताल निदेशक",
    roleDoctor: "डॉक्टर / सर्जन",
    rolePatient: "मरीज पोर्टल",
    roleReception: "रिसेप्शनिस्ट (फ्रंट डेस्क)",
    roleLab: "लैब पैथोलॉजिस्ट",
    rolePharmacy: "फार्मासिस्ट (मेडिकल)",

    launchPortal: "लाइव वर्कस्पेस खोलें",
    viewReport: "रिपोर्ट देखें",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    downloadPdf: "PDF डाउनलोड करें"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("gu");

  useEffect(() => {
    const saved = localStorage.getItem("medcore-lang") as Language | null;
    if (saved && (saved === "en" || saved === "gu" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("medcore-lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: DICTIONARY[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
