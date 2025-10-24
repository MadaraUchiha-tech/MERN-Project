import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mern-project-two-silk.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie", "x-access-token"],
    exposedHeaders: ["Set-Cookie", "x-auth-token", "x-access-token"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Handle preflight requests
app.options('*', (req, res) => {
  // Send response to preflight request
  res.status(204).end();
});

const port = process.env.PORT;

import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";

// Test endpoint to verify server is running
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

// Explicitly handle CORS preflight for any route (ensures custom headers are allowed)
app.options("*", (req, res) => {
  const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie, Set-Cookie, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(204);
});

mongoose.connect(process.env.MONGODB_URI).then((res) => {
  console.log("mongoDB connected:" + res.connection.host);
  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
