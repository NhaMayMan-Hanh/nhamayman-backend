import { Router } from "express";
import { getBlogsController, getBlogBySlugController } from "./blog.controller";

const router = Router();

// GET /blogs - Lấy tất cả blogs
router.get("/", getBlogsController);

// GET /blogs/:slug - Lấy blog chi tiết theo slug
router.get("/:slug", getBlogBySlugController);

export default router;
