"use client";

import React, { createContext, useContext, useState } from "react";

export type RoleType = 
  | "super_admin" 
  | "hospital_admin" 
  | "doctor" 
  | "nurse"
  | "reception" 
  | "lab" 
  | "radiology"
  | "pharmacist" 
  | "billing"
  | "patient";

export interface RoleMeta {
  id: RoleType;
  name: string;
  badge: string;
  description: string;
  avatar: string;
  email: string;
}

export const ROLES: Record<RoleType, RoleMeta> = {
  super_admin: {
    id: "super_admin",
    name: "Rajesh Kumar",
    badge: "Super Admin",
    description: "Enterprise HQ, multi-hospital governance & security policies",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    email: "superadmin@medcore.in"
  },
  hospital_admin: {
    id: "hospital_admin",
    name: "Priya Sharma",
    badge: "Hospital Administrator",
    description: "Bed occupancy, departmental performance, billing & operational analytics",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    email: "admin@medcore.in"
  },
  doctor: {
    id: "doctor",
    name: "Dr. Rajesh Patel",
    badge: "Senior Consultant (MD)",
    description: "OPD queue, Clinical EMR, SOAP notes, e-prescriptions & diagnostics",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
    email: "doctor@medcore.in"
  },
  nurse: {
    id: "nurse",
    name: "Sister Anjali Nair",
    badge: "Nursing Station Lead",
    description: "Inpatient vitals, medication administration, IV logs & handover charts",
    avatar: "https://images.unsplash.com/photo-1594824813576-9c4c7f39446f?auto=format&fit=crop&q=80&w=150",
    email: "nurse@medcore.in"
  },
  reception: {
    id: "reception",
    name: "Elena Rostova",
    badge: "Front Desk & OPD",
    description: "Patient registration, UHID generation, token dispenser & appointments",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
    email: "reception@medcore.in"
  },
  lab: {
    id: "lab",
    name: "David Chen",
    badge: "Senior Pathologist (LIS)",
    description: "Sample barcodes, result validation, reference ranges & verified reports",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150",
    email: "lab@medcore.in"
  },
  radiology: {
    id: "radiology",
    name: "Dr. Alpa Bhatt",
    badge: "Radiologist (RIS)",
    description: "X-Ray, CT, MRI imaging study reviews and PACS reporting",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150",
    email: "radiology@medcore.in"
  },
  pharmacist: {
    id: "pharmacist",
    name: "Maria Santos",
    badge: "Chief Pharmacist",
    description: "Prescription dispensing, FEFO batch tracking & inventory management",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=150",
    email: "pharmacy@medcore.in"
  },
  billing: {
    id: "billing",
    name: "Ketan Trivedi",
    badge: "Billing & TPA Claims",
    description: "Itemized GST billing, cash/UPI receipts & PM-JAY/TPA cashless processing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    email: "billing@medcore.in"
  },
  patient: {
    id: "patient",
    name: "Alexander Vance",
    badge: "Patient (MC-2026-000106)",
    description: "Personal health passport, lab reports, e-prescriptions & invoice receipts",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    email: "patient@medcore.in"
  }
};

interface PortalContextType {
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  selectedUhid: string | null;
  setSelectedUhid: (uhid: string | null) => void;
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
  const [selectedUhid, setSelectedUhid] = useState<string | null>(null);
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
        selectedUhid,
        setSelectedUhid,
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
