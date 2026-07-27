import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import { AuthShell } from "@/components/auth-shell";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midnight Admin Panel",
  description: "پنل مدیریت Midnight Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className={`${vazirmatn.className} antialiased`}>
        <AuthShell>{children}</AuthShell>
      </body>
    </html>
  );
}
