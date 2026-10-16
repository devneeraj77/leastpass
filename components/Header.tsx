"use client";

import * as React from "react";
import Link from "next/link";
import { Coffee, Shield, Menu, X } from "lucide-react";
import BuyMeCoffeeModal from "./BuyMeCoffeeModal";

export function Header() {
  const [isCoffeeOpen, setIsCoffeeOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fffcff]/90 border-b border-[#86ba90]/25 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8 py-3">
          {/* Zone 1: Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl clay-btn flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-[#080f0f] leading-none">
                LeastPass
              </span>
              <span className="text-[10px] font-semibold text-[#6b9774] tracking-wide">
                Tactile Security
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#3b5240]">
            <Link
              href="/#generator"
              className="hover:text-[#080f0f] transition-colors whitespace-nowrap shrink-0"
            >
              Generator
            </Link>
            <Link
              href="/about"
              className="hover:text-[#080f0f] transition-colors whitespace-nowrap shrink-0"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="hover:text-[#080f0f] transition-colors whitespace-nowrap shrink-0"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#080f0f] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </Link>
            <button
              onClick={() => setIsCoffeeOpen(true)}
              className="hover:text-[#080f0f] transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Support
            </button>
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCoffeeOpen(true)}
              className="hidden sm:flex items-center gap-2 py-2 px-4 rounded-xl clay-btn-coffee text-white text-xs font-bold whitespace-nowrap shrink-0 group"
            >
              <Coffee className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Buy Me a Coffee</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl clay-btn-subtle text-[#080f0f]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#86ba90]/25 bg-[#f6faf7] px-6 py-4 space-y-3">
            <Link
              href="/#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#080f0f] py-1"
            >
              Generator
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#080f0f] py-1"
            >
              About
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#080f0f] py-1"
            >
              Blog & Guides
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-[#080f0f] py-1"
            >
              Contact
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCoffeeOpen(true);
              }}
              className="w-full mt-2 py-2.5 px-4 rounded-xl clay-btn-coffee text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy Me a Coffee (Ko-fi)</span>
            </button>
          </div>
        )}
      </header>

      <BuyMeCoffeeModal isOpen={isCoffeeOpen} onClose={() => setIsCoffeeOpen(false)} />
    </>
  );
}

export default Header;
