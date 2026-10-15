"use client";

import React, { useState } from "react";
import { Coffee, Github, Mail, Globe, Heart, Shield, Code, Sparkles, ArrowUpRight } from "lucide-react";
import BuyMeCoffeeModal from "./BuyMeCoffeeModal";

export default function DeveloperSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const kofiUrl = "https://ko-fi.com/neerajrekwar2001";
  const githubUrl = "https://github.com/devneeraj77";
  const portfolioUrl = "https://neerajrekwar.github.io/";
  const emailAddress = "dev.neerajrekwar@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  return (
    <section id="developer" className="w-full max-w-5xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <Code className="w-3.5 h-3.5 text-[#86ba90]" />
          <span>Independent Developer Spotlight</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#080f0f]">
          Crafted with care by Neeraj Rekwar
        </h2>
        <p className="mt-2 text-base text-[#6b9774] max-w-xl mx-auto">
          Passionate full-stack developer dedicated to building fast, beautiful, and secure web applications with tactile modern ergonomics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Developer Profile Card */}
        <div className="md:col-span-5 flex flex-col justify-between clay-card p-6 md:p-8 relative overflow-hidden">
          <div>
            {/* Avatar & Status */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#86ba90] to-[#547e5d] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white/60">
                NR
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#080f0f]">Neeraj Rekwar</h3>
                <p className="text-xs font-medium text-[#6b9774]">Full-Stack Web & Interface Developer</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#3b5240]">
                  <span className="w-2 h-2 rounded-full bg-[#86ba90] inline-block animate-pulse" />
                  <span>Available for freelance & collaboration</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#3b5240] leading-relaxed mb-6">
              Hi! I created <strong>LeastPass</strong> as a lightweight, zero-telemetry alternative to bloated password managers. My goal is to make digital privacy intuitive and delightful to use through modern tactile Claymorphism.
            </p>

            {/* Skills & Principles */}
            <div className="mb-6">
              <div className="text-xs font-bold text-[#080f0f] uppercase tracking-wider mb-2">
                Tech & Expertise
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Next.js", "React", "TypeScript", "Tailwind CSS", "UI/UX Claymorphism", "Client-Side Cryptography"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-xl clay-badge text-[#243528] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social & Contact Bar */}
          <div className="pt-4 border-t border-[#86ba90]/30 flex flex-wrap items-center gap-2">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
              <span>devneeraj77</span>
            </a>

            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Portfolio Website"
            >
              <Globe className="w-4 h-4" />
              <span>Portfolio</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="p-2.5 rounded-xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors flex items-center gap-1.5 text-xs font-semibold ml-auto"
              title="Copy Email"
            >
              <Mail className="w-4 h-4" />
              <span>{copiedEmail ? "Copied Email!" : "Email Me"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Support Neeraj / Ko-fi Showcase */}
        <div className="md:col-span-7 flex flex-col justify-between clay-card p-6 md:p-8 bg-gradient-to-br from-[#f6faf7] via-[#f0f7f2] to-[#e7f3ea] relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#ff5e5b] text-white flex items-center justify-center shadow-md shadow-[#ff5e5b]/20">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#080f0f]">
                    Buy Me a Coffee on Ko-fi
                  </h3>
                  <p className="text-xs text-[#6b9774] font-medium">
                    Direct Creator Support · ko-fi.com/neerajrekwar2001
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#ff5e5b] bg-[#ff5e5b]/10 border border-[#ff5e5b]/20">
                <Heart className="w-3 h-3 fill-[#ff5e5b]" />
                <span>Zero Ads · 100% Free</span>
              </span>
            </div>

            <p className="text-sm text-[#3b5240] leading-relaxed mb-6">
              Building and maintaining independent tools like LeastPass requires time, hosting, and dedication. Your voluntary support helps me keep all features completely open, ad-free, and regularly updated with new security algorithms.
            </p>

            {/* What your support does */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl clay-well bg-white/60">
                <Shield className="w-5 h-5 text-[#86ba90] mb-1.5" />
                <h4 className="text-xs font-bold text-[#080f0f]">Zero Commercialization</h4>
                <p className="text-[11px] text-[#6b9774] mt-0.5">No paywalls, subscriptions, or sneaky monetization.</p>
              </div>

              <div className="p-3.5 rounded-2xl clay-well bg-white/60">
                <Sparkles className="w-5 h-5 text-[#86ba90] mb-1.5" />
                <h4 className="text-xs font-bold text-[#080f0f]">Feature Iterations</h4>
                <p className="text-[11px] text-[#6b9774] mt-0.5">Entropy visualizers, passphrase dictionaries, exports.</p>
              </div>

              <div className="p-3.5 rounded-2xl clay-well bg-white/60">
                <Coffee className="w-5 h-5 text-[#ff5e5b] mb-1.5" />
                <h4 className="text-xs font-bold text-[#080f0f]">Fuel Indie Dev</h4>
                <p className="text-[11px] text-[#6b9774] mt-0.5">Empower individual developers making honest software.</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#86ba90]/30 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:flex-1 py-3 px-6 text-sm font-bold text-white clay-btn-coffee rounded-2xl flex items-center justify-center gap-2 group"
            >
              <Coffee className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Support Neeraj on Ko-fi</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={kofiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-5 text-xs font-bold text-[#080f0f] clay-btn-subtle rounded-2xl flex items-center justify-center gap-2"
            >
              <span>Visit ko-fi.com/neerajrekwar2001</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      <BuyMeCoffeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
