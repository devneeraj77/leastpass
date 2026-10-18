import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export function getCleanDbName(): string {
  const envDb = process.env.MONGODB_DB;
  if (envDb && !envDb.includes(".") && !envDb.startsWith("mongodb") && !envDb.includes("/")) {
    return envDb.trim();
  }
  return "leastpass";
}

export async function getDatabase() {
  if (!clientPromise) {
    return null;
  }
  const client = await clientPromise;
  const dbName = getCleanDbName();
  return client.db(dbName);
}

export default clientPromise;
