"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Counter from "@/components/ui/Counter";
import { Building2, UserCheck, HeartHandshake, CalendarCheck } from "lucide-react";

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Building2,
      value: 520,
      suffix: "+",
      label: t.statHospitals,
      desc: t.statHospitalsDesc,
      color: "text-[#4A1F2B] dark:text-[#E2838E]",
      bg: "bg-[#F3E9EB] dark:bg-[#32293D]"
    },
    {
      icon: UserCheck,
      value: 12000,
      suffix: "+",
      label: t.statDoctors,
      desc: t.statDoctorsDesc,
      color: "text-[#3F6B52] dark:text-[#85B599]",
      bg: "bg-[#E8F0EC] dark:bg-[#23382B]"
    },
    {
      icon: HeartHandshake,
      value: 4.5,
      decimals: 1,
      suffix: "M+",
      label: t.statPatients,
      desc: t.statPatientsDesc,
      color: "text-[#83505B] dark:text-[#D5AAB4]",
      bg: "bg-[#F7EDEF] dark:bg-[#382830]"
    },
    {
      icon: CalendarCheck,
      value: 18.2,
      decimals: 1,
      suffix: "M+",
      label: t.statAppointments,
      desc: t.statAppointmentsDesc,
      color: "text-[#3E6177] dark:text-[#97B8CC]",
      bg: "bg-[#EAF0F4] dark:bg-[#25323B]"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-white dark:bg-[#242026] border border-[#E5E0E2] dark:border-[#3E3842] shadow-[0_1px_3px_rgba(41,39,39,0.06)] hover:shadow-[0_4px_16px_rgba(41,39,39,0.08)] transition-all"
              >
                <div className={`w-10 h-10 rounded-md ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold font-sans text-[#292727] dark:text-[#FEF8F7]">
                  <Counter end={item.value} suffix={item.suffix} decimals={item.decimals} />
                </div>
                <div className="text-sm font-semibold text-[#292727] dark:text-[#ECE5E7] mt-1">
                  {item.label}
                </div>
                <div className="text-xs text-[#686563] dark:text-[#9B8E92] mt-0.5">
                  {item.desc}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
