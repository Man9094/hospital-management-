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
      color: "text-[#0F6CBD]",
      bg: "bg-[#0F6CBD]/10"
    },
    {
      icon: UserCheck,
      value: 12000,
      suffix: "+",
      label: t.statDoctors,
      desc: t.statDoctorsDesc,
      color: "text-[#00C896]",
      bg: "bg-[#00C896]/10"
    },
    {
      icon: HeartHandshake,
      value: 4.5,
      decimals: 1,
      suffix: "M+",
      label: t.statPatients,
      desc: t.statPatientsDesc,
      color: "text-[#4CC9F0]",
      bg: "bg-[#4CC9F0]/10"
    },
    {
      icon: CalendarCheck,
      value: 18.2,
      decimals: 1,
      suffix: "M+",
      label: t.statAppointments,
      desc: t.statAppointmentsDesc,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
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
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold font-poppins text-slate-900 dark:text-white">
                  <Counter end={item.value} suffix={item.suffix} decimals={item.decimals} />
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
