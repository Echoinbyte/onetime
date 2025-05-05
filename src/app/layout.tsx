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
    title: "OneTime – Secure Self-Destructing Messages",
    description:
        "OneTime is a minimalist, privacy-first web app for sending secret messages via self-destructing links. No history, no traces. Secure, simple, and one-time only.",
    keywords: [
        "secure message",
        "self-destructing message",
        "one-time message",
        "encrypted link",
        "confidential notes",
        "private messaging",
        "password sharing",
        "privacy app",
        "secret message link",
        "temporary message",
        "data privacy",
        "secure communication",
        "message encryption",
        "one-time use app"
    ],
    category: "Utilities, Privacy & Security, Messaging, Technology, Apps, Encrypted Communication",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION_CODE || "",
        yahoo: process.env.YAHOO_VERIFICATION_CODE || "",
        yandex: process.env.YANDEX_VERIFICATION_CODE || "",
        me: process.env.ME_VERIFICATION_CODE || "",
    },
    authors: [{ name: "OneTime Team", url: "https://onetime.vercel.app" }],
    creator: "Echoinbyte",
    applicationName: "OneTime",
    metadataBase: new URL("https://onetime.vercel.app"),
    openGraph: {
        title: "OneTime – Secure Self-Destructing Messages",
        description:
            "Send private messages that vanish after viewing. OneTime offers end-to-end privacy with minimalist, distraction-free UX.",
        url: "https://onetime.vercel.app",
        siteName: "OneTime",
        images: [
            {
                url: "https://onetime.vercel.app/og-image.jpg",
                width: 2400,
                height: 1260,
                alt: "OneTime – Secure One-Time Messages",
                type: "image/jpeg",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        site: "@Echoinbyte",
        creator: "@Echoinbyte",
        title: "OneTime – Secure Self-Destructing Messages",
        description:
            "Send secret messages via self-destructing links. View once, then gone forever. Secure, simple, and no history.",
        images: ["https://onetime.vercel.app/og-image.jpg"],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/maskable.png",
        apple: [
            { url: "/apple-icon-57x57.png", sizes: "57x57" },
            { url: "/apple-icon-72x72.png", sizes: "72x72" },
            { url: "/apple-icon-76x76.png", sizes: "76x76" },
            { url: "/apple-icon-114x114.png", sizes: "114x114" },
            { url: "/apple-icon-120x120.png", sizes: "120x120" },
            { url: "/apple-icon-144x144.png", sizes: "144x144" },
            { url: "/apple-icon-152x152.png", sizes: "152x152" },
            { url: "/apple-touch-icon-180x180.png", sizes: "180x180" },
            { url: "/apple-touch-icon.png" },
        ],
    },
    appleWebApp: {
        title: "OneTime",
        statusBarStyle: "black-translucent",
        capable: true,
        startupImage: [
            {
                url: "/maskable.png",
                media:
                    "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
            },
        ],
    },
    manifest: "/manifest.json",
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
