"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ModulesGrid from "@/components/landing/ModulesGrid";
import WorkflowJourney from "@/components/landing/WorkflowJourney";
import SecuritySection from "@/components/landing/SecuritySection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/modals/AuthModal";
import DemoVideoModal from "@/components/modals/DemoVideoModal";
import AIAssistantWidget from "@/components/ui/AIAssistantWidget";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen selection:bg-[#13C5DD] selection:text-[#1D2A4D] bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <ModulesGrid />
        <WorkflowJourney />
        <SecuritySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />

      {/* Global Interactive Modals */}
      <AuthModal />
      <DemoVideoModal />
      <AIAssistantWidget />
    </div>
  );
}
