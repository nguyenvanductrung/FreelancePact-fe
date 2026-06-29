import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleAuthProvider from "@/components/providers/GoogleAuthProvider";
import { WalletContextProvider } from "@/contexts/WalletContext";

import { Auth0Provider } from "@/components/providers/Auth0Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FreelancePact — Secure Your Work. Guarantee Your Pay.",
  description:
    "FreelancePact provides legal-grade smart contracts and secure escrow for the modern independent professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <Auth0Provider>
          <GoogleAuthProvider>
            <WalletContextProvider>
              {children}
            </WalletContextProvider>
          </GoogleAuthProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
