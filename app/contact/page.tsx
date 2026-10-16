"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Send, Github, Globe, Coffee, Check, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate real client submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast({
        title: "Message Received!",
        description: "Thank you for reaching out. Neeraj will respond shortly.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b9774] mb-8">
        <Link href="/" className="hover:text-[#080f0f] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#080f0f]">Contact</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <MessageSquare className="w-3.5 h-3.5 text-[#86ba90]" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#080f0f] mb-4">
          Contact Developer Neeraj Rekwar
        </h1>
        <p className="text-base sm:text-lg text-[#6b9774] max-w-xl mx-auto leading-relaxed">
          Have feedback on LeastPass, feature requests, or inquiries about custom software engineering? Let&apos;s connect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info Card */}
        <div className="md:col-span-5 clay-card p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#080f0f] mb-2">
              Direct Channels
            </h2>
            <p className="text-xs text-[#3b5240] leading-relaxed">
              Feel free to send a direct email, ping me on GitHub, or support the project on Ko-fi.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="mailto:dev.neerajrekwar@gmail.com"
              className="flex items-center gap-3 p-3.5 rounded-2xl clay-well bg-white/70 hover:bg-white transition-colors"
            >
              <div className="w-9 h-9 rounded-xl clay-btn flex items-center justify-center text-white shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold text-[#6b9774] block uppercase">Email</span>
                <span className="text-xs font-semibold text-[#080f0f] truncate block">
                  dev.neerajrekwar@gmail.com
                </span>
              </div>
            </a>

            <a
              href="https://ko-fi.com/neerajrekwar2001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl clay-well bg-white/70 hover:bg-white transition-colors"
            >
              <div className="w-9 h-9 rounded-xl clay-btn-coffee flex items-center justify-center text-white shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6b9774] block uppercase">Support On Ko-fi</span>
                <span className="text-xs font-semibold text-[#080f0f]">
                  ko-fi.com/neerajrekwar2001
                </span>
              </div>
            </a>

            <a
              href="https://github.com/devneeraj77"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl clay-well bg-white/70 hover:bg-white transition-colors"
            >
              <div className="w-9 h-9 rounded-xl clay-btn-subtle flex items-center justify-center text-[#080f0f] shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6b9774] block uppercase">GitHub</span>
                <span className="text-xs font-semibold text-[#080f0f]">
                  github.com/devneeraj77
                </span>
              </div>
            </a>

            <a
              href="https://neerajrekwar.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl clay-well bg-white/70 hover:bg-white transition-colors"
            >
              <div className="w-9 h-9 rounded-xl clay-btn-subtle flex items-center justify-center text-[#080f0f] shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6b9774] block uppercase">Portfolio</span>
                <span className="text-xs font-semibold text-[#080f0f]">
                  neerajrekwar.github.io
                </span>
              </div>
            </a>
          </div>

          <div className="pt-4 border-t border-[#86ba90]/25 text-xs text-[#6b9774]">
            ⚡ Typically responds within 24 hours.
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="md:col-span-7 clay-card p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#080f0f] mb-4">
            Send a Direct Message
          </h2>

          {isSent ? (
            <div className="p-6 rounded-2xl clay-well bg-[#eaf4ed] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#86ba90] text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#080f0f]">
                Message Delivered!
              </h3>
              <p className="text-xs text-[#3b5240] max-w-sm mx-auto">
                Thank you for your note. I appreciate your input and will get back to your email as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="mt-2 px-4 py-2 rounded-xl clay-btn-subtle text-xs font-bold text-[#080f0f]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clay-well bg-white border border-[#86ba90]/30 text-sm text-[#080f0f] focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="maya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clay-well bg-white border border-[#86ba90]/30 text-sm text-[#080f0f] focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Feature request / Collaboration / Feedback"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clay-well bg-white border border-[#86ba90]/30 text-sm text-[#080f0f] focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me what's on your mind..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clay-well bg-white border border-[#86ba90]/30 text-sm text-[#080f0f] focus:outline-none focus:ring-2 focus:ring-[#86ba90] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl clay-btn text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Neeraj</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
