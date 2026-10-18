import { NextResponse } from "next/server";
import { getStorageMode } from "@/lib/blog-store";

export async function GET() {
  try {
    const status = await getStorageMode();
    return NextResponse.json({
      ...status,
      isConfigured: !!process.env.MONGODB_URI,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to determine database status";
    return NextResponse.json(
      { mode: "file", message, isConfigured: false },
      { status: 500 }
    );
  }
}
