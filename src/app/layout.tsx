import type { Metadata } from "next";
import { Poppins, Inter, Mukta, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { PortalProvider } from "@/context/PortalContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

const sourceSans = Source_Sans_3({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mukta = Mukta({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedCore HMS | સરળ ભારતીય હોસ્પિટલ મેનેજમેન્ટ સોફ્ટવેર | Indian Hospital OS",
  description:
    "ભારતની હોસ્પિટલો અને ક્લિનિક્સ માટે સૌથી સરળ અને વિશ્વાસપાત્ર સોફ્ટવેર. OPD ટોકન, IPD બેડ, EHR દર્દી રેકોર્ડ, ફાર્મસી અને જીએસટી બિલિંગ.",
  keywords: [
    "Hospital Management System India",
    "ગુજરાતી હોસ્પિટલ સોફ્ટવેર",
    "અસ્પતાલ પ્રબંધન સોફ્ટવેર",
    "OPD IPD Billing Software",
    "NABH ABDM Compliant Software",
    "MedCore HMS"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="gu" className={`${sourceSans.variable} ${poppins.variable} ${inter.variable} ${mukta.variable} antialiased`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-[#F7F6F3] text-[#292727] transition-colors duration-300 flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PortalProvider>
                {children}
              </PortalProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
