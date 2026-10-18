import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, ServerOff, FileCheck, CheckCircle2, Mail, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | LeastPass Zero-Telemetry Architecture",
  description:
    "Official Privacy Policy for LeastPass. Discover our zero-telemetry, 100% client-side cryptographic isolation architecture.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | LeastPass",
    description:
      "LeastPass generates passwords entirely inside your browser RAM. Zero passwords are ever transmitted or stored on any server.",
    url: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 19, 2026";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b9774] mb-8">
        <Link href="/" className="hover:text-[#080f0f] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#080f0f]">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <ShieldCheck className="w-4 h-4 text-[#86ba90]" />
          <span>Zero-Telemetry & RAM Isolation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#080f0f] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#6b9774] mt-2">
          Effective Date & Last Updated: <strong>{lastUpdated}</strong>
        </p>
      </div>

      {/* Key Highlights Card */}
      <div className="clay-card p-6 sm:p-8 bg-white/95 mb-8 border border-[#86ba90]/30 shadow-md">
        <h2 className="text-lg font-black text-[#080f0f] mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#86ba90]" />
          <span>Core Privacy Commitments at a Glance</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="clay-well p-4 rounded-xl bg-[#edf5ef] space-y-1.5">
            <div className="font-bold text-[#080f0f] flex items-center gap-1.5">
              <ServerOff className="w-4 h-4 text-[#86ba90]" />
              <span>0% Server Transmission</span>
            </div>
            <p className="text-[#3b5240]">
              Passwords, passphrases, and PINs are computed strictly inside your browser RAM. No secrets ever leave your device.
            </p>
          </div>

          <div className="clay-well p-4 rounded-xl bg-[#edf5ef] space-y-1.5">
            <div className="font-bold text-[#080f0f] flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-[#86ba90]" />
              <span>Zero Account Required</span>
            </div>
            <p className="text-[#3b5240]">
              Public password generation requires no registration, email, identity collection, or credit card details.
            </p>
          </div>

          <div className="clay-well p-4 rounded-xl bg-[#edf5ef] space-y-1.5">
            <div className="font-bold text-[#080f0f] flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#86ba90]" />
              <span>Verifiable Open Source</span>
            </div>
            <p className="text-[#3b5240]">
              100% of our cryptographic code is open-source on GitHub under the MIT License for public security audit.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#3b5240] leading-relaxed">
        {/* Section 1 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">1</span>
            <span>Cryptographic Architecture & Password Privacy</span>
          </h3>
          <p>
            LeastPass operates on an uncompromising <strong>Zero-Knowledge and Zero-Telemetry principle</strong>. All pseudo-random generation is executed locally through the W3C standard Web Cryptography API (<code className="bg-[#edf5ef] text-[#080f0f] px-1.5 py-0.5 rounded font-mono text-xs">window.crypto.getRandomValues</code>), which harnesses hardware-backed entropy from your operating system kernel.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>No Central Database of Passwords:</strong> We do not operate any database that collects or logs generated credentials.</li>
            <li><strong>RAM-Only State:</strong> Your generated passwords exist solely in temporary component state. Refreshing or closing the tab irreversibly destroys the session cache.</li>
            <li><strong>Clipboard Safety:</strong> When you copy a password, LeastPass places it onto your operating system clipboard buffer without retaining any persistent duplicate.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">2</span>
            <span>Anonymous Analytics & Performance Measurement</span>
          </h3>
          <p>
            To understand high-level feature engagement and improve usability, we utilize Google Analytics 4 (GA4) with measurement ID <code className="bg-[#edf5ef] text-[#080f0f] px-1.5 py-0.5 rounded font-mono text-xs">G-YYWWSXPPKN</code>.
          </p>
          <p>
            <strong>What we measure:</strong> Anonymous event metrics, such as generation count (e.g. random vs passphrase mode), length slider changes, copy button clicks, and general browser/device categories.
          </p>
          <p>
            <strong>What we NEVER measure:</strong> The actual generated strings, passwords, passphrases, master keys, user IP addresses, or personal identifiers. Any telemetry emitted strictly excludes payload content.
          </p>
        </section>

        {/* Section 3 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">3</span>
            <span>Cookies and Local Storage</span>
          </h3>
          <p>
            LeastPass uses minimal storage technologies:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Session Cookies:</strong> Used exclusively for administrative portal sessions (<code className="bg-[#edf5ef] text-[#080f0f] px-1.5 py-0.5 rounded font-mono text-xs">next-auth.session-token</code>) when an administrator explicitly signs into <code className="bg-[#edf5ef] text-[#080f0f] px-1.5 py-0.5 rounded font-mono text-xs">/admin</code>. Public visitors do not receive tracking session cookies.</li>
            <li><strong>Local State:</strong> Local user preferences (such as selected password length or symbol checkboxes) are stored in client-side memory during your visit.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">4</span>
            <span>Third-Party Links & Creator Support</span>
          </h3>
          <p>
            LeastPass features direct links to external services including GitHub, Ko-fi (<code className="bg-[#edf5ef] text-[#080f0f] px-1.5 py-0.5 rounded font-mono text-xs">ko-fi.com/neerajrekwar2001</code>), and developer portfolios. When you navigate to an external website, their respective privacy policies and terms govern your data.
          </p>
        </section>

        {/* Section 5 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">5</span>
            <span>Compliance: GDPR & CCPA</span>
          </h3>
          <p>
            Because LeastPass does not collect, sell, or retain personal information, your rights under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA) are preserved by default architecture. You maintain full data sovereignty.
          </p>
        </section>

        {/* Section 6 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">6</span>
            <span>Contact & Inquiries</span>
          </h3>
          <p>
            If you have questions regarding this Privacy Policy or security practices, contact the maintainer:
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#080f0f]">
            <a
              href="mailto:dev.neerajrekwar@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#547e5d] hover:underline"
            >
              <Mail className="w-4 h-4 text-[#86ba90]" />
              <span>dev.neerajrekwar@gmail.com</span>
            </a>
            <a
              href="https://github.com/devneeraj77/leastpass/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#547e5d] hover:underline"
            >
              <Globe className="w-4 h-4 text-[#86ba90]" />
              <span>GitHub Security Issues</span>
            </a>
          </div>
        </section>
      </div>

      {/* Back button */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-btn text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Return to Password Generator</span>
        </Link>
      </div>
    </div>
  );
}
