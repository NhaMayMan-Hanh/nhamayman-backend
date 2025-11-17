import { Router } from "express";
import { getBlogsController, getBlogBySlugController } from "./blog.controller";
import { validateQuery } from "../../middlewares/validation.middleware";
import { getBlogsQuerySchema } from "./validation.schemas";

const router = Router();

// Public: GET /api/blogs (list, optional ?search=keyword)
router.get("/", validateQuery(getBlogsQuerySchema), getBlogsController);

// Public: GET /api/blogs/:slug (detail by slug)
router.get("/:slug", getBlogBySlugController);

export default router;
