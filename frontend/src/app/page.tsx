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
    <div className="relative min-h-screen selection:bg-[#F3E9EB] selection:text-[#4A1F2B] bg-[#F7F6F3] dark:bg-[#18141C] text-[#292727] dark:text-[#FEF8F7]">
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
