// src/server.ts (Cập nhật - mount central routers)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.ts";
import clientRoutes from "./routes/client/client.routes.ts";
// import adminRoutes from "./routes/admin/admin.routes.ts";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

connectDB();

// Client Routes (public)
app.use("/api/client", clientRoutes);

// Admin Routes (protected)
// app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  return res.json({
    message: "✅ NhaMayMan-Hanh Backend is running!",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
