// blog.routes.ts

import { Router } from "express";
import {
   getBlogsController,
   getBlogBySlugController,
   handleToggleLikeBlog,
   handleAddComment, // Thêm mới
} from "./blog.controller";
import { validateQuery } from "@/middlewares/validation.middleware";
import { getBlogsQuerySchema } from "./validation.schemas";

const router = Router();

// Public routes
router.get("/", validateQuery(getBlogsQuerySchema), getBlogsController);
router.get("/:slug", getBlogBySlugController);

// Protected routes (cần đăng nhập)
router.post("/:id/like", handleToggleLikeBlog);
router.post("/:id/comments", handleAddComment); // Route mới

export default router;
