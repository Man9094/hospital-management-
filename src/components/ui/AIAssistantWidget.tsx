"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import PatientAdmissionModal from "@/components/modals/PatientAdmissionModal";
import {
  Bot,
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Bed,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  FileText,
  Pill,
  Heart,
  HelpCircle,
  Activity,
  Baby,
  ActivitySquare,
  Bone,
  Eye,
  Scissors
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  time: string;
  actionButton?: { label: string; action: "admit" | "call" | "opd" };
  suggestions?: string[];
}

interface PatientProblemCategory {
  id: string;
  icon: any;
  titleGu: string;
  titleHi: string;
  titleEn: string;
  doctorGu: string;
  doctorHi: string;
  doctorEn: string;
  fee: string;
  actionType: "opd" | "admit" | "call";
  detailsGu: string;
  detailsHi: string;
  detailsEn: string;
}

const PATIENT_PROBLEMS: PatientProblemCategory[] = [
  {
    id: "fever",
    icon: Activity,
    titleGu: "🤒 તાવ, શરદી, માથું દુખવું",
    titleHi: "🤒 बुखार, सर्दी, सिरदर्द",
    titleEn: "🤒 Fever, Cold, Flu & Headache",
    doctorGu: "જનરલ ફિઝિશિયન (MD Physician)",
    doctorHi: "जनरल फिजिशियन (MD Physician)",
    doctorEn: "General Physician (MD Physician)",
    fee: "₹49 (OPD ટોકન)",
    actionType: "opd",
    detailsGu: "તાવ અથવા શરદી માટે જનરલ ફિઝિશિયન ડોક્ટરની સલાહ લો. CBC લોહીની તપાસ કરાવી હિતાવહ છે.",
    detailsHi: "बुखार या सर्दी के लिए जनरल फिजिशियन से सलाह लें। CBC ब्लड टेस्ट करवाना उचित होगा।",
    detailsEn: "Consult a General Physician for fever or flu. CBC blood test is recommended."
  },
  {
    id: "heart",
    icon: Heart,
    titleGu: "❤️ છાતીમાં દુખાવો, બીપી, હૃદયની તકલીફ",
    titleHi: "❤️ सीने में दर्द, बीपी, दिल की समस्या",
    titleEn: "❤️ Chest Pain, High BP, Heart Issue",
    doctorGu: "હૃદય રોગ નિષ્ણાત (Cardiologist)",
    doctorHi: "हृदय रोग विशेषज्ञ (Cardiologist)",
    doctorEn: "Cardiologist (Heart Specialist)",
    fee: "ઈમરજન્સી / ICU બેડ",
    actionType: "call",
    detailsGu: "🚨 ગંભીર છાતીના દુખાવા માટે તાત્કાલિક ECG અને ઇમરજન્સી કાર્ડિયાક ICU એડમિશન જરૂરી છે.",
    detailsHi: "🚨 गंभीर सीने के दर्द के लिए तुरंत ECG और इमरजेंसी कार्डियक ICU एडमिशन आवश्यक है।",
    detailsEn: "🚨 Urgent ECG and ICU cardiac admission required for acute chest pain."
  },
  {
    id: "bone",
    icon: Bone,
    titleGu: "🦴 હાડકાનો દુખાવો, સાંધા, ફ્રેક્ચર",
    titleHi: "🦴 हड्डी का दर्द, जोड़ों का दर्द, फ्रैक्चर",
    titleEn: "🦴 Bone Fracture, Joint & Back Pain",
    doctorGu: "હાડકાના ડોક્ટર (Orthopedic Surgeon)",
    doctorHi: "हड्डी रोग विशेषज्ञ (Orthopedic Surgeon)",
    doctorEn: "Orthopedic Surgeon (Bone Specialist)",
    fee: "₹49 OPD + X-Ray",
    actionType: "opd",
    detailsGu: "ફ્રેક્ચર કે સાંધાના દુખાવા માટે ડીજીટલ એક્સ-રે અને ઓર્થોપેડિક ડોક્ટરની મુલાકાત લો.",
    detailsHi: "फ्रैक्चर या जोड़ों के दर्द के लिए डिजिटल एक्स-रे और ऑर्थोपेडिक डॉक्टर से मिलें।",
    detailsEn: "Digital X-Ray and Orthopedic Surgeon checkup required for bone fractures."
  },
  {
    id: "child",
    icon: Baby,
    titleGu: "👶 બાળક / શિશુની બીમારી, ઝાડા-ઉલટી",
    titleHi: "👶 बच्चे की बीमारी, दस्त-उल्टी, टीकाकरण",
    titleEn: "👶 Child Illness, Vomiting & Vaccination",
    doctorGu: "બાળ રોગ નિષ્ણાત (Pediatrician)",
    doctorHi: "बाल रोग विशेषज्ञ (Pediatrician)",
    doctorEn: "Pediatrician (Child Specialist)",
    fee: "₹49 (OPD ટોકન)",
    actionType: "opd",
    detailsGu: "નાના બાળકોના તાવ, ઝાડા કે રસીકરણ માટે ચાઇલ્ડ સ્પેશિયાલિસ્ટ ડોક્ટરની સલાહ લો.",
    detailsHi: "छोटे बच्चों के बुखार, दस्त या टीकाकरण के लिए चाइल्ड स्पेशलिस्ट डॉक्टर से सलाह लें।",
    detailsEn: "Consult a Pediatrician for child fever, vomiting, or routine vaccinations."
  },
  {
    id: "maternity",
    icon: Heart,
    titleGu: "🤰 ગર્ભાવસ્થા, સ્ત્રી રોગ (Maternity)",
    titleHi: "🤰 गर्भावस्था, स्त्री रोग (Maternity)",
    titleEn: "🤰 Pregnancy & Women's Health",
    doctorGu: "સ્ત્રી રોગ નિષ્ણાત (Gynecologist)",
    doctorHi: "स्त्री रोग विशेषज्ञ (Gynecologist)",
    doctorEn: "Gynecologist & Obstetrician",
    fee: "₹49 OPD + Sonography",
    actionType: "opd",
    detailsGu: "ગર્ભાવસ્થાની તપાસ અને સોનોગ્રાફી માટે ગાયનેકોલોજિસ્ટ ડોક્ટરની એપોઇન્ટમેન્ટ બુક કરો.",
    detailsHi: "गर्भावस्था की जांच और सोनोग्राफी के लिए गायनेकोलॉजिस्ट डॉक्टर की अपॉइंटमेंट लें।",
    detailsEn: "Book Gynecologist consultation for pregnancy checkup and ultrasound sonography."
  },
  {
    id: "labtest",
    icon: FileText,
    titleGu: "🧪 લોહીની તપાસ, શુગર, લેબ રિપોર્ટ",
    titleHi: "🧪 ब्लड टेस्ट, शुगर जांच, लैब रिपोर्ट",
    titleEn: "🧪 Blood Test, Sugar, Lab Diagnostics",
    doctorGu: "પેથોલોજી લેબ (Home Collection)",
    doctorHi: "पैथोलॉजी लैब (Home Collection)",
    doctorEn: "Pathology Lab (Home Collection)",
    fee: "₹29 (રિપોર્ટ સેવા)",
    actionType: "opd",
    detailsGu: "ઘરે બેઠા જ લોહીના સેમ્પલ લેવા માટે લેબ ટેકનિશિયન બોલાવો. રિપોર્ટ વોટ્સએપ પર મળશે.",
    detailsHi: "घर बैठे ब्लड सैंपल देने के लिए लैब तकनीशियन बुलाएं। रिपोर्ट व्हाट्सएप पर मिलेगी।",
    detailsEn: "Schedule home blood sample collection. PDF reports delivered via WhatsApp."
  },
  {
    id: "admission",
    icon: Bed,
    titleGu: "🛏️ ગંભીર બીમારી / હોસ્પિટલ એડમિશન",
    titleHi: "🛏️ गंभीर बीमारी / अस्पताल एडमिशन",
    titleEn: "🛏️ Critical Hospital Bed Admission",
    doctorGu: "IPD જનરલ અને ICU વોર્ડ",
    doctorHi: "IPD जनरल और ICU वार्ड",
    doctorEn: "IPD General & ICU Ward Beds",
    fee: "₹199 (બેડ એડમિશન)",
    actionType: "admit",
    detailsGu: "ગંભીર દર્દીઓ માટે હોસ્પિટલમાં ICU અથવા જનરલ વોર્ડમાં બેડ કન્ફર્મ કરી એડમિટ કરો.",
    detailsHi: "गंभीर मरीजों के लिए अस्पताल में ICU या जनरल वार्ड में बेड बुक करके एडमिट करें।",
    detailsEn: "Confirm ICU or General ward bed admission for critically ill patients."
  }
];

export default function AIAssistantWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"problems" | "chat" | "voice">("problems");
  const [inputQuery, setInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialText =
    language === "gu"
      ? "નમસ્તે! નીચે દર્દીની તકલીફ પસંદ કરો અથવા તમારો પ્રશ્ન લખો. હું તમને યોગ્ય ડોક્ટર, લેબ ટેસ્ટ અને સર્વિસ ચાર્જની સચોટ માહિતી આપીશ."
      : language === "hi"
      ? "नमस्ते! नीचे मरीज की समस्या चुनें या अपना प्रश्न लिखें। मैं आपको सही डॉक्टर, लैब टेस्ट और फीस की सटीक जानकारी दूंगा।"
      : "Hello! Select the patient symptom/problem below or type your question. I will recommend the right doctor specialty, lab tests, and fees.";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: initialText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionButton: { label: language === "gu" ? "ઘરેથી દર્દી એડમિટ કરો" : "Admit Patient From Home", action: "admit" }
    }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech Recognition (Voice Input)
  const toggleListening = () => {
    if (!speechSupported) {
      alert("Voice input is not supported on this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Text-To-Speech (AI Voice Output)
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSelectProblem = (prob: PatientProblemCategory) => {
    setActiveTab("chat");
    const userTitle = language === "gu" ? prob.titleGu : language === "hi" ? prob.titleHi : prob.titleEn;
    const doctorName = language === "gu" ? prob.doctorGu : language === "hi" ? prob.doctorHi : prob.doctorEn;
    const details = language === "gu" ? prob.detailsGu : language === "hi" ? prob.detailsHi : prob.detailsEn;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userTitle,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const replyText =
      language === "gu"
        ? `🏥 **સૂચવેલ ડોક્ટર વિભાગ:** ${doctorName}\n💰 **સર્વિસ ચાર્જ:** ${prob.fee}\n\n📋 **સલાહ:** ${details}`
        : language === "hi"
        ? `🏥 **सुझाए गए डॉक्टर:** ${doctorName}\n💰 **सर्विस चार्ज:** ${prob.fee}\n\n📋 **सलाह:** ${details}`
        : `🏥 **Recommended Specialty:** ${doctorName}\n💰 **Service Fee:** ${prob.fee}\n\n📋 **Clinical Guidance:** ${details}`;

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionButton: {
        label: prob.actionType === "call" ? "ઇમરજન્સી કૉલ કરો" : prob.actionType === "admit" ? "બેડ એડમિટ કરો (₹199)" : "OPD ટોકન બુક કરો (₹49)",
        action: prob.actionType
      }
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    speakText(details);
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputQuery;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    setTimeout(() => {
      const replyText =
        language === "gu"
          ? "તમારા પ્રશ્ન માટે આભાર. જનરલ ફિઝિશિયન અથવા તબીબી નિષ્ણાતની સલાહ માટે નીચે આપેલા બટન પરથી OPD ટોકન કે બેડ બુક કરી શકો છો."
          : language === "hi"
          ? "आपके प्रश्न के लिए धन्यवाद। डॉक्टर परामर्श के लिए नीचे बटन से ओपीडी टोकन या बेड बुक कर सकते हैं।"
          : "Thank you. For medical consultation or bed admission, use the direct buttons below.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionButton: { label: language === "gu" ? "ઘરેથી દર્દી એડમિટ કરો" : "Admit Patient Now", action: "admit" }
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(replyText);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 px-4 py-3.5 rounded-full bg-[#13C5DD] text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl border-2 border-white"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">AI દર્દી સહાયક</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C896] animate-ping" />
        </motion.button>
      </div>

      {/* Main Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#1D2A4D] text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#13C5DD] text-white flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-extrabold font-poppins flex items-center gap-1.5">
                    મેડકોર AI ક્લિનિકલ ગાઇડ <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </div>
                  <div className="text-[10px] text-[#13C5DD] font-bold">
                    દર્દીની તકલીફ મુજબ સચોટ ડોક્ટર સલાહ
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    title="Stop Voice"
                  >
                    <VolumeX className="w-4 h-4 animate-bounce" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3 Tabs: Problems Guide, Chat, Voice */}
            <div className="grid grid-cols-3 p-1.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-center">
              <button
                onClick={() => setActiveTab("problems")}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeTab === "problems"
                    ? "bg-[#13C5DD] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" /> તકલીફ પસંદ કરો
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeTab === "chat"
                    ? "bg-[#13C5DD] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> ચેટ (Chat)
              </button>
              <button
                onClick={() => setActiveTab("voice")}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  activeTab === "voice"
                    ? "bg-[#13C5DD] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Mic className="w-3.5 h-3.5" /> વોઇસ વાતચીત
              </button>
            </div>

            {/* Tab 1: Patient Problems Selector */}
            {activeTab === "problems" && (
              <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-50 dark:bg-slate-900/40">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  તમારે કયા પ્રકારની સ્વાસ્થ્ય તકલીફ છે? (Select Patient Requirement)
                </div>
                {PATIENT_PROBLEMS.map((prob) => {
                  const Icon = prob.icon;
                  const title = language === "gu" ? prob.titleGu : language === "hi" ? prob.titleHi : prob.titleEn;
                  const doctor = language === "gu" ? prob.doctorGu : language === "hi" ? prob.doctorHi : prob.doctorEn;

                  return (
                    <button
                      key={prob.id}
                      onClick={() => handleSelectProblem(prob)}
                      className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#13C5DD] hover:shadow-md text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#13C5DD]/10 text-[#13C5DD] flex items-center justify-center font-bold">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#13C5DD]">
                            {title}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            સૂચવેલ: <strong className="text-slate-700 dark:text-slate-300">{doctor}</strong>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#00C896]/15 text-[#00C896]">
                        {prob.fee}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Chat View */}
            {activeTab === "chat" && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/40">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#13C5DD] text-white rounded-br-none shadow-md font-medium"
                          : "bg-white dark:bg-[#1D2A4D] text-[#1D2A4D] dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm font-medium whitespace-pre-line"
                      }`}
                    >
                      {msg.text}

                      {msg.actionButton && (
                        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              if (msg.actionButton?.action === "call") {
                                window.location.href = "tel:+9118006332673";
                              } else {
                                setIsAdmissionModalOpen(true);
                              }
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-[#00C896] hover:bg-[#00a87d] text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Bed className="w-3.5 h-3.5" />
                            {msg.actionButton.label}
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Tab 3: Voice View */}
            {activeTab === "voice" && (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50 dark:bg-slate-900/60">
                <button
                  onClick={toggleListening}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-transform ${
                    isListening
                      ? "bg-red-500 text-white scale-110 animate-pulse border-4 border-red-300"
                      : "bg-[#13C5DD] text-white hover:scale-105"
                  }`}
                >
                  {isListening ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10" />}
                </button>
                <div>
                  <h4 className="text-base font-extrabold text-[#1D2A4D] dark:text-white">
                    {isListening ? "સાંભળી રહ્યું છે... બોલો" : "બોલવા માટે માઇક પર ક્લિક કરો"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    તમે તાવ, છાતીમાં દુખાવો, એડમિશન કે લેબ ટેસ્ટ વિશે બોલી શકો છો.
                  </p>
                </div>
              </div>
            )}

            {/* Input Box Footer */}
            {activeTab === "chat" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white dark:bg-[#1D2A4D] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="તમારો પ્રશ્ન લખો (તાવ, ફ્રેક્ચર, એડમિશન)..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#13C5DD]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#13C5DD] hover:bg-[#10b1c7] text-white font-bold shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      <PatientAdmissionModal isOpen={isAdmissionModalOpen} onClose={() => setIsAdmissionModalOpen(false)} />
    </>
  );
}
