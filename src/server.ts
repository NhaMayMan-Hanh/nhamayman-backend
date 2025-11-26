import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
// XÓA dòng này: import { fileURLToPath } from "url";
import { swaggerUi, swaggerSpec } from "./config/swagger";
import { connectDB } from "./config/db";
import clientRoutes from "./routes/client/client.routes";
import adminRoutes from "./routes/admin/admin.routes";

dotenv.config();

// Trong CommonJS, __dirname có sẵn, không cần import.meta.url
// XÓA 2 dòng này:
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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
