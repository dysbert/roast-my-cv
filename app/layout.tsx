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
  title: "Roast My CV — Free AI Resume Review & Feedback",
  description:
    "Get instant, brutally honest AI feedback on your CV. Free resume review powered by Claude AI — catches weak action verbs, missing metrics, clichés, and gives you a concrete fix list.",
  keywords: [
    "free CV review",
    "AI resume review",
    "CV feedback online",
    "resume checker free",
    "how to improve my CV",
    "CV mistakes",
    "ATS CV checker",
    "free resume feedback",
    "AI CV analysis",
    "resume review online free",
  ],
  openGraph: {
    title: "Roast My CV — Free AI Resume Review",
    description: "Instant, brutally honest AI feedback on your CV. Free. No signup.",
    type: "website",
    url: "https://roastmycv.live",
    images: [{ url: "https://roastmycv.live/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My CV — Free AI Resume Review",
    description: "Instant, brutally honest AI feedback on your CV. Free. No signup.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is Roast My CV free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. You get 3 free CV roasts per day with no account required. Just upload your PDF and pick a roast style."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is my CV data safe?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Your CV is processed entirely in memory and immediately discarded after analysis. We never save, store, or share any personal information from your CV."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What does the AI actually check in my CV?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The AI checks for weak action verbs, missing metrics and results, generic skills, overused clichés, unexplained employment gaps, and AI-generated language. It gives you a score, a list of specific issues, and concrete rewrites for each problem."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What file formats are supported?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "PDF only, up to 2MB. This covers the vast majority of CVs exported from Word, Google Docs, Canva, and LinkedIn."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does it work for CVs in any language?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. The AI automatically detects the language of your CV and responds in the same language — English, Spanish, French, German, Portuguese, and more."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is this different from other CV checkers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most CV checkers give generic checklists. Roast My CV reads your actual content and gives feedback specific to what you wrote — including rewritten versions of your weakest bullet points. It also detects AI-generated language, which most tools miss."
                  }
                }
              ]
            })
          }}
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
