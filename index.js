require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const pasteRoutes = require("./routes/pasteRoutes");

app.use(cors());
app.use(express.json());

let isConnected = false;

const MONGO_URI = process.env.MONGO_URI?.trim();

async function connectToMongoDB() {
  if (isConnected) return;
  if (!MONGO_URI) {
    console.error("MONGO_URI is not set");
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    lastConnectionError = null;
    console.log("MongoDB connected!");
  } catch (error) {
    lastConnectionError = error?.message || String(error);
    console.error("MongoDB connection error:", error);
  }
}

// Ensure DB connection is attempted before handling requests
app.use(async (req, res, next) => {
  await connectToMongoDB();
  next();
});

// Base API route (so /api works)
app.get("/api", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Paste API",
    health: "/api/healthz",
    pastes: "/api/pastes",
  });
});

app.get("/api/healthz", async (req, res) => {
  await connectToMongoDB();
  const dbOk = mongoose.connection.readyState === 1;
  res.status(200).json({
    ok: dbOk
  });
});
app.use("/api/pastes", pasteRoutes);

const isVercel = process.env.VERCEL === "1";
const PORT = process.env.PORT || 5000;
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
