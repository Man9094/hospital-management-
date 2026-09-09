"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BedMatrixSection from "@/components/landing/BedMatrixSection";
import DoctorsSection from "@/components/landing/DoctorsSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DashboardPreviewSection from "@/components/landing/DashboardPreviewSection";
import BenefitsPersonaSection from "@/components/landing/BenefitsPersonaSection";
import WorkflowJourney from "@/components/landing/WorkflowJourney";
import ModulesGrid from "@/components/landing/ModulesGrid";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CaseStudiesSection from "@/components/landing/CaseStudiesSection";
import SecuritySection from "@/components/landing/SecuritySection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/modals/AuthModal";
import DemoVideoModal from "@/components/modals/DemoVideoModal";
import AIAssistantWidget from "@/components/ui/AIAssistantWidget";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen selection:bg-[#13C5DD] selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <BedMatrixSection />
        <DoctorsSection />
        <StatsSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <BenefitsPersonaSection />
        <WorkflowJourney />
        <ModulesGrid />
        <TestimonialsSection />
        <CaseStudiesSection />
        <SecuritySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />

      {/* Global Interactive Modals & AI Patient Assistant */}
      <AuthModal />
      <DemoVideoModal />
      <AIAssistantWidget />
    </div>
  );
}
