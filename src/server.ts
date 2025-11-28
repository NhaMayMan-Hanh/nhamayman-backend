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
import { httpLogger, errorLogger, completeActivityLog } from './middlewares/logging.middleware';
import Logger from './utils/logger';
import activityRoutes from './routes/admin/activity.routes';
dotenv.config();

// Trong CommonJS, __dirname có sẵn, không cần import.meta.url
// XÓA 2 dòng này:
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
// Logging middlewares 
app.use(httpLogger);
app.use(completeActivityLog);
Logger.info('📊 Logging system initialized');


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
app.use('/api/admin/activities', activityRoutes);
app.use(errorLogger);

app.get("/", (req, res) => {
  res.json({ 
    message: "NhaMayMan-Hanh Backend is running!",
    timestamp: new Date(),
    status: "ok"
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use((req, res) => {
  Logger.warn(`⚠️ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorLogger);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  Logger.error(`❌ Error: ${message} - URL: ${req.originalUrl} - Method: ${req.method}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    }),
  });
});

app.get("/", (req, res) => {
  res.json({ message: "NhaMayMan-Hanh Backend is running!" });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  Logger.info(`🚀 Server is running at http://localhost:${PORT}`);
  Logger.info(`✔️ Swagger: http://localhost:${PORT}/api-docs`);
  Logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  Logger.info(`📊 Activity Logs: http://localhost:${PORT}/api/admin/activities`);
  
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`✔️ Swagger: http://localhost:${PORT}/api-docs`);
});

// ============================================
// ERROR HANDLERS
// ============================================
process.on('unhandledRejection', (err: any) => {
  Logger.error(`❌ Unhandled Rejection: ${err.message}`);
  Logger.error(`Stack: ${err.stack}`);
  console.error('Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err: any) => {
  Logger.error(`❌ Uncaught Exception: ${err.message}`);
  Logger.error(`Stack: ${err.stack}`);
  console.error('Uncaught Exception:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
