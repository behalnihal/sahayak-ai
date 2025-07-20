import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached: MongooseConnection = (
  global as typeof globalThis & { mongoose?: MongooseConnection }
).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = (
    global as typeof globalThis & { mongoose?: MongooseConnection }
  ).mongoose = { conn: null, promise: null };
}

export const connectDb = async () => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "sahayak-ai",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};
