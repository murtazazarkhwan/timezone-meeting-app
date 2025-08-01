import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "empty ";
// "mongodb+srv://glunitedesales:NHpoOfVFljTikjPN@cluster0.agnjll8.mongodb.net/test_db_for_dev?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// ✅ Use global cache to avoid reconnects during hot reload
const globalWithMongoose = global as typeof globalThis & {
  mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (globalWithMongoose.mongooseCache.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache.promise) {
    globalWithMongoose.mongooseCache.promise = mongoose.connect(MONGODB_URI);
  }

  globalWithMongoose.mongooseCache.conn = await globalWithMongoose.mongooseCache
    .promise;
  return globalWithMongoose.mongooseCache.conn;
}
