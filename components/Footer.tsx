"use client";

import React, { useState } from "react";
import { Coffee, Github, Shield, Globe, ArrowUpRight } from "lucide-react";
import BuyMeCoffeeModal from "./BuyMeCoffeeModal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="w-full border-t border-[#86ba90]/25 bg-[#f6faf7] text-[#080f0f] py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Purpose */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg clay-btn flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">LeastPass</span>
          </div>
          <p className="text-xs text-[#6b9774] max-w-sm">
            Client-side cryptographic password generator built with modern Claymorphism ergonomics.
          </p>
        </div>

        {/* Center: Developer attribution and support */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-[#3b5240] mb-2 font-medium">
            <span>Built by</span>
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
              <span>Buy me a coffee</span>
            </button>
          </div>
          <p className="text-[11px] text-[#6b9774]">
            Zero trackers · Zero servers · 100% Offline private
          </p>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-[#3b5240]">
          <a
            href="https://ko-fi.com/neerajrekwar2001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#080f0f] flex items-center gap-1"
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

      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-[#86ba90]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6b9774] gap-2">
        <p>© {new Date().getFullYear()} LeastPass · Open Source MIT License</p>
        <p>Created with dedication by Neeraj Rekwar</p>
      </div>

      <BuyMeCoffeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}
