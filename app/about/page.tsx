import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Globe, Github, Coffee, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About LeastPass & Developer Neeraj Rekwar",
  description:
    "Learn about LeastPass, an open-source zero-telemetry password generator built with modern Claymorphism by full-stack developer Neeraj Rekwar.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About LeastPass & Developer Neeraj Rekwar",
    description:
      "The philosophy, cryptographic principles, and open-source mission of LeastPass by creator Neeraj Rekwar.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b9774] mb-8">
        <Link href="/" className="hover:text-[#080f0f] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#080f0f]">About</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <Shield className="w-3.5 h-3.5 text-[#86ba90]" />
          <span>Independent Open Source Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#080f0f] mb-4">
          The Story Behind LeastPass
        </h1>
        <p className="text-base sm:text-lg text-[#6b9774] max-w-2xl mx-auto leading-relaxed">
          Why bloated password managers and ad-heavy web generators inspired a tactile, zero-telemetry cryptographic alternative.
        </p>
      </div>

      {/* Story Card */}
      <div className="clay-card p-6 md:p-10 mb-10 space-y-6 text-[#3b5240] leading-relaxed text-sm md:text-base">
        <h2 className="text-xl md:text-2xl font-bold text-[#080f0f]">
          Why I Created LeastPass
        </h2>
        <p>
          I started developing <strong>LeastPass</strong> out of personal frustration with the landscape of online password generation tools. Searching for a simple password generator often leads to bloated websites covered in banner advertisements, invasive third-party trackers, and sketchy backend API routes where credentials might be logged or cached.
        </p>
        <p>
          As a software engineer passionate about clean interface ergonomics and digital sovereignty, I wanted to build the exact tool I would trust for my own sensitive servers and master vaults:
        </p>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl clay-well bg-white/70">
            <div className="flex items-center gap-2 font-bold text-sm text-[#080f0f] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#86ba90]" />
              <span>100% Client-Side Execution</span>
            </div>
            <p className="text-xs text-[#6b9774]">
              Zero network requests for credential generation. Passwords exist exclusively in your device&apos;s ephemeral RAM.
            </p>
          </div>

          <div className="p-4 rounded-2xl clay-well bg-white/70">
            <div className="flex items-center gap-2 font-bold text-sm text-[#080f0f] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#86ba90]" />
              <span>CSPRNG Hardware Entropy</span>
            </div>
            <p className="text-xs text-[#6b9774]">
              Utilizes native <code>window.crypto.getRandomValues()</code> rather than predictable pseudo-random <code>Math.random()</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl clay-well bg-white/70">
            <div className="flex items-center gap-2 font-bold text-sm text-[#080f0f] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#86ba90]" />
              <span>Real Shannon Entropy Math</span>
            </div>
            <p className="text-xs text-[#6b9774]">
              Evaluates true bit strength and GPU cluster crack time estimates based on information theory.
            </p>
          </div>

          <div className="p-4 rounded-2xl clay-well bg-white/70">
            <div className="flex items-center gap-2 font-bold text-sm text-[#080f0f] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#86ba90]" />
              <span>Tactile Claymorphism UI</span>
            </div>
            <p className="text-xs text-[#6b9774]">
              Designed with satisfying 3D clay ergonomics that make digital security an intuitive, delightful daily routine.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Profile Bio Card */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-br from-[#f8fbf9] via-[#edf6f0] to-[#e4f2e7] mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#86ba90] to-[#547e5d] text-white flex items-center justify-center font-black text-3xl shadow-lg border-2 border-white/80 shrink-0">
            NR
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-black text-[#080f0f]">
              Neeraj Rekwar
            </h3>
            <p className="text-xs font-semibold text-[#6b9774] mb-3">
              Full-Stack Web & Interface Developer · Creator of LeastPass
            </p>
            <p className="text-sm text-[#3b5240] leading-relaxed mb-5">
              I specialize in crafting high-performance Next.js applications, delightful user experiences, and client-first security utilities. When not writing code, I enjoy designing tactile UI aesthetics and contributing to the open-source community.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href="https://ko-fi.com/neerajrekwar2001"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl clay-btn-coffee text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buy Me a Coffee on Ko-fi</span>
                <ArrowUpRight className="w-3 h-3 opacity-80" />
              </a>

              <a
                href="https://github.com/devneeraj77"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3.5 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a
                href="https://neerajrekwar.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3.5 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Return CTA */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl clay-btn text-white font-bold text-sm shadow-md"
        >
          <span>Launch Password Generator Workstation</span>
        </Link>
      </div>
    </div>
  );
}
