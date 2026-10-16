import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Coffee, ArrowUpRight } from "lucide-react";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog-data";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title} | LeastPass`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@devneeraj77",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="w-full max-w-3xl mx-auto px-4 py-12">
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b9774] hover:text-[#080f0f] transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all articles</span>
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#86ba90] uppercase tracking-wider mb-3">
          <span>{post.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-[#6b9774]">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </span>
          <span>·</span>
          <span className="text-[#6b9774]">{post.date}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#080f0f] leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-[#3b5240] leading-relaxed mb-6 font-medium">
          {post.subtitle}
        </p>

        {/* Author Line */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#86ba90]/25">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#86ba90] to-[#547e5d] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {post.author.avatar}
          </div>
          <div>
            <div className="text-sm font-bold text-[#080f0f]">
              {post.author.name}
            </div>
            <div className="text-xs text-[#6b9774]">
              {post.author.role}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="clay-card p-6 md:p-10 mb-10 text-[#080f0f] leading-relaxed space-y-6 text-sm sm:text-base">
        {post.content.trim().split("\n\n").map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith("### ")) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#080f0f] pt-4 first:pt-0">
                {trimmed.replace("### ", "")}
              </h2>
            );
          }
          if (trimmed.startsWith("#### ")) {
            return (
              <h3 key={idx} className="text-lg font-bold text-[#3b5240] pt-2">
                {trimmed.replace("#### ", "")}
              </h3>
            );
          }
          if (trimmed.startsWith("|")) {
            // Render table lines
            const rows = trimmed.split("\n").filter(r => !r.includes("---"));
            return (
              <div key={idx} className="overflow-x-auto my-4">
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    {rows.map((row, rIdx) => {
                      const cells = row.split("|").filter(Boolean).map(c => c.trim());
                      return (
                        <tr key={rIdx} className={rIdx === 0 ? "font-bold border-b border-[#86ba90]/30" : "border-b border-[#86ba90]/15"}>
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 font-mono">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
          if (trimmed.startsWith("```")) {
            const code = trimmed.replace(/```[a-z]*/, "").replace(/```$/, "").trim();
            return (
              <pre key={idx} className="p-4 rounded-xl clay-well bg-[#101c18] text-[#98d6a3] font-mono text-xs overflow-x-auto">
                <code>{code}</code>
              </pre>
            );
          }
          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n- ").map(s => s.replace(/^- /, ""));
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 text-[#3b5240]">
                {items.map((item, iIdx) => (
                  <li key={iIdx}>{item}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[#3b5240] leading-relaxed">
              {trimmed}
            </p>
          );
        })}

        {/* Tags */}
        <div className="pt-6 border-t border-[#86ba90]/25 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-[#080f0f] mr-1">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg clay-badge text-xs font-medium text-[#3b5240]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Author Box & Support Neeraj on Ko-fi */}
      <div className="clay-card p-6 md:p-8 bg-gradient-to-br from-[#f8fbf9] to-[#edf6f0] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#86ba90] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            NR
          </div>
          <div>
            <h4 className="text-base font-bold text-[#080f0f]">
              Enjoyed this article by Neeraj?
            </h4>
            <p className="text-xs text-[#6b9774] max-w-sm mt-0.5">
              Support the independent development of LeastPass and educational security content on Ko-fi.
            </p>
          </div>
        </div>

        <a
          href="https://ko-fi.com/neerajrekwar2001"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-5 rounded-2xl clay-btn-coffee text-white text-xs font-bold flex items-center gap-2 shrink-0"
        >
          <Coffee className="w-4 h-4" />
          <span>Buy Neeraj a Coffee</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
