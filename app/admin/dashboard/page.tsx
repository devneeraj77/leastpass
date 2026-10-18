"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { BlogPost } from "@/lib/blog-data";
import {
  FileText,
  PlusCircle,
  ExternalLink,
  Edit3,
  Trash2,
  Search,
  BookOpen,
  Clock,
  Sparkles,
  AlertCircle,
  Layers,
  Database,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{
    mode: "mongodb" | "file";
    message: string;
    isConfigured: boolean;
  }>({
    mode: "file",
    message: "Checking database status...",
    isConfigured: false,
  });

  // Client-side auth guard defense-in-depth
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login?callbackUrl=/admin/dashboard");
    }
  }, [status, router]);

  const loadPosts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [postsRes, dbRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/database/status"),
      ]);

      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data);
      }
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        setDbStatus(dbData);
      }
    } catch {
      toast({
        title: "Error loading posts",
        description: "Could not fetch current blog publications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      loadPosts();
    }
  }, [status, loadPosts]);

  const handleDelete = async (slug: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        toast({
          title: "Post Deleted",
          description: `"${title}" has been removed from publications.`,
        });
      } else {
        const data = await res.json();
        toast({
          title: "Delete Failed",
          description: data.error || "Could not delete this post.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error occurred.";
      toast({
        title: "Delete Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeletingSlug(null);
    }
  };

  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  const handleSeedDatabase = async () => {
    const confirmed = window.confirm(
      "Seed database directly with default administrator account and publications?"
    );
    if (!confirmed) return;

    setIsSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Database Seeded Successfully!",
          description: `Mode: ${data.mode.toUpperCase()} · ${data.postsCount} publications synchronized.`,
        });
        await loadPosts();
      } else {
        toast({
          title: "Seed Failed",
          description: data.error || "Failed to seed database.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error running database seed.";
      toast({
        title: "Seed Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#86ba90]/30 border-t-[#86ba90] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#6b9774]">Authenticating Administrator Session...</p>
        </div>
      </div>
    );
  }

  // Filter posts
  const categories = Array.from(new Set(posts.map((p) => p.category))).filter(Boolean);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-16">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#080f0f] tracking-tight">
              Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6b9774] mt-1">
              Author, edit, and organize cryptographic blog articles and educational guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="py-2.5 px-3.5 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 hover:text-[#547e5d] transition-all"
              title="Directly seed default admin account and publications into MongoDB"
            >
              <Database className="w-3.5 h-3.5 text-[#86ba90]" />
              <span>{isSeeding ? "Seeding..." : "Seed Database"}</span>
            </button>

            <Link
              href="/admin/posts/create"
              className="py-2.5 px-4 rounded-xl clay-btn text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Article</span>
            </Link>

            <Link
              href="/blog"
              target="_blank"
              className="py-2.5 px-4 rounded-xl clay-btn-subtle text-[#080f0f] text-xs font-bold flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#86ba90]" />
              <span>View Public Blog</span>
              <ExternalLink className="w-3 h-3 text-[#6b9774]" />
            </Link>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="clay-card p-5 bg-white/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
                Total Publications
              </span>
              <FileText className="w-4 h-4 text-[#86ba90]" />
            </div>
            <div className="text-2xl font-black text-[#080f0f]">{posts.length}</div>
            <div className="text-[11px] text-[#6b9774] mt-1">Live blog guides indexed</div>
          </div>

          <div className="clay-card p-5 bg-white/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
                Topics & Categories
              </span>
              <Layers className="w-4 h-4 text-[#86ba90]" />
            </div>
            <div className="text-2xl font-black text-[#080f0f]">{categories.length}</div>
            <div className="text-[11px] text-[#6b9774] mt-1">Security & math clusters</div>
          </div>

          <div className="clay-card p-5 bg-white/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
                Author Profile
              </span>
              <Sparkles className="w-4 h-4 text-[#86ba90]" />
            </div>
            <div className="text-base font-black text-[#080f0f] truncate">Neeraj Rekwar</div>
            <div className="text-[11px] text-[#6b9774] mt-1">Lead Developer & Cryptographer</div>
          </div>

          <div className="clay-card p-5 bg-white/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#6b9774] uppercase tracking-wider">
                Database Engine
              </span>
              <Database className={`w-4 h-4 ${dbStatus.mode === "mongodb" ? "text-[#547e5d]" : "text-[#86ba90]"}`} />
            </div>
            <div className="text-base font-black text-[#080f0f] flex items-center gap-1.5">
              <span>{dbStatus.mode === "mongodb" ? "MongoDB Atlas" : "Local JSON Store"}</span>
              <span className={`w-2 h-2 rounded-full ${dbStatus.mode === "mongodb" ? "bg-emerald-500 animate-pulse" : "bg-[#86ba90]"}`} />
            </div>
            <div className="text-[11px] text-[#6b9774] mt-1 truncate" title={dbStatus.message}>
              {dbStatus.mode === "mongodb" ? "Connected & Synchronized" : "Ready for MONGODB_URI"}
            </div>
          </div>
        </div>

        {/* Posts Filter and Search Bar */}
        <div className="clay-card p-4 mb-6 bg-white/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6b9774]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, tags, or content..."
              className="w-full pl-10 pr-4 py-2 rounded-xl clay-well bg-white text-xs font-medium text-[#080f0f] border border-[#86ba90]/30 focus:outline-none focus:ring-2 focus:ring-[#86ba90]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-[#6b9774] shrink-0">Category:</span>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === "all"
                  ? "bg-[#86ba90] text-white shadow-sm"
                  : "clay-btn-subtle text-[#080f0f]"
              }`}
            >
              All ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? "bg-[#86ba90] text-white shadow-sm"
                    : "clay-btn-subtle text-[#080f0f]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Table */}
        <div className="clay-card bg-white/95 overflow-hidden border border-[#86ba90]/25 shadow-md">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-[#6b9774] space-y-2">
              <div className="w-6 h-6 border-2 border-[#86ba90]/30 border-t-[#86ba90] rounded-full animate-spin mx-auto" />
              <p>Loading publication records...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#6b9774] space-y-3">
              <AlertCircle className="w-8 h-8 text-[#86ba90] mx-auto opacity-70" />
              <p className="font-semibold text-[#080f0f] text-sm">No articles matched your query</p>
              <p>Try clearing your search terms or create a new blog post.</p>
              <Link
                href="/admin/posts/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl clay-btn text-white text-xs font-bold mt-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Post</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#edf5ef]/70 border-b border-[#86ba90]/25 text-[#3b5240] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Reading Time</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#86ba90]/15">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.slug}
                      className="hover:bg-[#fbfdfc] transition-colors group"
                    >
                      {/* Title & Slug */}
                      <td className="py-4 px-4 max-w-xs sm:max-w-md">
                        <div className="font-bold text-[#080f0f] text-sm group-hover:text-[#547e5d] transition-colors">
                          {post.title}
                        </div>
                        <div className="font-mono text-[11px] text-[#6b9774] truncate mt-0.5">
                          /blog/{post.slug}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#86ba90]/20 text-[#3b5240]">
                          {post.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#6b9774]">
                        {post.date}
                      </td>

                      {/* Read Time */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#6b9774] flex items-center gap-1 pt-5">
                        <Clock className="w-3.5 h-3.5 text-[#86ba90]" />
                        <span>{post.readTime}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit Button */}
                          <Link
                            href={`/admin/posts/edit/${post.slug}`}
                            className="p-2 rounded-xl clay-btn-subtle text-[#080f0f] hover:text-[#86ba90] transition-colors"
                            title="Edit Article with TipTap Editor"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* View Live Button */}
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl clay-btn-subtle text-[#080f0f] hover:text-[#547e5d] transition-colors"
                            title="View Live Article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(post.slug, post.title)}
                            disabled={deletingSlug === post.slug}
                            className="p-2 rounded-xl clay-btn-subtle text-[#ff5e5b] hover:text-[#d32f2f] hover:bg-[#ffebee] transition-colors disabled:opacity-40"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
