import fs from "fs/promises";
import path from "path";
import { Db } from "mongodb";
import { BlogPost, PRESET_BLOG_POSTS } from "./blog-data";
import { getDatabase } from "./mongodb";

const DATA_FILE = path.join(process.cwd(), "data", "blog-posts.json");

// In-memory cache
let cachedPosts: BlogPost[] | null = null;
let isMongoSeeded = false;

async function ensureLocalFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(PRESET_BLOG_POSTS, null, 2), "utf8");
  }
}

async function getLocalPosts(): Promise<BlogPost[]> {
  try {
    await ensureLocalFile();
    const content = await fs.readFile(DATA_FILE, "utf8");
    cachedPosts = JSON.parse(content) as BlogPost[];
    return cachedPosts;
  } catch (error) {
    console.error("Error reading local blog posts file:", error);
    return cachedPosts || PRESET_BLOG_POSTS;
  }
}

async function saveLocalPost(post: BlogPost, isNew: boolean): Promise<BlogPost> {
  const posts = await getLocalPosts();
  let updatedPosts: BlogPost[];

  const existingIndex = posts.findIndex((p) => p.slug === post.slug);

  if (existingIndex >= 0) {
    if (isNew) {
      throw new Error("A post with this slug already exists.");
    }
    updatedPosts = [...posts];
    updatedPosts[existingIndex] = post;
  } else {
    updatedPosts = [post, ...posts];
  }

  await ensureLocalFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(updatedPosts, null, 2), "utf8");
  cachedPosts = updatedPosts;
  return post;
}

async function deleteLocalPost(slug: string): Promise<boolean> {
  const posts = await getLocalPosts();
  const filtered = posts.filter((p) => p.slug !== slug);

  if (filtered.length === posts.length) {
    return false;
  }

  await ensureLocalFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf8");
  cachedPosts = filtered;
  return true;
}

// -------------------------------------------------------------
// MongoDB Storage Helpers
// -------------------------------------------------------------
async function seedMongoIfEmpty(db: Db): Promise<void> {
  if (isMongoSeeded) return;
  try {
    const collection = db.collection("posts");
    const count = await collection.countDocuments();
    if (count === 0) {
      const local = await getLocalPosts();
      const initialPosts = local.length > 0 ? local : PRESET_BLOG_POSTS;
      await collection.insertMany(initialPosts.map((p) => ({ ...p })));
    }
    isMongoSeeded = true;
  } catch (err) {
    console.warn("Could not seed MongoDB posts collection:", err);
  }
}

// -------------------------------------------------------------
// Public Blog Store Interface
// -------------------------------------------------------------

export async function getStorageMode(): Promise<{ mode: "mongodb" | "file"; message: string }> {
  try {
    const db = await getDatabase();
    if (db) {
      // Test ping
      await db.command({ ping: 1 });
      return {
        mode: "mongodb",
        message: `Connected to MongoDB database "${db.databaseName}"`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "MongoDB unreachable";
    return {
      mode: "file",
      message: `MongoDB configured but connection error: ${msg}. Using local store fallback.`,
    };
  }

  return {
    mode: "file",
    message: "Using file store (data/blog-posts.json). Set MONGODB_URI to activate MongoDB database persistence.",
  };
}

export async function getStoredPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDatabase();
    if (db) {
      await seedMongoIfEmpty(db);
      const collection = db.collection("posts");
      const docs = await collection
        .find({}, { projection: { _id: 0 } })
        .toArray();

      if (docs && docs.length > 0) {
        return docs as unknown as BlogPost[];
      }
    }
  } catch (err) {
    console.warn("MongoDB getStoredPosts error, falling back to local file:", err);
  }

  return await getLocalPosts();
}

export async function getStoredPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const db = await getDatabase();
    if (db) {
      await seedMongoIfEmpty(db);
      const collection = db.collection("posts");
      const doc = await collection.findOne({ slug }, { projection: { _id: 0 } });
      if (doc) {
        return doc as unknown as BlogPost;
      }
    }
  } catch (err) {
    console.warn("MongoDB getStoredPostBySlug error, falling back to local file:", err);
  }

  const local = await getLocalPosts();
  return local.find((p) => p.slug === slug);
}

export async function saveStoredPost(post: BlogPost, isNew: boolean = false): Promise<BlogPost> {
  // Always mirror to local file as backup
  try {
    await saveLocalPost(post, isNew);
  } catch (localErr) {
    // If local uniqueness error, throw
    if (isNew) throw localErr;
  }

  try {
    const db = await getDatabase();
    if (db) {
      await seedMongoIfEmpty(db);
      const collection = db.collection("posts");

      if (isNew) {
        const existing = await collection.findOne({ slug: post.slug });
        if (existing) {
          throw new Error("A post with this slug already exists in MongoDB database.");
        }
        await collection.insertOne({ ...post });
      } else {
        await collection.updateOne(
          { slug: post.slug },
          { $set: { ...post } },
          { upsert: true }
        );
      }
    }
  } catch (err: unknown) {
    console.error("MongoDB saveStoredPost error:", err);
    if (!process.env.MONGODB_URI) {
      // Not configured, local save succeeded
      return post;
    }
    // If configured and failed, let user know
    const message = err instanceof Error ? err.message : "Database save failure";
    throw new Error(`MongoDB Error: ${message}`);
  }

  return post;
}

export async function deleteStoredPost(slug: string): Promise<boolean> {
  let localDeleted = false;
  try {
    localDeleted = await deleteLocalPost(slug);
  } catch (err) {
    console.warn("Local delete error:", err);
  }

  let mongoDeleted = false;
  try {
    const db = await getDatabase();
    if (db) {
      const collection = db.collection("posts");
      const res = await collection.deleteOne({ slug });
      mongoDeleted = res.deletedCount > 0;
    }
  } catch (err) {
    console.error("MongoDB deleteStoredPost error:", err);
  }

  return localDeleted || mongoDeleted;
}
