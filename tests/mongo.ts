// tests/mongo.ts
import mongoose from "mongoose";

async function testConnection() {
  const MONGODB_URL = "mongodb+srv://itsayush_k:aks25192006@cluster0.epopm33.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  if (!MONGODB_URL) {
    console.error("Missing MONGODB_URL environment variable");
    process.exit(1);
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGODB_URL, { dbName: "webtools" });
    console.log("MongoDB connected successfully!");
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

// Run the test
testConnection();
