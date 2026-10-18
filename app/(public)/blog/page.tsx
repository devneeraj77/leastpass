import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Password Security & Cryptography Blog",
  description:
    "In-depth articles on password entropy, the mathematics of Diceware passphrases, CSPRNG hardware entropy, and modern authentication security.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Password Security & Cryptography Blog | LeastPass",
    description:
      "Explore articles on Shannon entropy, Diceware multi-word passphrases, and offline Web Crypto API security.",
    url: "/blog",
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b9774] mb-8">
        <Link href="/" className="hover:text-[#080f0f] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#080f0f]">Blog & Guides</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <BookOpen className="w-3.5 h-3.5 text-[#86ba90]" />
          <span>Security Education & Research</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#080f0f] mb-4">
          Cryptography & Password Insights
        </h1>
        <p className="text-base sm:text-lg text-[#6b9774] max-w-2xl mx-auto leading-relaxed">
          Evidence-based guides on information entropy, password strength math, and client-side web cryptography.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#edf5ef] border border-[#86ba90]/30 text-xs text-[#3b5240]">
          <Sparkles className="w-3.5 h-3.5 text-[#86ba90]" />
          <span>Modular data architecture · Zero tracking payload</span>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="clay-card p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200"
          >
            <div>
              {/* Category & Time */}
              <div className="flex items-center justify-between text-xs text-[#6b9774] font-semibold mb-3">
                <span className="text-[#3b5240]">{post.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-[#080f0f] leading-snug mb-3 hover:text-[#86ba90] transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-xs text-[#3b5240] leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[#86ba90]/20 flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#86ba90] text-white flex items-center justify-center text-[10px] font-bold">
                  {post.author.avatar}
                </div>
                <span className="text-xs font-semibold text-[#080f0f]">
                  {post.author.name}
                </span>
              </div>

              {/* Read Action */}
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#86ba90] hover:text-[#547e5d]"
              >
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Return to generator CTA */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-r from-[#f6faf7] to-[#eaf5ed] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-base font-bold text-[#080f0f]">
            Ready to test these security principles?
          </h3>
          <p className="text-xs text-[#6b9774]">
            Generate your uncrackable password or memorable passphrase now.
          </p>
        </div>
        <Link
          href="/"
          className="py-3 px-6 rounded-2xl clay-btn text-white font-bold text-xs shrink-0"
        >
          Open Generator
        </Link>
      </div>
    </div>
  );
}
