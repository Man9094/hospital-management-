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
    <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div>
            <span className="medinova-subheading text-xs">
              TESTIMONIALS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-poppins text-[#1D2A4D] dark:text-white uppercase">
            PATIENTS & DOCTORS FEEDBACK
          </h2>
        </div>

        {/* Carousel Box */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1D2A4D] border border-slate-200 dark:border-slate-800 shadow-xl relative">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#13C5DD] text-white flex items-center justify-center shadow-md">
              <Quote className="w-8 h-8 fill-current" />
            </div>

            <p className="text-base sm:text-lg text-[#1D2A4D] dark:text-slate-100 font-medium leading-relaxed mb-6 italic">
              "{current.quote}"
            </p>

            <div className="flex items-center justify-center gap-1 mb-4 text-amber-400">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            <div className="space-y-1">
              <div className="font-extrabold font-poppins text-slate-900 dark:text-white text-base">
                {current.author}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {current.role} • <span className="text-[#13C5DD] font-bold">{current.hospital}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-[#13C5DD] text-white hover:bg-[#10b1c7] shadow-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-3 rounded-full bg-[#13C5DD] text-white hover:bg-[#10b1c7] shadow-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
