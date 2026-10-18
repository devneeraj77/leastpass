import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");

// Try loading environment variables from .env.local or .env if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    const fullPath = path.join(rootDir, envFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...rest] = trimmed.split("=");
          const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;

function getCleanDbName() {
  const envDb = process.env.MONGODB_DB;
  if (envDb && !envDb.includes(".") && !envDb.startsWith("mongodb") && !envDb.includes("/")) {
    return envDb.trim();
  }
  return "leastpass";
}

const dbName = getCleanDbName();
const adminUser = process.env.ADMIN_USER || "admin";
const adminPass = process.env.ADMIN_PASSWORD || "leastpass2026!";
const adminEmail = "admin@leastpass.com";
const adminName = "Neeraj Rekwar";

// Read preset blog posts from data/blog-posts.json
const dataJsonPath = path.join(dataDir, "blog-posts.json");
const usersJsonPath = path.join(dataDir, "users.json");

let presetPosts = [];
if (fs.existsSync(dataJsonPath)) {
  try {
    presetPosts = JSON.parse(fs.readFileSync(dataJsonPath, "utf8"));
  } catch (err) {
    console.error("Error reading data/blog-posts.json:", err.message);
  }
}

console.log("\n=======================================================");
console.log("🔒 LeastPass Direct Database Seed Tool");
console.log("=======================================================\n");

async function main() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Always seed local fallback users and posts
  const adminDoc = {
    username: adminUser,
    email: adminEmail,
    password: adminPass,
    name: adminName,
    role: "administrator",
    avatar: "NR",
    updatedAt: new Date().toISOString(),
  };

  let localUsers = [];
  if (fs.existsSync(usersJsonPath)) {
    try {
      localUsers = JSON.parse(fs.readFileSync(usersJsonPath, "utf8"));
    } catch {
      localUsers = [];
    }
  }

  const existingIdx = localUsers.findIndex((u) => u.username === adminUser);
  if (existingIdx >= 0) {
    localUsers[existingIdx] = { ...localUsers[existingIdx], ...adminDoc };
  } else {
    localUsers.push({ ...adminDoc, createdAt: new Date().toISOString() });
  }
  fs.writeFileSync(usersJsonPath, JSON.stringify(localUsers, null, 2), "utf8");
  console.log(`✅ Seeded administrator account into local storage (${usersJsonPath}).`);

  if (!uri) {
    console.warn("\n⚠️  MONGODB_URI environment variable is not set.");
    console.log("ℹ️  Running in Local Storage Mode.");
    if (presetPosts.length > 0) {
      console.log(`✅ Local publications store verified with ${presetPosts.length} articles.`);
    }
    console.log("\n=======================================================");
    console.log("🎉 Local Seed Completed Successfully!");
    console.log("=======================================================");
    console.log(`👤 Admin Username: ${adminUser}`);
    console.log(`🔐 Admin Password: ${adminPass}`);
    console.log(`📧 Admin Email:    ${adminEmail}`);
    console.log("🌐 Admin Portal:   http://localhost:3000/admin/login");
    console.log("\n👉 Tip: To seed directly into MongoDB Atlas, configure MONGODB_URI:");
    console.log("   MONGODB_URI=\"mongodb+srv://...\" node scripts/seed.mjs\n");
    process.exit(0);
  }

  console.log(`\n📡 Connecting to MongoDB Database: "${dbName}"...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB cluster!");

    const db = client.db(dbName);

    // 1. Seed Administrator User in 'users' collection
    console.log("\n👤 Seeding Administrator Credentials in 'users' collection...");
    const usersCol = db.collection("users");
    await usersCol.createIndex({ username: 1 }, { unique: true });
    await usersCol.createIndex({ email: 1 }, { unique: true });

    const userRes = await usersCol.updateOne(
      { username: adminUser },
      {
        $set: {
          ...adminDoc,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    if (userRes.upsertedCount > 0) {
      console.log(`   ✨ Created new admin user: "${adminUser}"`);
    } else {
      console.log(`   🔄 Updated existing admin user: "${adminUser}"`);
    }

    // 2. Seed Blog Posts in 'posts' collection
    console.log("\n📚 Seeding Publications in 'posts' collection...");
    const postsCol = db.collection("posts");
    await postsCol.createIndex({ slug: 1 }, { unique: true });

    let postCount = 0;
    for (const post of presetPosts) {
      await postsCol.updateOne(
        { slug: post.slug },
        {
          $set: {
            ...post,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      postCount++;
      console.log(`   📝 Seeded: "${post.title.slice(0, 48)}..." (/blog/${post.slug})`);
    }

    // 3. Seed Settings / Metadata
    const settingsCol = db.collection("settings");
    await settingsCol.updateOne(
      { key: "system_metadata" },
      {
        $set: {
          key: "system_metadata",
          appName: "LeastPass",
          developer: adminName,
          lastSeededAt: new Date(),
          version: "1.0.0",
        },
      },
      { upsert: true }
    );
    console.log("   ⚙️  Seeded system metadata in 'settings' collection.");

    console.log("\n=======================================================");
    console.log("🎉 Direct Database Seeding Completed Successfully!");
    console.log("=======================================================");
    console.log(`📊 Total Articles Seeded: ${postCount}`);
    console.log(`👤 Admin Username:        ${adminUser}`);
    console.log(`🔐 Admin Password:        ${adminPass}`);
    console.log(`📧 Admin Email:           ${adminEmail}`);
    console.log("🌐 Admin Login Portal:    http://localhost:3000/admin/login");
    console.log("=======================================================\n");
  } catch (error) {
    console.error("❌ Direct database seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
