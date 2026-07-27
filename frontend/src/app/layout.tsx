import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Vazirmatn } from "next/font/google";

import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Midnight Shop | لباس زیر و لباس خواب",
    template: "%s | Midnight Shop",
  },
  description:
    "فروشگاه midnightshop.ir — لباس زیر، ست‌های ادیتوریال و لباس خواب با حس لوکس و نرم.",
  metadataBase: new URL("https://midnightshop.ir"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#efcce3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${cormorant.variable} h-full`}
    >
      <body className={`${vazirmatn.className} flex min-h-full flex-col antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
