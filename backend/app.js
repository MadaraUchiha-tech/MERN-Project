import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { app, server } from "./lib/socket.js";

dotenv.config();

const __dirname = path.resolve();
const port = process.env.PORT || 8000;

// CORS setup
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://mern-project-2os6.onrender.com"
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Routes
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// Serve frontend (only in production)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// MongoDB + server start
mongoose.connect(process.env.MONGODB_URI).then((res) => {
  console.log("MongoDB connected: " + res.connection.host);
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
