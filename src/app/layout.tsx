import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onetime",
  description: "OneTime is a minimalist, privacy-first web application that lets you send secret messages through self-destructing links. Once the recipient opens the link, the message is instantly deleted, ensuring it can only be viewed one time—no history, no traces. Perfect for sharing confidential notes, passwords, or personal thoughts securely. OneTime offers end-to-end privacy, optional expiration timers, and a clean, distraction-free interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
