import "./globals.css";

import { AuthProvider } from "@/apps/core/auth/client";
import { getServerAuthState } from "@/apps/core/auth";
import { getSiteUrl } from "@/src/next/seo.js";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "RICON — Rise of the Icon",
  description:
    "RICON is a verified biographical data platform where talent owns their stories.",
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({ children }) {
  let initialRole = null;
  let initialUser = null;

  try {
    const authState = await getServerAuthState();
    initialRole = authState.role;
    initialUser = authState.user;
  } catch {
    initialRole = null;
    initialUser = null;
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" as="image" href="/Ricon_logo.svg" />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable}`}>
        <Script
          src="https://mcp.figma.com/mcp/html-to-design/capture.js"
          strategy="afterInteractive"
        />
        <AuthProvider initialRole={initialRole} initialUser={initialUser}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
