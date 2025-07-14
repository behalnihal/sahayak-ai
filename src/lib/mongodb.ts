import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/sahayak-ai";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

let cached = global.mongoose as
  | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  | undefined;
if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default dbConnect;
