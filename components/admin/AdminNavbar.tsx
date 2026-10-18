"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ShieldCheck,
  LayoutDashboard,
  PlusCircle,
  ExternalLink,
  LogOut,
  User,
  BookOpen,
} from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f8fbf9]/90 backdrop-blur-md border-b border-[#86ba90]/25 px-4 lg:px-8 py-3 mb-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-2xl clay-btn flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg text-[#080f0f] tracking-tight group-hover:text-[#547e5d] transition-colors">
                LeastPass
              </span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#86ba90]/20 text-[#3b5240] text-[10px] font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
          </Link>

          <div className="hidden md:block h-5 w-[1px] bg-[#86ba90]/30 mx-2" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/admin/dashboard"
                  ? "bg-[#86ba90] text-white shadow-sm"
                  : "text-[#3b5240] hover:text-[#080f0f] hover:bg-white/60"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/posts/create"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === "/admin/posts/create"
                  ? "bg-[#86ba90] text-white shadow-sm"
                  : "text-[#3b5240] hover:text-[#080f0f] hover:bg-white/60"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Post</span>
            </Link>

            <Link
              href="/blog"
              target="_blank"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#3b5240] hover:text-[#080f0f] hover:bg-white/60 transition-all flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Live Blog</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#6b9774]" />
            </Link>
          </nav>
        </div>

        {/* Right: User & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#6b9774] hover:text-[#080f0f] transition-colors"
          >
            <span>Main App</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* User profile capsule */}
          <div className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl clay-well bg-white/80 border border-[#86ba90]/25 text-xs">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#86ba90] to-[#547e5d] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-[#080f0f] text-[11px] leading-tight">
                {session?.user?.name || "Neeraj Rekwar"}
              </div>
              <div className="text-[10px] text-[#6b9774] leading-tight">
                Administrator
              </div>
            </div>
          </div>

          {/* Sign Out CTA */}
          <button
            type="button"
            onClick={handleSignOut}
            className="p-2 sm:px-3 sm:py-2 rounded-xl clay-btn-subtle text-[#ff5e5b] hover:text-[#d32f2f] hover:bg-[#ffebee] transition-all flex items-center gap-1.5 text-xs font-bold"
            title="Sign Out of Admin Console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
