"use client";

import React, { createContext, useContext, useState } from "react";

export type RoleType = 
  | "super_admin" 
  | "hospital_admin" 
  | "doctor" 
  | "patient" 
  | "reception" 
  | "lab" 
  | "pharmacy";

interface RoleMeta {
  id: RoleType;
  name: string;
  badge: string;
  description: string;
  avatar: string;
}

export const ROLES: Record<RoleType, RoleMeta> = {
  super_admin: {
    id: "super_admin",
    name: "Super Admin",
    badge: "Enterprise HQ",
    description: "Multi-tenant telemetry, SaaS licensing & security policy center",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  hospital_admin: {
    id: "hospital_admin",
    name: "Hospital Admin",
    badge: "Metro Health Main",
    description: "Bed occupancy, department billing, staff roster & hospital ROI",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
  },
  doctor: {
    id: "doctor",
    name: "Dr. Sarah Jenkins (Cardiology)",
    badge: "Attending Physician",
    description: "OPD consultation queue, EHR vitals, electronic prescriptions",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
  },
  patient: {
    id: "patient",
    name: "Alexander Vance",
    badge: "Patient ID #88492",
    description: "Personal health passport, lab reports, instant appointment booking",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  reception: {
    id: "reception",
    name: "Elena Rostova",
    badge: "Front Desk & Triage",
    description: "Express check-in counter, token generation & emergency intake",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  },
  lab: {
    id: "lab",
    name: "David Chen",
    badge: "Senior Pathologist",
    description: "Blood test queue, radiology imaging upload & critical alert sign-off",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
  },
  pharmacy: {
    id: "pharmacy",
    name: "Maria Santos",
    badge: "Lead Pharmacist",
    description: "E-prescription queue, inventory auto-reorder & billing POS",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=150"
  }
};

interface PortalContextType {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "signup" | "forgot";
  setAuthModalMode: (mode: "login" | "signup" | "forgot") => void;
  isDemoVideoOpen: boolean;
  setIsDemoVideoOpen: (open: boolean) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: "login" | "signup" | "forgot") => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleType>("hospital_admin");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "forgot">("login");
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const openAuthModal = (mode: "login" | "signup" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <PortalContext.Provider
      value={{
        activeRole,
        setActiveRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isDemoVideoOpen,
        setIsDemoVideoOpen,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        openAuthModal
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
