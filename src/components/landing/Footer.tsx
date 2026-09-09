"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Cross, MapPin, Mail, Phone, ChevronRight, Globe, Share2, MessageCircle, Send } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1D2A4D] text-slate-300 pt-16 pb-12 text-xs border-t-4 border-[#13C5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Footer Top 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Get In Touch */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase text-white pb-2 border-b-4 border-[#13C5DD] inline-block tracking-wider">
              GET IN TOUCH
            </h4>
            <p className="text-slate-400 leading-relaxed">
              ભારતની હોસ્પિટલો અને દર્દીઓ માટે ઘરેથી એડમિશન અને એપોઇન્ટમેન્ટ બુક કરવાની સેવા.
            </p>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#13C5DD] shrink-0" />
                <span>એસજી હાઇવે, અમદાવાદ, ગુજરાત - ૩૮૦૦૫૪</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#13C5DD] shrink-0" />
                <span>support@medcore.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#13C5DD] shrink-0" />
                <span className="font-bold text-white">+91 1800-MEDCORE (6332673)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase text-white pb-2 border-b-4 border-[#13C5DD] inline-block tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-slate-400 font-bold uppercase">
              <li>
                <a href="#" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> Home
                </a>
              </li>
              <li>
                <a href="#features" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> Our Services
                </a>
              </li>
              <li>
                <a href="#pricing" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase text-white pb-2 border-b-4 border-[#13C5DD] inline-block tracking-wider">
              POPULAR SERVICES
            </h4>
            <ul className="space-y-2 text-slate-400 font-bold uppercase">
              <li>
                <a href="#features" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> OPD Token Booking (₹49)
                </a>
              </li>
              <li>
                <a href="#features" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> IPD Bed Admission (₹199)
                </a>
              </li>
              <li>
                <a href="#features" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> Home Lab Sample Collection
                </a>
              </li>
              <li>
                <a href="#features" className="flex items-center gap-1.5 hover:text-[#13C5DD] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#13C5DD]" /> 24/7 Emergency Ambulance
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase text-white pb-2 border-b-4 border-[#13C5DD] inline-block tracking-wider">
              FOLLOW US
            </h4>
            <p className="text-slate-400 leading-relaxed">
              અમારી સાથે સોશિયલ મીડિયા પર જોડાઓ અને હેલ્થ ટિપ્સ મેળવો.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 text-[#13C5DD] flex items-center justify-center hover:bg-[#13C5DD] hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 text-[#13C5DD] flex items-center justify-center hover:bg-[#13C5DD] hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 text-[#13C5DD] flex items-center justify-center hover:bg-[#13C5DD] hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 text-[#13C5DD] flex items-center justify-center hover:bg-[#13C5DD] hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-4">
          <div>
            © {new Date().getFullYear()} <span className="text-white font-bold">MEDINNOVA CARE</span>. All Rights Reserved. Designed for Indian Hospitals.
          </div>
          <div className="flex items-center gap-4 uppercase font-bold">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">FAQs</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
