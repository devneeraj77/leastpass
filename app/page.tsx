"use client";

import React, { useState } from "react";
import PasswordGenerator from "@/components/passwordGen";
import DeveloperSection from "@/components/DeveloperSection";
import SecurityLab from "@/components/SecurityLab";
import BuyMeCoffeeModal from "@/components/BuyMeCoffeeModal";
import {
  Shield,
  Coffee,
  Zap,
  ArrowDown,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Why is LeastPass safer than traditional online password generators?",
      a: "Most online generators use simple Math.random() scripts or even make server-side API requests that could be logged. LeastPass uses the Web Cryptography API (crypto.getRandomValues), running exclusively in your browser RAM with zero server communication.",
    },
    {
      q: "Does LeastPass store or track any of my generated passwords?",
      a: "No. Absolutely zero data is logged, stored on servers, or tracked. The session history is kept only in your local browser state during your current visit and is cleared the moment you refresh or close the tab.",
    },
    {
      q: "What is Shannon Entropy and why does it matter?",
      a: "Entropy measures the unpredictability of a password in bits. A password with 80+ bits of entropy would take billions of dollars in supercomputing clusters trillions of years to brute-force.",
    },
    {
      q: "How can I support the developer, Neeraj Rekwar?",
      a: "You can support Neeraj by buying him a coffee directly on Ko-fi (ko-fi.com/neerajrekwar2001), starring the GitHub repository (devneeraj77/leastpass), or sharing the tool with friends and colleagues!",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 pt-12 pb-8 text-center flex flex-col items-center">
        {/* Soft Clay Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-badge text-xs font-bold text-[#3b5240] mb-6">
          <Shield className="w-4 h-4 text-[#86ba90]" />
          <span>LeastPass · Tactile Claymorphism Security Suite</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#080f0f] max-w-3xl leading-[1.15] mb-5">
          Tactile Cryptography for Modern Everyday Security
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#6b9774] max-w-2xl mx-auto leading-relaxed mb-8">
          Craft uncrackable passwords, memorable passphrases, and secure PINs with instant entropy calculation and zero-knowledge client isolation.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#generator"
            className="py-3.5 px-7 rounded-2xl clay-btn text-white font-bold text-sm flex items-center gap-2 shadow-md hover:scale-[1.02] transition-transform"
          >
            <Zap className="w-4 h-4" />
            <span>Generate Password Now</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsCoffeeOpen(true)}
            className="py-3.5 px-6 rounded-2xl clay-btn-coffee text-white font-bold text-sm flex items-center gap-2 group"
          >
            <Coffee className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Buy Developer a Coffee</span>
          </button>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl text-left">
          <div className="p-3.5 rounded-2xl clay-well bg-white/70">
            <span className="text-[11px] font-bold text-[#86ba90] uppercase block">Engine</span>
            <span className="text-xs font-bold text-[#080f0f]">CSPRNG Hardware-Backed</span>
          </div>

          <div className="p-3.5 rounded-2xl clay-well bg-white/70">
            <span className="text-[11px] font-bold text-[#86ba90] uppercase block">Privacy</span>
            <span className="text-xs font-bold text-[#080f0f]">100% Client-Side RAM</span>
          </div>

          <div className="p-3.5 rounded-2xl clay-well bg-white/70">
            <span className="text-[11px] font-bold text-[#86ba90] uppercase block">Analysis</span>
            <span className="text-xs font-bold text-[#080f0f]">Shannon Entropy Metrics</span>
          </div>

          <div className="p-3.5 rounded-2xl clay-well bg-white/70">
            <span className="text-[11px] font-bold text-[#86ba90] uppercase block">Creator</span>
            <span className="text-xs font-bold text-[#080f0f]">Neeraj Rekwar (Ko-fi)</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Password Generator Workstation */}
      <PasswordGenerator />

      {/* Security & Cryptography Lab */}
      <SecurityLab />

      {/* Developer Neeraj Rekwar Profile & Ko-fi Showcase */}
      <DeveloperSection />

      {/* Trust & FAQ Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
            <HelpCircle className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#080f0f]">
            Security, Privacy & Support
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="clay-card p-4 md:p-5 bg-white/80 cursor-pointer transition-all"
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm md:text-base font-bold text-[#080f0f]">
                    {faq.q}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-lg clay-btn-subtle flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-[#080f0f]" />
                  </div>
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-[#3b5240] leading-relaxed pt-2 border-t border-[#86ba90]/20">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Buy Me a Coffee Trigger Modal */}
      <BuyMeCoffeeModal isOpen={isCoffeeOpen} onClose={() => setIsCoffeeOpen(false)} />
    </div>
  );
}
