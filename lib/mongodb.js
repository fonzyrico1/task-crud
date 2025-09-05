import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function connectDB() {
  if (isConnected) return; // Already connected, skip

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "TaskManager", // ensures we use your DB name
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
