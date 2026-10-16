import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://ais-pre-oadcti4whd6ltse56q3rhf-291116410510.asia-southeast1.run.app";

export const viewport: Viewport = {
  themeColor: "#86ba90",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LeastPass – Tactile Cryptographic Password Generator",
    template: "%s | LeastPass",
  },
  description:
    "Generate uncrackable passwords, memorable passphrases, and secure PINs with instant Shannon entropy calculation and 100% client-side privacy by developer Neeraj Rekwar.",
  keywords: [
    "LeastPass",
    "password generator",
    "cryptographic password generator",
    "memorable passphrase generator",
    "PIN generator",
    "Shannon entropy calculator",
    "password strength tester",
    "client-side password generator",
    "Neeraj Rekwar",
    "Claymorphism UI",
    "Ko-fi neerajrekwar2001",
    "zero telemetry security",
  ],
  authors: [
    {
      name: "Neeraj Rekwar",
      url: "https://neerajrekwar.github.io/",
    },
  ],
  creator: "Neeraj Rekwar",
  publisher: "Neeraj Rekwar",
  applicationName: "LeastPass",
  generator: "Next.js",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "LeastPass",
    title: "LeastPass – Tactile Cryptographic Password Generator",
    description:
      "Generate uncrackable passwords, memorable passphrases, and secure PINs with real-time entropy calculation and 100% offline client-side privacy by Neeraj Rekwar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeastPass – Tactile Cryptographic Password Generator",
    description:
      "Generate cryptographically secure passwords and passphrases with real-time entropy analysis. 100% client-side privacy by Neeraj Rekwar.",
    creator: "@devneeraj77",
  },
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
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      "name": "LeastPass",
      "url": siteUrl,
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "All",
      "description":
        "A client-side cryptographic password generator and entropy analyzer with modern tactile Claymorphism aesthetics by Neeraj Rekwar.",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "1.0.0",
      "author": {
        "@type": "Person",
        "name": "Neeraj Rekwar",
        "url": "https://neerajrekwar.github.io/",
        "sameAs": [
          "https://github.com/devneeraj77",
          "https://ko-fi.com/neerajrekwar2001"
        ]
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Hardware-backed CSPRNG random generation",
        "Memorable Diceware passphrase generator",
        "Numeric PIN generator",
        "Shannon entropy real-time calculation",
        "Crack-time GPU cluster estimation",
        "Zero-knowledge 100% client-side RAM isolation",
        "Direct Ko-fi creator support"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why is LeastPass safer than traditional online password generators?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most online generators use simple Math.random() scripts or make server-side API requests that could be logged. LeastPass uses the Web Cryptography API (crypto.getRandomValues), running exclusively in your browser RAM with zero server communication."
          }
        },
        {
          "@type": "Question",
          "name": "Does LeastPass store or track any of my generated passwords?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Absolutely zero data is logged, stored on servers, or tracked. The session history is kept only in your local browser state during your current visit and is cleared when you refresh or close the tab."
          }
        },
        {
          "@type": "Question",
          "name": "What is Shannon Entropy and why does it matter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Entropy measures the unpredictability of a password in bits. A password with 80+ bits of entropy would take billions of dollars in supercomputing clusters trillions of years to brute-force."
          }
        },
        {
          "@type": "Question",
          "name": "How can I support the developer, Neeraj Rekwar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can support Neeraj by buying him a coffee directly on Ko-fi at ko-fi.com/neerajrekwar2001 or starring the GitHub repository devneeraj77/leastpass."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} text-[#080f0f] bg-[#fffcff] antialiased min-h-screen flex flex-col justify-between`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
