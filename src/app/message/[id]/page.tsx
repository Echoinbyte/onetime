import React from "react";
import ReadMessageClient from '@/components/ReadMessageClient';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OneTimex – Secure Self-Destructing Messages",
  description:
    "OneTimex is a minimalist, privacy-first web app for sending secret messages via self-destructing links. No history, no traces. Secure, simple, and one-time only.",
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
    "one-time use app",
  ],
  category:
    "Utilities, Privacy & Security, Messaging, Technology, Apps, Encrypted Communication",
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || "",
    yahoo: process.env.YAHOO_VERIFICATION_CODE || "",
    yandex: process.env.YANDEX_VERIFICATION_CODE || "",
    me: process.env.ME_VERIFICATION_CODE || "",
  },
  authors: [{ name: "OneTimex Team", url: "https://onetimex.vercel.app" }],
  creator: "Echoinbyte",
  applicationName: "OneTimex",
  metadataBase: new URL("https://onetimex.vercel.app"),
  openGraph: {
    title: "OneTimex – Secure Self-Destructing Messages",
    description:
      "Send private messages that vanish after viewing. OneTimex offers end-to-end privacy with minimalist, distraction-free UX.",
    url: "https://onetimex.vercel.app",
    siteName: "OneTimex",
    images: [
      {
        url: "https://onetimex.vercel.app/og-image.jpg",
        width: 2400,
        height: 1260,
        alt: "OneTimex – Secure One-Time Messages",
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
    title: "OneTimex – Secure Self-Destructing Messages",
    description:
      "Send secret messages via self-destructing links. View once, then gone forever. Secure, simple, and no history.",
    images: ["https://onetimex.vercel.app/og-image.jpg"],
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
    title: "OneTimex",
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

export default async function ReadMessagePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const {id} = await params;

    return <ReadMessageClient id={id} />;
}
