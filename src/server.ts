import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { swaggerUi, swaggerSpec } from "./config/swagger";
import { connectDB } from "./config/db";
import clientRoutes from "./routes/client/client.routes";
import adminRoutes from "./routes/admin/admin.routes";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(
   cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
   })
);

app.use(express.json());
app.use(cookieParser());
const maxRequests = process.env.NODE_ENV === "development" ? 10000 : 100;
const limiter = rateLimit({
   windowMs: 60 * 1000,
   max: maxRequests,
   message: {
      success: false,
      message: "Temporarily unavailable. Please try later.",
   },
});
app.use(limiter);
connectDB();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/client", clientRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
   res.json({ message: "NhaMayMan-Hanh Backend is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server is running at http://localhost:${PORT}`);
   console.log(`✔️ Swagger: http://localhost:${PORT}/api-docs`);
});
