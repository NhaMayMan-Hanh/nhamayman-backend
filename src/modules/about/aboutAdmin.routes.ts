import { Router } from "express";
import {
  getAllAboutController,
  getAboutByIdController,
  createAboutController,
  updateAboutController,
  deleteAboutController,
} from "./about.controller";
import { authenticate, isAdmin } from "../../middlewares/auth.middleware";
import { handleMulterError, uploadAboutImage } from "../../middlewares/upload.middleware";
import { validate, validateParams } from "../../middlewares/validation.middleware";
import { createAboutSchema, updateAboutSchema, aboutIdSchema } from "./validation.schemas";

const router = Router();

// Auth + Admin middleware cho toàn bộ
router.use(authenticate, isAdmin);

// GET /api/admin/about (list all)
router.get("/", getAllAboutController);

// GET /api/admin/about/:id
router.get("/:id", validateParams(aboutIdSchema), getAboutByIdController);

// POST /api/admin/about (create với upload)
router.post(
  "/",
  uploadAboutImage.single("img"), // Field name "img"
  handleMulterError,
  validate(createAboutSchema),
  createAboutController
);

// PUT /api/admin/about/:id (update với upload optional)
router.put(
  "/:id",
  validateParams(aboutIdSchema),
  uploadAboutImage.single("img"),
  handleMulterError,
  validate(updateAboutSchema),
  updateAboutController
);

// DELETE /api/admin/about/:id
router.delete("/:id", validateParams(aboutIdSchema), deleteAboutController);

export default router;
