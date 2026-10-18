import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getStoredPosts, saveStoredPost } from "@/lib/blog-store";
import { BlogPost } from "@/lib/blog-data";

export async function GET() {
  try {
    const posts = await getStoredPosts();
    return NextResponse.json(posts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve posts";
    return NextResponse.json(
      { error: "Failed to retrieve posts", details: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required fields." },
        { status: 400 }
      );
    }

    // Clean and validate slug
    const cleanSlug = body.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPost: BlogPost = {
      slug: cleanSlug,
      title: body.title.trim(),
      subtitle: body.subtitle ? body.subtitle.trim() : "",
      date: body.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: body.readTime || "5 min read",
      category: body.category || "Cryptography & Security",
      author: {
        name: body.author?.name || session.user?.name || "Neeraj Rekwar",
        role: body.author?.role || "Creator of LeastPass",
        avatar: body.author?.avatar || "NR",
      },
      excerpt: body.excerpt ? body.excerpt.trim() : "",
      content: body.content || "<p>Write post content...</p>",
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map((t: string) => t.trim()) : ["Security"]),
    };

    const saved = await saveStoredPost(newPost, true);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
