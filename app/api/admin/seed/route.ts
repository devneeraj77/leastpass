import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { runDatabaseSeed } from "@/lib/db-seed";

export async function POST(req: NextRequest) {
  try {
    // Check if session exists or if authorized via master key
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get("authorization");
    const masterSecret = process.env.NEXTAUTH_SECRET || "leastpass-super-secure-jwt-secret-key-2026-auth";

    const isAuthorized =
      !!session ||
      (authHeader && authHeader.replace(/^Bearer\s+/i, "") === masterSecret);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in as administrator to run database seed." },
        { status: 401 }
      );
    }

    const result = await runDatabaseSeed();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database seeding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
