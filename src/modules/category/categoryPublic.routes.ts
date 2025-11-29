import { Router } from "express";
import { getCategoriesController } from "./category.controller";
import { validateQuery } from "@/middlewares/validation.middleware";
import { getCategoriesQuerySchema } from "./validation.schemas";

const router = Router();

// Public: GET /api/categories (list, optional search)
router.get("/", validateQuery(getCategoriesQuerySchema), getCategoriesController);

export default router;
