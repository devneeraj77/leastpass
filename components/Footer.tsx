"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Coffee, Github, Shield, Globe, ArrowUpRight, FileText } from "lucide-react";
import BuyMeCoffeeModal from "./BuyMeCoffeeModal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="w-full border-t border-[#86ba90]/25 bg-[#f6faf7] text-[#080f0f] py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Brand & Purpose */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl clay-btn flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-black text-base tracking-tight">LeastPass</span>
          </Link>
          <p className="text-xs text-[#6b9774] max-w-xs leading-relaxed">
            Zero-telemetry client-side cryptographic password workstation with tactile modern Claymorphism.
          </p>
        </div>

        {/* Center: Internal Site Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[#3b5240]">
          <Link href="/" className="hover:text-[#080f0f] transition-colors">
            Generator
          </Link>
          <Link href="/about" className="hover:text-[#080f0f] transition-colors">
            About
          </Link>
          <Link href="/blog" className="hover:text-[#080f0f] transition-colors">
            Blog & Guides
          </Link>
          <Link href="/security" className="hover:text-[#080f0f] transition-colors">
            Security
          </Link>
          <Link href="/privacy" className="hover:text-[#080f0f] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#080f0f] transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-[#080f0f] transition-colors">
            Contact
          </Link>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#080f0f] transition-colors inline-flex items-center gap-1"
          >
            <FileText className="w-3 h-3 text-[#86ba90]" />
            <span>llms.txt</span>
          </a>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#080f0f] transition-colors"
          >
            Sitemap
          </a>
          <Link href="/admin" className="hover:text-[#080f0f] transition-colors">
            Admin
          </Link>
        </div>

        {/* Right: Developer Attribution & Socials */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#3b5240] font-medium">
            <span>By</span>
            <a
              href="https://neerajrekwar.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-[#86ba90] transition-colors"
            >
              Neeraj Rekwar
            </a>
            <span>·</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#ff5e5b] font-bold hover:underline inline-flex items-center gap-1"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Buy Coffee</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[#3b5240]">
            <a
              href="https://ko-fi.com/neerajrekwar2001"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#080f0f] flex items-center gap-0.5"
            >
              <span>Ko-fi</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://github.com/devneeraj77/leastpass"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#080f0f] flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://neerajrekwar.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#080f0f] flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-[#86ba90]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6b9774] gap-2">
        <p>© {new Date().getFullYear()} LeastPass · Open Source MIT License</p>
        <p>Crafted with dedication by Neeraj Rekwar · Zero trackers · 100% offline private</p>
      </div>

      <BuyMeCoffeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}
