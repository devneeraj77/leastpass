import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getStoredPostBySlug, saveStoredPost, deleteStoredPost } from "@/lib/blog-store";
import { BlogPost } from "@/lib/blog-data";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const post = await getStoredPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { slug } = await params;
    const existingPost = await getStoredPostBySlug(slug);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();

    const updatedPost: BlogPost = {
      ...existingPost,
      title: body.title !== undefined ? body.title.trim() : existingPost.title,
      subtitle: body.subtitle !== undefined ? body.subtitle.trim() : existingPost.subtitle,
      date: body.date !== undefined ? body.date : existingPost.date,
      readTime: body.readTime !== undefined ? body.readTime : existingPost.readTime,
      category: body.category !== undefined ? body.category : existingPost.category,
      author: {
        name: body.author?.name || existingPost.author.name,
        role: body.author?.role || existingPost.author.role,
        avatar: body.author?.avatar || existingPost.author.avatar,
      },
      excerpt: body.excerpt !== undefined ? body.excerpt.trim() : existingPost.excerpt,
      content: body.content !== undefined ? body.content : existingPost.content,
      tags: Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : existingPost.tags,
    };

    const saved = await saveStoredPost(updatedPost, false);
    return NextResponse.json(saved);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { slug } = await params;
    const deleted = await deleteStoredPost(slug);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found or could not be deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
