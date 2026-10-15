import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { Inter} from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: "400",
});


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "LeastPass - Secure Password Generator",
  description: "Generate unique, customizable, and secure passwords with ease using LeastPass.",
  openGraph: {
    title: "LeastPass - Secure Password Generator",
    description: "Generate unique, customizable, and secure passwords with ease using LeastPass.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} text-[#080f0f] bg-[#fffcff] antialiased min-h-screen flex flex-col justify-between`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
