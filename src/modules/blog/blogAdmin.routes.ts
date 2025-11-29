import { Router } from "express";
import {
  getAllBlogsAdminController,
  getBlogByIdController,
  createBlogController,
  updateBlogController,
  deleteBlogController,
} from "./blog.controller";
import { authenticate, isAdmin } from "@/middlewares/auth.middleware";
import { handleMulterError, uploadBlogImage } from "@/middlewares/upload.middleware";
import { validate, validateParams } from "@/middlewares/validation.middleware";
import { createBlogSchema, updateBlogSchema, blogIdSchema } from "./validation.schemas";

const router = Router();

// Auth + Admin middleware cho toàn bộ
router.use(authenticate, isAdmin);

// GET /api/admin/blogs (list, optional search)
router.get("/", getAllBlogsAdminController);

// GET /api/admin/blogs/:id
router.get("/:id", validateParams(blogIdSchema), getBlogByIdController);

// POST /api/admin/blogs (create với upload)
router.post(
  "/",
  uploadBlogImage.single("img"), // Field name "img"
  handleMulterError,
  validate(createBlogSchema),
  createBlogController
);

// PUT /api/admin/blogs/:id (update với upload optional)
router.put(
  "/:id",
  validateParams(blogIdSchema),
  uploadBlogImage.single("img"),
  handleMulterError,
  validate(updateBlogSchema),
  updateBlogController
);

// DELETE /api/admin/blogs/:id
router.delete("/:id", validateParams(blogIdSchema), deleteBlogController);

export default router;
