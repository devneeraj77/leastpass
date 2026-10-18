import { getDatabase } from "./mongodb";
import { PRESET_BLOG_POSTS } from "./blog-data";
import fs from "fs/promises";
import path from "path";

export interface SeedResult {
  success: boolean;
  mode: "mongodb" | "file";
  postsCount: number;
  adminUser: {
    username: string;
    email: string;
    role: string;
  };
  details: string[];
}

export const DEFAULT_ADMIN_USER = {
  username: process.env.ADMIN_USER || "admin",
  email: "admin@leastpass.com",
  password: process.env.ADMIN_PASSWORD || "leastpass2026!",
  name: "Neeraj Rekwar",
  role: "administrator",
  avatar: "NR",
};

export async function runDatabaseSeed(): Promise<SeedResult> {
  const details: string[] = [];

  // 1. Always ensure local file storage is seeded as backup
  try {
    const dataDir = path.join(process.cwd(), "data");
    const dataFile = path.join(dataDir, "blog-posts.json");
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(PRESET_BLOG_POSTS, null, 2), "utf8");
    details.push("Local file cache (data/blog-posts.json) updated with 3 preset articles.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    details.push(`Local file write warning: ${msg}`);
  }

  // 2. Check if MongoDB is connected
  let db = null;
  try {
    db = await getDatabase();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    details.push(`MongoDB connection check failed: ${msg}`);
  }

  if (!db) {
    return {
      success: true,
      mode: "file",
      postsCount: PRESET_BLOG_POSTS.length,
      adminUser: {
        username: DEFAULT_ADMIN_USER.username,
        email: DEFAULT_ADMIN_USER.email,
        role: DEFAULT_ADMIN_USER.role,
      },
      details: [
        ...details,
        "MongoDB URI not detected. Seeded local file storage. Set MONGODB_URI to seed directly into MongoDB cluster.",
      ],
    };
  }

  // 3. Directly seed MongoDB
  try {
    // A. Seed Admin User in 'users' collection
    const usersCol = db.collection("users");
    await usersCol.createIndex({ username: 1 }, { unique: true });
    await usersCol.createIndex({ email: 1 }, { unique: true });

    await usersCol.updateOne(
      { username: DEFAULT_ADMIN_USER.username },
      {
        $set: {
          ...DEFAULT_ADMIN_USER,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    details.push(`Seeded administrator account "${DEFAULT_ADMIN_USER.username}" into MongoDB collection "users".`);

    // B. Seed Publications in 'posts' collection
    const postsCol = db.collection("posts");
    await postsCol.createIndex({ slug: 1 }, { unique: true });

    let upsertedCount = 0;
    for (const post of PRESET_BLOG_POSTS) {
      await postsCol.updateOne(
        { slug: post.slug },
        {
          $set: {
            ...post,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      upsertedCount++;
    }
    details.push(`Seeded ${upsertedCount} cryptographic publications into MongoDB collection "posts".`);

    // C. Seed System Settings & Metadata
    const settingsCol = db.collection("settings");
    await settingsCol.updateOne(
      { key: "system_metadata" },
      {
        $set: {
          key: "system_metadata",
          appName: "LeastPass",
          developer: "Neeraj Rekwar",
          lastSeededAt: new Date(),
          version: "1.0.0",
        },
      },
      { upsert: true }
    );
    details.push(`Seeded system metadata into MongoDB collection "settings".`);

    return {
      success: true,
      mode: "mongodb",
      postsCount: upsertedCount,
      adminUser: {
        username: DEFAULT_ADMIN_USER.username,
        email: DEFAULT_ADMIN_USER.email,
        role: DEFAULT_ADMIN_USER.role,
      },
      details,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Direct MongoDB seed failed: ${msg}`);
  }
}
