"use client";

import React, { useState } from "react";
import { Coffee, Heart, ExternalLink, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BuyMeCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COFFEE_TIERS = [
  { count: 1, amount: "$3", label: "Single Espresso", desc: "A warm thank you" },
  { count: 3, amount: "$9", label: "Developer Fuel", desc: "Powers a late-night feature", popular: true },
  { count: 5, amount: "$15", label: "Server Roaster", desc: "Keeps LeastPass ad-free & fast" },
];

export default function BuyMeCoffeeModal({ isOpen, onClose }: BuyMeCoffeeModalProps) {
  const [selectedTier, setSelectedTier] = useState<number>(3);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [supporterName, setSupporterName] = useState<string>("");
  const [supporterMessage, setSupporterMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const kofiUrl = "https://ko-fi.com/neerajrekwar2001";

  const handleSupportRedirect = () => {
    window.open(kofiUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(kofiUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden clay-card bg-[#f8fbf9] p-6 md:p-8 text-[#080f0f] z-10 border border-white/80"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-xl text-[#6b9774] hover:text-[#080f0f] clay-btn-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff5e5b] text-white flex items-center justify-center shadow-lg shadow-[#ff5e5b]/30">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#080f0f]">
                  Support Neeraj Rekwar
                </h3>
                <p className="text-xs text-[#6b9774] font-medium">
                  Full-Stack Creator of LeastPass & Open Source Tools
                </p>
              </div>
            </div>

            <p className="text-sm text-[#3b5240] mb-5 leading-relaxed">
              LeastPass is free, open source, and 100% ad-free with zero trackers. If this tool saved you time or improved your digital security, consider buying me a coffee on Ko-fi!
            </p>

            {/* Coffee Tier Selector */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {COFFEE_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.count && !customAmount;
                return (
                  <button
                    key={tier.count}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier.count);
                      setCustomAmount("");
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-between transition-all text-center relative ${
                      isSelected
                        ? "bg-[#86ba90] text-white shadow-md shadow-[#86ba90]/30 scale-[1.02]"
                        : "clay-btn-subtle text-[#080f0f] hover:bg-[#e6f2e9]"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#ff5e5b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Popular
                      </span>
                    )}
                    <span className="text-xs font-semibold mb-1">
                      {tier.count} {tier.count === 1 ? "Coffee" : "Coffees"}
                    </span>
                    <span className="text-lg font-bold tracking-tight">
                      {tier.amount}
                    </span>
                    <span className={`text-[10px] mt-1 ${isSelected ? "text-emerald-50" : "text-[#6b9774]"}`}>
                      {tier.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Optional Note / Message */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#3b5240] mb-1">
                  Your Name or Handle (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl clay-well bg-white/80 border border-[#86ba90]/30 text-[#080f0f] focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#3b5240] mb-1">
                  A kind note to Neeraj (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Loving the claymorphic generator! Keep up the awesome work."
                  value={supporterMessage}
                  onChange={(e) => setSupporterMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl clay-well bg-white/80 border border-[#86ba90]/30 text-[#080f0f] focus:outline-none focus:ring-2 focus:ring-[#86ba90] resize-none"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleSupportRedirect}
                className="w-full sm:flex-1 py-3 px-5 text-sm font-bold text-white clay-btn-coffee flex items-center justify-center gap-2 rounded-xl"
              >
                <Coffee className="w-4 h-4" />
                <span>Continue on Ko-fi</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:w-auto py-3 px-4 text-xs font-semibold text-[#080f0f] clay-btn-subtle rounded-xl flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#86ba90]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <span>Copy Ko-fi Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#86ba90]/20 flex items-center justify-center gap-1.5 text-xs text-[#6b9774]">
              <Heart className="w-3.5 h-3.5 text-[#ff5e5b] fill-[#ff5e5b]" />
              <span>Direct Link: <strong>ko-fi.com/neerajrekwar2001</strong></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
