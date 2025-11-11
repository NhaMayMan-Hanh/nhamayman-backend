// src/middlewares/auth.middleware.ts (Middleware cho protected routes - JWT)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};

export const adminProtect = (req: AuthRequest, res: Response, next: NextFunction) => {
  protect(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Không có quyền admin" });
    }
    next();
  });
};
