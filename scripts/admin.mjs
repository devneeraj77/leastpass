#!/usr/bin/env node
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const usersJsonPath = path.join(dataDir, "users.json");
const postsJsonPath = path.join(dataDir, "blog-posts.json");

// Load .env.local and .env
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

// Helper: Ensure data dir and read local users
function readLocalUsers() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(usersJsonPath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(usersJsonPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalUsers(users) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(usersJsonPath, JSON.stringify(users, null, 2), "utf8");
}

// Helper: Connect to MongoDB if available
async function getMongoClient() {
  if (!uri) return null;
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    return client;
  } catch (err) {
    console.warn(`⚠️  Could not connect to MongoDB (${err.message}). Using local store.`);
    return null;
  }
}

// -------------------------------------------------------------
// Commands
// -------------------------------------------------------------

async function listAdmins() {
  console.log("\n📋 LeastPass Administrator Accounts:");
  console.log("--------------------------------------------------------------------------------");

  const client = await getMongoClient();
  let users = [];
  let source = "Local File (data/users.json)";

  if (client) {
    try {
      const db = client.db(dbName);
      users = await db.collection("users").find({}).toArray();
      source = `MongoDB Atlas [${dbName}.users]`;
    } finally {
      await client.close();
    }
  }

  if (users.length === 0) {
    users = readLocalUsers();
    source = "Local File (data/users.json)";
  }

  // Also include env default if no users found anywhere
  if (users.length === 0 && (process.env.ADMIN_USER || process.env.ADMIN_PASSWORD)) {
    users.push({
      username: process.env.ADMIN_USER || "admin",
      email: "admin@leastpass.com",
      name: "Neeraj Rekwar (Env Default)",
      role: "administrator",
      createdAt: "Environment Variable Fallback",
    });
    source = "Environment Fallback (ADMIN_USER/ADMIN_PASSWORD)";
  }

  console.log(`📡 Storage Engine: ${source}`);
  console.log(`👥 Total Accounts: ${users.length}\n`);

  if (users.length === 0) {
    console.log("ℹ️  No administrator accounts found. Run 'node scripts/admin.mjs seed' or 'create'.");
    return;
  }

  console.log(
    "USER".padEnd(16) +
    "NAME".padEnd(20) +
    "EMAIL".padEnd(28) +
    "ROLE".padEnd(16)
  );
  console.log("-".repeat(80));

  for (const u of users) {
    console.log(
      String(u.username || "").padEnd(16) +
      String(u.name || "Administrator").padEnd(20) +
      String(u.email || "").padEnd(28) +
      String(u.role || "administrator").padEnd(16)
    );
  }
  console.log("--------------------------------------------------------------------------------\n");
}

async function createAdmin(username, password, email, name, role = "administrator") {
  if (!username || !password) {
    console.error("❌ Error: Both <username> and <password> are required.");
    console.log("   Usage: node scripts/admin.mjs create <username> <password> [email] [name] [role]");
    process.exit(1);
  }

  const cleanUser = username.trim();
  const cleanEmail = (email || `${cleanUser}@leastpass.com`).trim().toLowerCase();
  const cleanName = (name || cleanUser).trim();

  const userDoc = {
    username: cleanUser,
    email: cleanEmail,
    password: password.trim(),
    name: cleanName,
    role: role.trim(),
    avatar: cleanName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "AD",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let savedMongo = false;
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db(dbName);
      const col = db.collection("users");
      await col.createIndex({ username: 1 }, { unique: true });
      await col.createIndex({ email: 1 }, { unique: true });

      const existing = await col.findOne({
        $or: [{ username: cleanUser }, { email: cleanEmail }],
      });

      if (existing) {
        console.error(`❌ Error: User with username "${cleanUser}" or email "${cleanEmail}" already exists in MongoDB.`);
        process.exit(1);
      }

      await col.insertOne({ ...userDoc, createdAt: new Date(), updatedAt: new Date() });
      savedMongo = true;
    } finally {
      await client.close();
    }
  }

  // Also write to local storage
  const localUsers = readLocalUsers();
  const existingLocal = localUsers.find(
    (u) => u.username === cleanUser || u.email.toLowerCase() === cleanEmail
  );

  if (existingLocal && !savedMongo) {
    console.error(`❌ Error: User with username "${cleanUser}" or email "${cleanEmail}" already exists locally.`);
    process.exit(1);
  }

  if (!existingLocal) {
    localUsers.push(userDoc);
    writeLocalUsers(localUsers);
  }

  console.log("\n=======================================================");
  console.log("✅ Administrator Account Created Successfully!");
  console.log("=======================================================");
  console.log(`👤 Username: ${cleanUser}`);
  console.log(`📧 Email:    ${cleanEmail}`);
  console.log(`🏷️  Name:     ${cleanName}`);
  console.log(`🔑 Role:     ${role}`);
  console.log(`💾 Stored:   ${savedMongo ? "MongoDB + Local Sync" : "Local Store (data/users.json)"}`);
  console.log("🌐 Portal:   http://localhost:3000/admin/login\n");
}

async function updateAdmin(username, newPassword, newEmail, newName) {
  if (!username) {
    console.error("❌ Error: <username> is required to update an admin account.");
    console.log("   Usage: node scripts/admin.mjs update <username> <newPassword> [newEmail] [newName]");
    process.exit(1);
  }

  const cleanUser = username.trim();
  const updatePayload = {
    updatedAt: new Date().toISOString(),
  };

  if (newPassword) updatePayload.password = newPassword.trim();
  if (newEmail) updatePayload.email = newEmail.trim().toLowerCase();
  if (newName) updatePayload.name = newName.trim();

  let updatedInMongo = false;
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db(dbName);
      const col = db.collection("users");
      const res = await col.updateOne(
        { username: cleanUser },
        { $set: { ...updatePayload, updatedAt: new Date() } }
      );
      if (res.matchedCount > 0) {
        updatedInMongo = true;
      }
    } finally {
      await client.close();
    }
  }

  // Also update local file
  const localUsers = readLocalUsers();
  const idx = localUsers.findIndex((u) => u.username === cleanUser);
  if (idx !== -1) {
    localUsers[idx] = { ...localUsers[idx], ...updatePayload };
    writeLocalUsers(localUsers);
  }

  if (!updatedInMongo && idx === -1) {
    console.error(`❌ Error: Administrator "${cleanUser}" not found in database or local store.`);
    process.exit(1);
  }

  console.log("\n=======================================================");
  console.log(`✅ Administrator Account "${cleanUser}" Updated Successfully!`);
  console.log("=======================================================");
  if (newPassword) console.log("🔑 Password:   Updated");
  if (newEmail) console.log(`📧 Email:      ${newEmail}`);
  if (newName) console.log(`🏷️  Name:       ${newName}`);
  console.log(`💾 Updated in: ${updatedInMongo ? "MongoDB + Local Sync" : "Local Store"}\n`);
}

async function removeAdmin(username) {
  if (!username) {
    console.error("❌ Error: <username> is required to remove an admin account.");
    console.log("   Usage: node scripts/admin.mjs remove <username>");
    process.exit(1);
  }

  const cleanUser = username.trim();
  let deletedMongo = false;
  const client = await getMongoClient();

  if (client) {
    try {
      const db = client.db(dbName);
      const col = db.collection("users");
      const count = await col.countDocuments({});
      if (count <= 1) {
        console.warn("⚠️  Warning: This is the only admin user in MongoDB. Deleting will leave no admins.");
      }
      const res = await col.deleteOne({ username: cleanUser });
      if (res.deletedCount > 0) {
        deletedMongo = true;
      }
    } finally {
      await client.close();
    }
  }

  // Remove from local file
  const localUsers = readLocalUsers();
  const filtered = localUsers.filter((u) => u.username !== cleanUser);
  const deletedLocal = filtered.length < localUsers.length;
  if (deletedLocal) {
    writeLocalUsers(filtered);
  }

  if (!deletedMongo && !deletedLocal) {
    console.error(`❌ Error: Admin "${cleanUser}" was not found.`);
    process.exit(1);
  }

  console.log("\n=======================================================");
  console.log(`🗑️  Administrator Account "${cleanUser}" Removed!`);
  console.log("=======================================================");
  console.log(`💾 Removed from: ${deletedMongo ? "MongoDB" : ""} ${deletedLocal ? "Local Store" : ""}\n`);
}

async function runSeed() {
  console.log("\n🌱 Seeding LeastPass Database and Administrator Account...");
  console.log("--------------------------------------------------------------------------------");

  const defaultUser = process.env.ADMIN_USER || "admin";
  const defaultPass = process.env.ADMIN_PASSWORD || "leastpass2026!";
  const defaultEmail = "admin@leastpass.com";
  const defaultName = "Neeraj Rekwar";

  // Read preset posts
  let presetPosts = [];
  if (fs.existsSync(postsJsonPath)) {
    try {
      presetPosts = JSON.parse(fs.readFileSync(postsJsonPath, "utf8"));
    } catch (e) {
      console.warn("Could not read preset posts:", e.message);
    }
  }

  // 1. Seed Local Users
  const localUsers = readLocalUsers();
  const existingLocalIdx = localUsers.findIndex((u) => u.username === defaultUser);
  const adminDoc = {
    username: defaultUser,
    email: defaultEmail,
    password: defaultPass,
    name: defaultName,
    role: "administrator",
    avatar: "NR",
    updatedAt: new Date().toISOString(),
  };

  if (existingLocalIdx >= 0) {
    localUsers[existingLocalIdx] = { ...localUsers[existingLocalIdx], ...adminDoc };
    console.log(`🔄 Updated default admin "${defaultUser}" in local store.`);
  } else {
    localUsers.push({ ...adminDoc, createdAt: new Date().toISOString() });
    console.log(`✨ Created default admin "${defaultUser}" in local store.`);
  }
  writeLocalUsers(localUsers);

  // 2. Seed MongoDB if available
  const client = await getMongoClient();
  let seededMongo = false;

  if (client) {
    try {
      const db = client.db(dbName);

      // Seed users collection
      const usersCol = db.collection("users");
      await usersCol.createIndex({ username: 1 }, { unique: true });
      await usersCol.createIndex({ email: 1 }, { unique: true });

      await usersCol.updateOne(
        { username: defaultUser },
        {
          $set: { ...adminDoc, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      console.log(`✨ Seeded administrator "${defaultUser}" into MongoDB collection "users".`);

      // Seed posts collection
      if (presetPosts.length > 0) {
        const postsCol = db.collection("posts");
        await postsCol.createIndex({ slug: 1 }, { unique: true });

        for (const post of presetPosts) {
          await postsCol.updateOne(
            { slug: post.slug },
            {
              $set: { ...post, updatedAt: new Date() },
              $setOnInsert: { createdAt: new Date() },
            },
            { upsert: true }
          );
        }
        console.log(`📚 Seeded ${presetPosts.length} articles into MongoDB collection "posts".`);
      }

      // Seed settings
      const settingsCol = db.collection("settings");
      await settingsCol.updateOne(
        { key: "system_metadata" },
        {
          $set: {
            appName: "LeastPass",
            developer: defaultName,
            version: "1.0.0",
            lastSeededAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log(`⚙️  Seeded system metadata in MongoDB collection "settings".`);
      seededMongo = true;
    } finally {
      await client.close();
    }
  } else {
    console.log("ℹ️  MongoDB URI not configured. Seeded local store (data/users.json & data/blog-posts.json).");
  }

  console.log("\n=======================================================");
  console.log("🎉 Seeding Completed Successfully!");
  console.log("=======================================================");
  console.log(`👤 Admin Username: ${defaultUser}`);
  console.log(`🔐 Admin Password: ${defaultPass}`);
  console.log(`📧 Admin Email:    ${defaultEmail}`);
  console.log(`💾 Storage:        ${seededMongo ? "MongoDB Atlas + Local Sync" : "Local JSON Store"}`);
  console.log("🌐 Login Portal:   http://localhost:3000/admin/login");
  console.log("=======================================================\n");
}

function printUsage() {
  console.log(`
================================================================================
🛡️  LeastPass Administrator Terminal CLI
================================================================================

Usage:
  node scripts/admin.mjs <command> [arguments...]
  or
  npm run admin -- <command> [arguments...]

Commands:
  list                                          List all administrator accounts
  create <user> <pass> [email] [name] [role]   Create a new admin user
  update <user> <newPass> [newEmail] [newName]  Update an admin's password or info
  remove <user>                                 Remove/delete an admin user
  seed                                          Seed database with default admin & articles

Examples:
  node scripts/admin.mjs list
  node scripts/admin.mjs create devneeraj MySecr3t! neeraj@leastpass.com "Neeraj Rekwar"
  node scripts/admin.mjs update devneeraj NewP@ssw0rd!
  node scripts/admin.mjs remove devneeraj
  node scripts/admin.mjs seed

================================================================================
`);
}

// -------------------------------------------------------------
// CLI Runner
// -------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const command = (args[0] || "").toLowerCase();

  switch (command) {
    case "list":
    case "ls":
      await listAdmins();
      break;

    case "create":
    case "add":
      await createAdmin(args[1], args[2], args[3], args[4], args[5]);
      break;

    case "update":
    case "edit":
      await updateAdmin(args[1], args[2], args[3], args[4]);
      break;

    case "remove":
    case "delete":
    case "rm":
      await removeAdmin(args[1]);
      break;

    case "seed":
      await runSeed();
      break;

    case "--help":
    case "-h":
    case "help":
    default:
      printUsage();
      break;
  }
}

main().catch((err) => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
