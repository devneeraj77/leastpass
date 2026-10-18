"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/components/admin/AdminNavbar";
import TipTapEditor from "@/components/admin/TipTapEditor";
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Eye,
  FileText,
  Clock,
  Tag,
  Layers,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params?.slug as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Cryptography & Math");
  const [readTime, setReadTime] = useState<string>("5 min read");
  const [excerpt, setExcerpt] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("Neeraj Rekwar");
  const [authorRole, setAuthorRole] = useState<string>("Creator of LeastPass");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (!slugParam) return;

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${slugParam}`);
        if (!res.ok) {
          throw new Error("Could not find article.");
        }
        const data = await res.json();
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setSubtitle(data.subtitle || "");
        setCategory(data.category || "Cryptography & Math");
        setReadTime(data.readTime || "5 min read");
        setExcerpt(data.excerpt || "");
        setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
        setAuthorName(data.author?.name || "Neeraj Rekwar");
        setAuthorRole(data.author?.role || "Creator of LeastPass");
        setContent(data.content || "");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load publication data.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slugParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Article title cannot be empty.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch(`/api/posts/${slugParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
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
        throw new Error(errorData.error || "Failed to update article.");
      }

      const updated = await res.json();
      toast({
        title: "Article Updated!",
        description: `Changes to "${updated.title}" have been saved.`,
      });

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update article.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${slugParam}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete publication.");
      }

      toast({
        title: "Article Deleted",
        description: `"${title}" has been deleted.`,
      });

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete publication.";
      setErrorMessage(message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <AdminNavbar />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-xs text-[#6b9774] space-y-3">
          <div className="w-8 h-8 border-3 border-[#86ba90]/30 border-t-[#86ba90] rounded-full animate-spin mx-auto" />
          <p>Loading article into TipTap editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <AdminNavbar />

      <main className="max-w-5xl mx-auto px-4 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b9774] hover:text-[#080f0f] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-btn-subtle text-xs font-bold text-[#080f0f] hover:text-[#547e5d]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Article</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-btn-subtle text-xs font-bold text-[#080f0f]"
            >
              <Eye className="w-3.5 h-3.5 text-[#86ba90]" />
              <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
            <Sparkles className="w-3.5 h-3.5 text-[#86ba90]" />
            <span>TipTap Revision Engine</span>
          </div>
          <h1 className="text-3xl font-black text-[#080f0f] tracking-tight">
            Edit Publication
          </h1>
          <p className="text-xs sm:text-sm text-[#6b9774] mt-1 font-mono">
            Modifying article at /blog/{slug}
          </p>
        </div>

        {/* Error alert */}
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
              <span>Article Details & Metadata</span>
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
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl clay-well bg-white text-sm font-bold text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Slug (Fixed during edit to protect URLs and SEO) */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  Permanent URL Slug
                </label>
                <div className="flex items-center rounded-xl clay-well bg-gray-50 border border-[#86ba90]/30 px-3 py-2 text-xs font-mono text-[#6b9774]">
                  <span>/blog/{slug}</span>
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
                  className="w-full px-4 py-2 rounded-xl clay-well bg-white text-xs text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5">
                  Excerpt (Meta Description & Card Summary)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl clay-well bg-white text-xs text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-xs font-bold text-[#080f0f] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#86ba90]" />
                  <span>Reading Time</span>
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
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
                  className="w-full px-3.5 py-2 rounded-xl clay-well bg-white text-xs font-medium text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
                />
              </div>

              {/* Author */}
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
                Article Content (TipTap Rich Text Editor)
              </label>
              <span className="text-xs text-[#6b9774]">
                Format and refine typography directly
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

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#86ba90]/25">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="py-3 px-4 rounded-xl clay-btn-subtle text-[#ff5e5b] hover:text-[#d32f2f] hover:bg-[#ffebee] text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? "Deleting..." : "Delete Publication"}</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="py-3 px-5 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSaving}
                className="py-3 px-6 rounded-xl clay-btn text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
