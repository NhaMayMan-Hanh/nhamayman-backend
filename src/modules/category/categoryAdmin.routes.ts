import { Router } from "express";
import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller";
import { authenticate, isAdmin } from "@/middlewares/auth.middleware";
import { handleMulterError, uploadCategoryImage } from "@/middlewares/upload.middleware";
import { validate, validateParams } from "@/middlewares/validation.middleware";
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from "./validation.schemas";

const router = Router();

router.use(authenticate, isAdmin);

// GET /api/admin/categories (list, reuse public controller)
router.get("/", getCategoriesController);

// GET /api/admin/categories/:id
router.get("/:id", validateParams(categoryIdSchema), getCategoryByIdController);

// POST /api/admin/categories (create với upload)
router.post(
  "/",
  uploadCategoryImage.single("img"), // Field name "img" từ client form-data
  handleMulterError,
  validate(createCategorySchema),
  createCategoryController
);

// PUT /api/admin/categories/:id (update với upload optional)
router.put(
  "/:id",
  validateParams(categoryIdSchema),
  uploadCategoryImage.single("img"),
  handleMulterError,
  validate(updateCategorySchema),
  updateCategoryController
);

// DELETE /api/admin/categories/:id
router.delete("/:id", validateParams(categoryIdSchema), deleteCategoryController);

export default router;
