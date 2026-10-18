import type { Metadata } from "next";
import SessionWrapper from "@/components/admin/SessionWrapper";

export const metadata: Metadata = {
  title: "Admin Console | LeastPass",
  description: "Secure administrative management portal for LeastPass blog posts and settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <div className="min-h-screen bg-[#f8fbf9] text-[#080f0f]">
        {children}
      </div>
    </SessionWrapper>
  );
}
