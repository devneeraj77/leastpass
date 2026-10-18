"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/components/admin/AdminNavbar";
import TipTapEditor from "@/components/admin/TipTapEditor";
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Tag,
  Clock,
  Layers,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState<string>("" );
  const [slug, setSlug] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Cryptography & Math");
  const [readTime, setReadTime] = useState<string>("5 min read");
  const [excerpt, setExcerpt] = useState<string>("");
  const [tags, setTags] = useState<string>("Security, Entropy, Cryptography");
  const [authorName, setAuthorName] = useState<string>("Neeraj Rekwar");
  const [authorRole, setAuthorRole] = useState<string>("Creator of LeastPass");
  const [content, setContent] = useState<string>(
    "<h3>Introduction</h3><p>Start writing your new cryptographic guide, authentication tutorial, or information entropy breakdown here using the rich TipTap toolbar above...</p>"
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Auto slug generation from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const generatedSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]+/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim() || !slug.trim()) {
      setErrorMessage("Please provide both an article title and a URL slug.");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      setErrorMessage("Please write some content for the article.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          subtitle: subtitle.trim(),
          category,
          readTime,
          excerpt: excerpt.trim() || subtitle.trim() || title.trim(),
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          author: {
            name: authorName.trim(),
            role: authorRole.trim(),
            avatar: "NR",
          },
          content,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create publication");
      }

      const created = await res.json();
      toast({
        title: "Article Published!",
        description: `"${created.title}" is now published and indexed.`,
      });

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish article.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <AdminNavbar />

      <main className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b9774] hover:text-[#080f0f] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-btn-subtle text-xs font-bold text-[#080f0f]"
          >
            <Eye className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>{showPreview ? "Hide Live Preview" : "Show Live Preview"}</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
            <Sparkles className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>TipTap Rich Authoring Suite</span>
          </div>
          <h1 className="text-3xl font-black text-[#080f0f] tracking-tight">
            Create New Blog Publication
          </h1>
          <p className="text-xs sm:text-sm text-[#6b9774] mt-1">
            Author educational articles on cryptography, password math, and browser security.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-semibold">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Card */}
          <div className="clay-card p-6 bg-white/95 space-y-5 border border-[#86ba90]/25 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#080f0f] flex items-center gap-2 border-b border-[#86ba90]/20 pb-3">
              <FileText className="w-4 h-4 text-[#86ba90]" />
              <span>Article Metadata & Taxonomy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. The Cryptographic Anatomy of Password Hashing Algorithms"
                  className="w-full px-4 py-2.5 rounded-xl clay-well bg-white text-sm font-bold text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl clay-well bg-white border border-[#86ba90]/30 overflow-hidden px-3 py-2">
                  <span className="text-xs font-mono text-[#6b9774] shrink-0">/blog/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="custom-article-slug"
                    className="w-full bg-transparent text-xs font-mono font-bold text-[#080f0f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#86ba90]" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl clay-well bg-white text-xs font-bold text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                >
                  <option value="Cryptography & Math">Cryptography & Math</option>
                  <option value="Usability & Security">Usability & Security</option>
                  <option value="Web Cryptography">Web Cryptography</option>
                  <option value="Authentication Standards">Authentication Standards</option>
                  <option value="Zero-Knowledge Privacy">Zero-Knowledge Privacy</option>
                  <option value="Developer Tutorials">Developer Tutorials</option>
                </select>
              </div>

              {/* Subtitle */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  Subtitle / Deck Line
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A clear 1-sentence synopsis that appears under the main heading..."
                  className="w-full px-4 py-2 rounded-xl clay-well bg-white text-xs text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Excerpt / Meta Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  Excerpt (SEO & Social Sharing Summary)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="2-3 sentence overview indexed by search engines and displayed on the blog card..."
                  className="w-full px-4 py-2 rounded-xl clay-well bg-white text-xs text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Reading Time */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#86ba90]" />
                  <span>Reading Time</span>
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className="w-full px-3.5 py-2 rounded-xl clay-well bg-white text-xs font-medium text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#86ba90]" />
                  <span>Tags (Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Security, Entropy, Math, WebCrypto"
                  className="w-full px-3.5 py-2 rounded-xl clay-well bg-white text-xs font-medium text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#86ba90]" />
                  <span>Author Name</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl clay-well bg-white text-xs font-medium text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Author Role */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  Author Role
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl clay-well bg-white text-xs font-medium text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>
            </div>
          </div>

          {/* TipTap Rich Text Editor Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[#080f0f]">
                Article Body (TipTap Rich Text Editor)
              </label>
              <span className="text-xs text-[#6b9774]">
                Supports headings, blockquotes, lists, links, inline code & source editing
              </span>
            </div>

            <TipTapEditor content={content} onChange={setContent} />
          </div>

          {/* Live Preview Drawer */}
          {showPreview && (
            <div className="clay-card p-6 md:p-8 bg-white border border-[#86ba90]/30 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#86ba90]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86ba90]">
                  Live Article Preview
                </span>
                <span className="text-xs text-[#6b9774]">
                  {readTime} · {category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#080f0f]">
                {title || "Untitled Article"}
              </h2>
              {subtitle && (
                <p className="text-sm text-[#3b5240] font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}

              <div
                className="prose prose-sm sm:prose-base max-w-none text-[#080f0f] leading-relaxed pt-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#86ba90]/25">
            <Link
              href="/admin/dashboard"
              className="py-3 px-5 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl clay-btn text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Article...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Blog Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
