"use client";

import React, { useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";

export default function SecurityLab() {
  const [testPassword, setTestPassword] = useState("K33p-1t-S3cur3!");

  // Compute stats on tested password
  const length = testPassword.length;
  const hasLower = /[a-z]/.test(testPassword);
  const hasUpper = /[A-Z]/.test(testPassword);
  const hasNumber = /[0-9]/.test(testPassword);
  const hasSymbol = /[^a-zA-Z0-9]/.test(testPassword);

  let pool = 0;
  if (hasLower) pool += 26;
  if (hasUpper) pool += 26;
  if (hasNumber) pool += 10;
  if (hasSymbol) pool += 33;
  if (pool === 0) pool = 1;

  const entropyBits = Math.round(length * (Math.log(pool) / Math.LN2));

  let statusLabel = "Weak";
  let statusColor = "#f59e0b";
  if (entropyBits >= 80) {
    statusLabel = "Military Grade (80+ bits)";
    statusColor = "#10b981";
  } else if (entropyBits >= 60) {
    statusLabel = "Very Strong (60+ bits)";
    statusColor = "#86ba90";
  } else if (entropyBits >= 45) {
    statusLabel = "Adequate for Consumer Web";
    statusColor = "#3b82f6";
  }

  return (
    <section id="security-lab" className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <Shield className="w-3.5 h-3.5 text-[#86ba90]" />
          <span>Interactive Cryptography Lab</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#080f0f]">
          How LeastPass Protects You
        </h2>
        <p className="mt-2 text-base text-[#6b9774] max-w-xl mx-auto">
          Understanding information entropy, CSPRNG algorithms, and client-side zero-knowledge isolation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="clay-card p-6 bg-white/70 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#86ba90]/20 text-[#86ba90] flex items-center justify-center mb-4 font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-[#080f0f] mb-2">CSPRNG Precision</h3>
            <p className="text-xs text-[#3b5240] leading-relaxed">
              Standard JavaScript <code>Math.random()</code> is pseudo-random and vulnerable to seed prediction. LeastPass exclusively uses the browser&apos;s hardware-backed <code>window.crypto.getRandomValues()</code> CSPRNG.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#86ba90]/20 flex items-center gap-1.5 text-[11px] text-[#6b9774]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>FIPS 140-2 Compliant Source</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="clay-card p-6 bg-white/70 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#86ba90]/20 text-[#86ba90] flex items-center justify-center mb-4 font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-[#080f0f] mb-2">Shannon Entropy Math</h3>
            <p className="text-xs text-[#3b5240] leading-relaxed">
              Password strength is purely a measure of unpredictability. Entropy is evaluated as <em>E = L × log₂(N)</em>, where <em>L</em> is length and <em>N</em> is character pool cardinality.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#86ba90]/20 flex items-center gap-1.5 text-[11px] text-[#6b9774]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>True Bit Measurement</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="clay-card p-6 bg-white/70 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#86ba90]/20 text-[#86ba90] flex items-center justify-center mb-4 font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-[#080f0f] mb-2">Zero-Knowledge Sandbox</h3>
            <p className="text-xs text-[#3b5240] leading-relaxed">
              Generated secrets never touch our servers or any third-party APIs. If you disconnect your internet or go into airplane mode, LeastPass continues to operate identically.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#86ba90]/20 flex items-center gap-1.5 text-[11px] text-[#6b9774]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>100% Offline Capability</span>
          </div>
        </div>
      </div>

      {/* Interactive Live Analyzer */}
      <div className="clay-card p-6 md:p-8 bg-[#f5f9f6]">
        <h3 className="text-lg font-bold text-[#080f0f] mb-1">
          Live Entropy Inspector
        </h3>
        <p className="text-xs text-[#6b9774] mb-4">
          Type or paste any password to benchmark its real cryptographic strength:
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
          <input
            type="text"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Type any password..."
            className="w-full px-4 py-3 rounded-2xl clay-well font-mono text-sm text-[#080f0f] bg-white border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
          />
          <button
            type="button"
            onClick={() => setTestPassword("")}
            className="w-full sm:w-auto px-4 py-3 text-xs font-bold clay-btn-subtle rounded-2xl text-[#080f0f] shrink-0"
          >
            Clear
          </button>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl clay-well bg-white/70">
            <span className="text-[10px] text-[#6b9774] font-semibold block uppercase">Length</span>
            <span className="text-lg font-bold font-mono text-[#080f0f]">{length} chars</span>
          </div>

          <div className="p-3 rounded-2xl clay-well bg-white/70">
            <span className="text-[10px] text-[#6b9774] font-semibold block uppercase">Pool Space</span>
            <span className="text-lg font-bold font-mono text-[#080f0f]">{pool} possibilities</span>
          </div>

          <div className="p-3 rounded-2xl clay-well bg-white/70">
            <span className="text-[10px] text-[#6b9774] font-semibold block uppercase">Entropy</span>
            <span className="text-lg font-bold font-mono text-[#86ba90]">{entropyBits} bits</span>
          </div>

          <div className="p-3 rounded-2xl clay-well bg-white/70">
            <span className="text-[10px] text-[#6b9774] font-semibold block uppercase">Verdict</span>
            <span
              className="text-xs font-bold font-mono block mt-1"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
