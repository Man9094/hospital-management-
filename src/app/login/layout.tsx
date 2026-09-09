import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | MedCore HMS — Hospital Management System",
  description: "Secure login portal for MedCore Hospital Management System. Access your hospital dashboard, patient records, and clinical tools.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
