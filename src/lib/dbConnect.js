import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

// Use a global variable to cache the connection (helps in Next.js & serverless environments)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB Connection Error:", error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset the promise if connection fails
    throw error;
  }
}

export default dbConnect;
