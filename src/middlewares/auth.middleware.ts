import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

// Extend Request để thêm user property (nếu chưa có, thêm vào types/express.d.ts)
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware xác thực token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Không có token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
    };

    console.log("Authenticated user:", req.user);

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware kiểm tra quyền admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Không có quyền admin" });
  }
  next();
};
