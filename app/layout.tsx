import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
  title: "Roast My CV — AI-Powered Resume Destruction",
  description:
    "Upload your CV and get brutally honest AI feedback. No sugarcoating. Pick your roast style and let the AI destroy your resume with surgical precision.",
  keywords: ["CV", "resume", "roast", "AI feedback", "career", "job search"],
  openGraph: {
    title: "Roast My CV",
    description: "Your resume has never been this honest with you.",
    type: "website",
    url: "https://roastmycv.live",
    images: [{ url: "https://roastmycv.live/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My CV — AI-Powered Resume Destruction",
    description: "Your resume has never been this honest with you.",
    images: ["https://roastmycv.live/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable)}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] font-[var(--font-inter),sans-serif]`}
      >
        {children}
        <SpeedInsights />
        <footer className="px-4 py-6 text-center">
          <a
            href="/privacy"
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            Privacy Policy
          </a>
        </footer>
      </body>
    </html>
  );
}
