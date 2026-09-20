"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "મેડકોર સિસ્ટમ દ્વારા અમારી હોસ્પિટલમાં ઓપીડી લાઇન અને બેડ મેનેજમેન્ટ ખૂબ જ સરળ બની ગયું છે. ઘરેથી જ દર્દી બુકિંગ કરી શકે છે અને લેબ રિપોર્ટ ઓનલાઇન મળી જાય છે.",
    author: "ડો. રાજેશ પટેલ",
    role: "મુખ્ય મેડિકલ ઓફિસર",
    hospital: "સ્ટર્લિંગ મલ્ટીસ્પેસિઆલિટી હોસ્પિટલ, રાજકોટ",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    highlight: "૩૪% ઝડપી એડમિશન"
  },
  {
    quote:
      "અમારા પેશન્ટ્સ ઘરેથી જ કન્સલ્ટેશન ટોકન બુક કરે છે. હોસ્પિટલના વેટિંગ રૂમમાં ભીડ ઓછી થઈ ગઈ છે અને વોટ્સએપ પર જ પીડીએફ બિલ અને દવાઓ મળી જાય છે.",
    author: "ડો. સ્નેહા શાહ",
    role: "કાડિઓલોજી સ્પેશિયાલિસ્ટ",
    hospital: "સાલ હોસ્પિટલ, અમદાવાદ",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    highlight: "૪.૯/૫ દર્દી રેટિંગ"
  }
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((curr) => (curr === 0 ? TESTIMONIALS.length - 1 : curr - 1));
  const next = () => setActive((curr) => (curr === TESTIMONIALS.length - 1 ? 0 : curr + 1));

  const current = TESTIMONIALS[active];

  return (
    <section className="py-20 bg-[#FBF9F9] dark:bg-[#18141C]/60 border-y border-[#E5E0E2] dark:border-[#3E3842]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div>
            <span className="text-xs font-bold text-[#4A1F2B] dark:text-[#E2838E] uppercase tracking-wider">
              TESTIMONIALS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7] uppercase">
            PATIENTS & DOCTORS FEEDBACK
          </h2>
        </div>

        {/* Carousel Box */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_4px_16px_rgba(41,39,39,0.08)] relative">
            <div className="w-14 h-14 mx-auto mb-6 rounded-md bg-[#F3E9EB] text-[#4A1F2B] dark:bg-[#32293D] dark:text-[#E2838E] flex items-center justify-center shadow-xs">
              <Quote className="w-7 h-7 fill-current" />
            </div>

            <p className="text-base sm:text-lg text-[#292727] dark:text-[#ECE5E7] font-normal leading-relaxed mb-6 italic">
              "{current.quote}"
            </p>

            <div className="flex items-center justify-center gap-1 mb-4 text-amber-500">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            <div className="space-y-1">
              <div className="font-bold font-sans text-[#292727] dark:text-[#FEF8F7] text-base">
                {current.author}
              </div>
              <div className="text-xs text-[#686563] dark:text-[#9B8E92] font-medium">
                {current.role} • <span className="text-[#4A1F2B] dark:text-[#E2838E] font-semibold">{current.hospital}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={prev}
              className="p-2.5 rounded-md bg-[#4A1F2B] text-white hover:bg-[#5E2737] shadow-xs transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2.5 rounded-md bg-[#4A1F2B] text-white hover:bg-[#5E2737] shadow-xs transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
