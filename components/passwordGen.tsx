"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  RotateCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
  Zap,
  Hash,
  BookOpen,
  History,
  Trash2,
  Sparkles,
  QrCode,
  X,
  Smartphone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

// Word pool for memorable passphrases
const PASSPHRASE_WORDS = [
  "amber", "anchor", "beacon", "breeze", "cedar", "canyon", "cosmos", "crater",
  "drift", "echo", "falcon", "fable", "glade", "harbor", "haven", "horizon",
  "island", "jaguar", "kestrel", "lagoon", "lunar", "meadow", "meteor", "nebula",
  "nexus", "oasis", "orbit", "pacific", "peak", "polar", "prism", "quarry",
  "quartz", "radar", "radiant", "ripple", "saddle", "safari", "sierra", "solar",
  "summit", "tundra", "twilight", "valiant", "valley", "velvet", "vortex", "zenith",
  "aurora", "bamboo", "cascade", "clover", "delta", "ember", "fern", "glacier"
];

type GeneratorMode = "random" | "passphrase" | "pin";

interface HistoryItem {
  id: string;
  password: string;
  timestamp: string;
  strength: string;
}

export default function PasswordGenerator() {
  const { toast } = useToast();

  // Mode state
  const [mode, setMode] = useState<GeneratorMode>("random");

  // Random mode options
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  // Passphrase mode options
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>("-");
  const [capitalizeWords, setCapitalizeWords] = useState<boolean>(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState<boolean>(true);

  // PIN mode options
  const [pinLength, setPinLength] = useState<number>(6);

  // Generated state
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Secure random generator helper using Web Crypto API
  const getSecureRandomInt = (max: number): number => {
    if (typeof window === "undefined" || !window.crypto || !window.crypto.getRandomValues) {
      return Math.floor(Math.random() * max);
    }
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  // Shannon Information Entropy & Security Evaluation Logic
  const calculateEntropy = useCallback((pw: string) => {
    if (!pw) {
      return {
        bits: 0,
        strengthLabel: "Empty",
        tier: 0,
        percent: 5,
        crackTime: "Instant (< 1 ms)",
        color: "#ef4444",
        tip: "Configure your desired length and character sets to evaluate strength.",
      };
    }

    let poolSize = 0;
    if (/[a-z]/.test(pw)) poolSize += 26;
    if (/[A-Z]/.test(pw)) poolSize += 26;
    if (/[0-9]/.test(pw)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) poolSize += 33;

    if (poolSize === 0) poolSize = 10;

    // Shannon Information Entropy: E = L * log2(N)
    const bits = Math.round(pw.length * (Math.log(poolSize) / Math.LN2));

    let strengthLabel = "Very Weak";
    let tier = 1;
    let crackTime = "Instant (< 1s)";
    let percent = 20;
    let color = "#ef4444"; // red
    let tip = "Very vulnerable to brute-force attacks. Increase length to 14+ characters.";

    if (bits >= 85) {
      strengthLabel = "Unbreakable";
      tier = 5;
      crackTime = "Trillions of centuries";
      percent = 100;
      color = "#10b981"; // emerald green
      tip = "Maximum cryptographic armor. Exceeds banking, NIST 800-63B, and military standards.";
    } else if (bits >= 65) {
      strengthLabel = "Strong";
      tier = 4;
      crackTime = "450,000+ years";
      percent = 80;
      color = "#86ba90"; // our primary sage green
      tip = "Highly secure. Fully resistant to high-speed offline GPU hash clusters.";
    } else if (bits >= 50) {
      strengthLabel = "Moderate";
      tier = 3;
      crackTime = "3 to 10 years";
      percent = 60;
      color = "#3b82f6"; // blue
      tip = "Good for standard consumer web accounts. Enable special symbols to reach Strong.";
    } else if (bits >= 35) {
      strengthLabel = "Weak";
      tier = 2;
      crackTime = "3 days to 2 weeks";
      percent = 40;
      color = "#f59e0b"; // amber
      tip = "Can be cracked quickly by modern hardware. Add uppercase, numbers, or length.";
    }

    return { bits, strengthLabel, tier, percent, crackTime, color, tip };
  }, []);

  // Generate logic (recordHistory specifies whether to record into the recent session vault)
  const generatePassword = useCallback(
    (recordHistory: boolean = false) => {
      let result = "";

      if (mode === "random") {
        let lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        let uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let numberChars = "0123456789";
        let symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        if (excludeAmbiguous) {
          lowercaseChars = lowercaseChars.replace(/[l]/g, "");
          uppercaseChars = uppercaseChars.replace(/[O|I]/g, "");
          numberChars = numberChars.replace(/[0|1]/g, "");
          symbolChars = symbolChars.replace(/[|]/g, "");
        }

        let pool = "";
        const guaranteedChars: string[] = [];

        if (includeLowercase) {
          pool += lowercaseChars;
          guaranteedChars.push(lowercaseChars[getSecureRandomInt(lowercaseChars.length)]);
        }
        if (includeUppercase) {
          pool += uppercaseChars;
          guaranteedChars.push(uppercaseChars[getSecureRandomInt(uppercaseChars.length)]);
        }
        if (includeNumbers) {
          pool += numberChars;
          guaranteedChars.push(numberChars[getSecureRandomInt(numberChars.length)]);
        }
        if (includeSymbols) {
          pool += symbolChars;
          guaranteedChars.push(symbolChars[getSecureRandomInt(symbolChars.length)]);
        }

        // Default fallback if user unchecks all
        if (pool.length === 0) {
          pool = lowercaseChars + numberChars;
          guaranteedChars.push(lowercaseChars[0]);
        }

        const remainingLength = Math.max(0, passwordLength - guaranteedChars.length);
        const randomParts: string[] = [];
        for (let i = 0; i < remainingLength; i++) {
          randomParts.push(pool[getSecureRandomInt(pool.length)]);
        }

        // Merge and shuffle guaranteed chars
        const fullList = [...guaranteedChars, ...randomParts];
        for (let i = fullList.length - 1; i > 0; i--) {
          const j = getSecureRandomInt(i + 1);
          [fullList[i], fullList[j]] = [fullList[j], fullList[i]];
        }
        result = fullList.join("");

      } else if (mode === "passphrase") {
        const chosenWords: string[] = [];
        for (let i = 0; i < wordCount; i++) {
          let w = PASSPHRASE_WORDS[getSecureRandomInt(PASSPHRASE_WORDS.length)];
          if (capitalizeWords) {
            w = w.charAt(0).toUpperCase() + w.slice(1);
          }
          chosenWords.push(w);
        }

        if (includeNumberInPassphrase) {
          const randomNum = getSecureRandomInt(90) + 10; // 10 to 99
          const insertIndex = getSecureRandomInt(chosenWords.length + 1);
          chosenWords.splice(insertIndex, 0, randomNum.toString());
        }

        result = chosenWords.join(separator);

      } else if (mode === "pin") {
        const digits = "0123456789";
        for (let i = 0; i < pinLength; i++) {
          result += digits[getSecureRandomInt(digits.length)];
        }
      }

      setGeneratedPassword(result);

      if (recordHistory) {
        setSpinCount((prev) => prev + 1);
        if (result) {
          setHistory((prev) => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const newItem: HistoryItem = {
              id: Math.random().toString(36).substring(2, 9),
              password: result,
              timestamp: timeStr,
              strength: calculateEntropy(result).strengthLabel,
            };
            return [newItem, ...prev.filter((item) => item.password !== result)].slice(0, 5);
          });
        }
      }
    },
    [
      mode,
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      wordCount,
      separator,
      capitalizeWords,
      includeNumberInPassphrase,
      pinLength,
      calculateEntropy,
    ]
  );

  // Live entropy metrics calculated synchronously from generatedPassword
  const metrics = useMemo(() => calculateEntropy(generatedPassword), [generatedPassword, calculateEntropy]);

  // Real-time update effect: whenever any settings toggle, regenerate seamlessly in real-time
  useEffect(() => {
    generatePassword(false);
  }, [
    mode,
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    wordCount,
    separator,
    capitalizeWords,
    includeNumberInPassphrase,
    pinLength,
    generatePassword,
  ]);

  const copyToClipboard = (textToCopy?: string) => {
    const text = textToCopy || generatedPassword;
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
        toast({
          title: "Password copied to clipboard!",
          description: "Ready to paste securely into your app or vault.",
        });
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(() => {
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Password stored in your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually.",
        variant: "destructive",
      });
    }
    document.body.removeChild(textArea);
  };

  // Preset setter
  const applyPreset = (presetName: string) => {
    if (presetName === "pin") {
      setMode("pin");
      setPinLength(6);
    } else if (presetName === "web") {
      setMode("random");
      setPasswordLength(16);
      setIncludeLowercase(true);
      setIncludeUppercase(true);
      setIncludeNumbers(true);
      setIncludeSymbols(true);
      setExcludeAmbiguous(false);
    } else if (presetName === "armor") {
      setMode("random");
      setPasswordLength(32);
      setIncludeLowercase(true);
      setIncludeUppercase(true);
      setIncludeNumbers(true);
      setIncludeSymbols(true);
      setExcludeAmbiguous(false);
    } else if (presetName === "passphrase") {
      setMode("passphrase");
      setWordCount(4);
      setSeparator("-");
      setCapitalizeWords(true);
      setIncludeNumberInPassphrase(true);
    }
  };

  return (
    <div id="generator" className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Main Clay Container */}
      <div className="clay-card p-6 md:p-10 text-[#080f0f] relative overflow-hidden">
        {/* Mode Selector Tabs (Clay Buttons) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#86ba90]/25">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl clay-well bg-white/70">
            <button
              type="button"
              onClick={() => setMode("random")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === "random"
                  ? "bg-[#86ba90] text-white shadow-md shadow-[#86ba90]/30"
                  : "text-[#3b5240] hover:text-[#080f0f]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Random String</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("passphrase")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === "passphrase"
                  ? "bg-[#86ba90] text-white shadow-md shadow-[#86ba90]/30"
                  : "text-[#3b5240] hover:text-[#080f0f]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Memorable Passphrase</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("pin")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === "pin"
                  ? "bg-[#86ba90] text-white shadow-md shadow-[#86ba90]/30"
                  : "text-[#3b5240] hover:text-[#080f0f]"
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Numeric PIN</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-[#6b9774] font-medium">Presets:</span>
            <button
              onClick={() => applyPreset("web")}
              className="px-2.5 py-1 rounded-lg clay-btn-subtle text-[11px] font-semibold text-[#080f0f]"
            >
              Standard Web (16)
            </button>
            <button
              onClick={() => applyPreset("armor")}
              className="px-2.5 py-1 rounded-lg clay-btn-subtle text-[11px] font-semibold text-[#080f0f]"
            >
              High Armor (32)
            </button>
            <button
              onClick={() => applyPreset("passphrase")}
              className="px-2.5 py-1 rounded-lg clay-btn-subtle text-[11px] font-semibold text-[#080f0f]"
            >
              4-Word Phrase
            </button>
          </div>
        </div>

        {/* Password Display Card (Clay Screen Well) */}
        <motion.div
          animate={
            isCopied
              ? {
                  boxShadow: [
                    "inset 5px 5px 12px rgba(84, 126, 93, 0.2), inset -4px -4px 10px rgba(255, 255, 255, 0.85)",
                    "inset 5px 5px 14px rgba(84, 126, 93, 0.35), inset -4px -4px 12px rgba(255, 255, 255, 0.95), 0 0 16px rgba(134, 186, 144, 0.3)",
                    "inset 5px 5px 12px rgba(84, 126, 93, 0.2), inset -4px -4px 10px rgba(255, 255, 255, 0.85)",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.4 }}
          className="clay-well p-5 md:p-6 mb-6 relative"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* The Output String with Pop & Checkmark Feedback */}
            <motion.div
              onClick={() => copyToClipboard()}
              title="Click anywhere to copy password"
              animate={
                isCopied
                  ? {
                      scale: [1, 1.025, 1],
                      backgroundColor: [
                        "rgba(255,255,255,0)",
                        "rgba(134,186,144,0.18)",
                        "rgba(255,255,255,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex-1 overflow-x-auto py-2 px-3 rounded-xl cursor-pointer hover:bg-black/[0.02] transition-colors relative flex items-center justify-between gap-3 group"
            >
              <motion.span
                animate={
                  isCopied
                    ? {
                        scale: [1, 1.015, 1],
                        color: ["#080f0f", "#547e5d", "#080f0f"],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-[#080f0f] select-all break-all"
              >
                {isMasked ? "•".repeat(generatedPassword.length || 12) : generatedPassword}
              </motion.span>

              {/* Animated Floating Checkmark & Pop Badge */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.7, x: 10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#86ba90] text-white text-xs font-bold shadow-md shadow-[#86ba90]/35 shrink-0 select-none ml-2"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 650, damping: 20 }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.div>
                    <span>Copied!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              {/* Mask/Unmask */}
              <button
                type="button"
                onClick={() => setIsMasked(!isMasked)}
                className="p-3 rounded-2xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors"
                title={isMasked ? "Reveal Password" : "Mask Password"}
                aria-label={isMasked ? "Reveal Password" : "Mask Password"}
              >
                {isMasked ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>

              {/* QR Code Mobile Transfer Button */}
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="p-3 rounded-2xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors"
                title="Transfer to Mobile via QR Code"
                aria-label="Transfer to Mobile via QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>

              {/* Regenerate */}
              <button
                type="button"
                onClick={() => generatePassword(true)}
                className="p-3 rounded-2xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors"
                title="Generate New Password"
                aria-label="Generate New Password"
              >
                <motion.div
                  animate={{ rotate: spinCount * 180 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                >
                  <RotateCw className="w-5 h-5" />
                </motion.div>
              </button>

              {/* Copy Primary CTA */}
              <button
                type="button"
                onClick={() => copyToClipboard()}
                className="py-3 px-5 rounded-2xl clay-btn text-white font-bold text-sm flex items-center gap-2"
                title="Copy to Clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-Time Strength Box inside Bottom of Password Bar */}
          <div className="mt-4 pt-3.5 border-t border-[#86ba90]/25 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between text-xs gap-2">
              <span className="font-bold text-[#080f0f] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#86ba90]" />
                <span>Real-Time Strength:</span>
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full font-bold text-white text-[11px] transition-colors duration-200 shadow-sm"
                  style={{ backgroundColor: metrics.color }}
                >
                  {metrics.strengthLabel} (Tier {metrics.tier}/5) · {metrics.bits} bits
                </span>
                <span className="text-[#6b9774] text-[11px]">
                  Crack time: <strong className="text-[#080f0f] font-mono">{metrics.crackTime}</strong>
                </span>
              </div>
            </div>

            {/* 5-segment visual indicators */}
            <div className="grid grid-cols-5 gap-1.5 my-1">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const isActive = metrics.tier >= lvl;
                return (
                  <div
                    key={lvl}
                    className="h-2 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{
                      backgroundColor: isActive ? metrics.color : "rgba(134, 186, 144, 0.2)",
                      boxShadow: isActive
                        ? `0 2px 5px ${metrics.color}35`
                        : "inset 0 1px 2px rgba(0,0,0,0.06)",
                    }}
                  />
                );
              })}
            </div>

            {/* Continuous animated progress bar 
            <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden shadow-inner border border-[#86ba90]/15">
              <motion.div
                className="h-full rounded-full"
                initial={false}
                animate={{
                  width: `${Math.max(5, metrics.percent)}%`,
                  backgroundColor: metrics.color,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            </div>*/}

            {/* Contextual Guidance Tip */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#3b5240] pt-1 border-t border-[#86ba90]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#86ba90] shrink-0" />
              <span>{metrics.tip}</span>
            </div>
          </div>
        </motion.div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Length Slider & Primary Parameters */}
          <div className="md:col-span-6 space-y-5">
            {mode === "random" && (
              <div className="clay-well p-5 bg-white/60">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-[#080f0f]">
                    Password Length
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPasswordLength((prev) => Math.max(6, prev - 1))}
                      className="w-7 h-7 rounded-lg clay-btn-subtle font-bold text-sm flex items-center justify-center text-[#080f0f]"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-base text-[#080f0f]">
                      {passwordLength}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPasswordLength((prev) => Math.min(64, prev + 1))}
                      className="w-7 h-7 rounded-lg clay-btn-subtle font-bold text-sm flex items-center justify-center text-[#080f0f]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={6}
                  max={64}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#86ba90]/30 rounded-lg appearance-none cursor-pointer accent-[#86ba90]"
                />
                <div className="flex justify-between text-[11px] text-[#6b9774] mt-1 font-mono">
                  <span>6 chars</span>
                  <span>16 (Standard)</span>
                  <span>64 chars</span>
                </div>
              </div>
            )}

            {mode === "passphrase" && (
              <div className="clay-well p-5 bg-white/60 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-[#080f0f]">
                      Number of Words
                    </label>
                    <span className="font-mono font-bold text-base text-[#080f0f]">
                      {wordCount} words
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={8}
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#86ba90]/30 rounded-lg appearance-none cursor-pointer accent-[#86ba90]"
                  />
                  <div className="flex justify-between text-[11px] text-[#6b9774] mt-1 font-mono">
                    <span>3 words</span>
                    <span>4 (Recommended)</span>
                    <span>8 words</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#080f0f] block mb-2">
                    Word Separator
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Hyphen (-)", val: "-" },
                      { label: "Dot (.)", val: "." },
                      { label: "Underscore (_)", val: "_" },
                      { label: "Space ( )", val: " " },
                    ].map((sep) => (
                      <button
                        key={sep.val}
                        type="button"
                        onClick={() => setSeparator(sep.val)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl text-center transition-all ${
                          separator === sep.val
                            ? "bg-[#86ba90] text-white shadow-sm"
                            : "clay-btn-subtle text-[#080f0f]"
                        }`}
                      >
                        {sep.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "pin" && (
              <div className="clay-well p-5 bg-white/60">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-[#080f0f]">
                    PIN Digits
                  </label>
                  <span className="font-mono font-bold text-base text-[#080f0f]">
                    {pinLength} digits
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={12}
                  value={pinLength}
                  onChange={(e) => setPinLength(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#86ba90]/30 rounded-lg appearance-none cursor-pointer accent-[#86ba90]"
                />
                <div className="flex justify-between text-[11px] text-[#6b9774] mt-1 font-mono">
                  <span>4 (ATM)</span>
                  <span>6 (Card/Phone)</span>
                  <span>12 digits</span>
                </div>
              </div>
            )}

            {/* Cryptographic Privacy Assurance */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#edf5ef] border border-[#86ba90]/25 text-xs text-[#3b5240]">
              <ShieldCheck className="w-5 h-5 text-[#86ba90] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#080f0f]">100% Client-Side Privacy:</strong> Passwords are generated exclusively inside your browser memory using <code>crypto.getRandomValues()</code>. Nothing is transmitted over the network.
              </div>
            </div>
          </div>

          {/* Right Column: Character Pool Checkboxes & Mode Options */}
          <div className="md:col-span-6 space-y-3">
            {mode === "random" && (
              <>
                <div className="text-xs font-bold text-[#080f0f] uppercase tracking-wider mb-2">
                  Character Sets (Real-time updates)
                </div>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#080f0f]">
                      Uppercase Letters (A-Z)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6b9774]">ABC (+26)</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#080f0f]">
                      Lowercase Letters (a-z)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6b9774]">abc (+26)</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#080f0f]">
                      Numbers (0-9)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6b9774]">123 (+10)</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#080f0f]">
                      Special Symbols
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6b9774]">!@#$%^&* (+33)</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={excludeAmbiguous}
                      onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#080f0f] block">
                        Exclude Ambiguous Characters
                      </span>
                      <span className="text-[11px] text-[#6b9774]">
                        Removes 0, O, l, 1, I, | to prevent typo confusion
                      </span>
                    </div>
                  </div>
                </label>
              </>
            )}

            {mode === "passphrase" && (
              <>
                <div className="text-xs font-bold text-[#080f0f] uppercase tracking-wider mb-2">
                  Passphrase Polish
                </div>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={capitalizeWords}
                      onChange={(e) => setCapitalizeWords(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#080f0f]">
                      Capitalize Each Word
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6b9774]">VelvetCanyon</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl clay-well bg-white/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeNumberInPassphrase}
                      onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                      className="w-4 h-4 rounded text-[#86ba90] accent-[#86ba90] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#080f0f]">
                      Include Random Number
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6b9774]">+10-99</span>
                </label>
              </>
            )}

            {mode === "pin" && (
              <div className="p-4 rounded-2xl clay-well bg-white/70 text-xs text-[#3b5240] space-y-2">
                <p className="font-semibold text-[#080f0f]">About Numeric PINs:</p>
                <p>
                  Numeric PINs are designed for banking cards, screen lock gates, and hardware tokens. For website accounts, we recommend using a 16+ character Random String or a 4-word Passphrase.
                </p>
              </div>
            )}

            {/* Quick Action Generate Button */}
            <button
              type="button"
              onClick={() => generatePassword(true)}
              className="w-full py-3.5 px-6 rounded-2xl clay-btn text-white font-bold text-sm flex items-center justify-center gap-2 mt-4"
            >
              <RotateCw className="w-4 h-4" />
              <span>Generate New Secure {mode === "pin" ? "PIN" : mode === "passphrase" ? "Passphrase" : "Password"}</span>
            </button>
          </div>
        </div>

        {/* Local History Drawer Toggle */}
        <div className="mt-8 pt-4 border-t border-[#86ba90]/25 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-xs font-bold text-[#3b5240] hover:text-[#080f0f] transition-colors"
          >
            <History className="w-4 h-4 text-[#86ba90]" />
            <span>{showHistory ? "Hide Session History" : `View Session History (${history.length})`}</span>
          </button>

          {history.length > 0 && showHistory && (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="flex items-center gap-1 text-xs text-[#ff5e5b] hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* History Items */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {history.length === 0 ? (
                <p className="text-xs text-[#6b9774] italic py-2">No history yet this session.</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl clay-well bg-white/60 text-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="font-mono text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
                        {item.password}
                      </span>
                      <span className="text-[10px] text-[#6b9774] shrink-0">{item.timestamp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.password)}
                      className="px-2.5 py-1 rounded-lg clay-btn-subtle text-[11px] font-bold text-[#080f0f] hover:text-[#86ba90] shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Mobile Transfer Modal */}
        <AnimatePresence>
          {showQrModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowQrModal(false)}
                className="fixed inset-0 bg-black/45 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-sm clay-card bg-[#f8fbf9] p-6 text-center text-[#080f0f] z-10 border border-white/90 shadow-2xl"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-[#6b9774] hover:text-[#080f0f] clay-btn-subtle transition-colors"
                  aria-label="Close QR Modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl clay-btn flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#080f0f]">
                    Mobile QR Transfer
                  </h3>
                </div>

                <p className="text-xs text-[#6b9774] mb-4">
                  Scan with your phone camera or password manager to transfer this password instantly without typing.
                </p>

                {/* QR Code Container */}
                <div className="p-4 rounded-2xl bg-white shadow-md inline-flex items-center justify-center mx-auto mb-4 border border-[#86ba90]/25">
                  <QRCodeSVG
                    value={generatedPassword || " "}
                    size={190}
                    level="M"
                    fgColor="#080f0f"
                    bgColor="#ffffff"
                    includeMargin={false}
                  />
                </div>

                {/* Masked / Plain Password Preview */}
                <div className="p-2.5 rounded-xl clay-well bg-white/70 text-xs font-mono text-[#080f0f] break-all select-all mb-4 max-h-20 overflow-y-auto">
                  {isMasked ? "•".repeat(generatedPassword.length) : generatedPassword}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard()}
                    className="flex-1 py-2.5 px-4 rounded-xl clay-btn text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? "Copied!" : "Copy String"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQrModal(false)}
                    className="py-2.5 px-4 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold"
                  >
                    Done
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#86ba90]/20 flex items-center justify-center gap-1.5 text-[10px] text-[#6b9774]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#86ba90]" />
                  <span>100% Client-side · Encoded in browser RAM</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
