import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

// Middleware bảo vệ route
export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Không có token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log("Decoded token:", decoded);

    // Gán đúng cách cho req.user
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    console.log("req.user after assignment:", req.user);

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware bảo vệ quyền admin
export const adminProtect = (req: Request, res: Response, next: NextFunction) => {
  protect(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Không có quyền admin" });
    }
    next();
  });
};
