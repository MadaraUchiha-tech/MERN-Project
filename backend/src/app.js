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
    exposedHeaders: ["Set-Cookie", "x-auth-token"],
  })
);

const port = process.env.PORT;

import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";

// Test endpoint to verify server is running
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

mongoose.connect(process.env.MONGODB_URI).then((res) => {
  console.log("mongoDB connected:" + res.connection.host);
  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
