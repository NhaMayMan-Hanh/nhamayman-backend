// src/routes/admin/admin.routes.ts (Central router cho admin - với middleware auth chung)
import { Router } from "express";
import productRoutes from "../../modules/product/product.routes.ts";
// import categoryRoutes from "../../modules/category/category.routes.ts";
// Import thêm modules khác nếu cần, ví dụ: userRoutes, orderRoutes, etc.

const router = Router();

// Middleware auth admin chung (placeholder - sẽ tích hợp JWT sau)
const requireAdminAuth = (req, res, next) => {
  // TODO: Kiểm tra token và role = 'admin'
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

// Áp dụng middleware cho toàn bộ admin routes
router.use(requireAdminAuth);

// Mount module routes (protected)
router.use("/products", productRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/users", userRoutes);
// router.use("/orders", orderRoutes);

export default router;
