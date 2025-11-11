import { Router } from "express";
import { getCategoriesController } from "./category.controller";

const router = Router();

// GET /categories - Lấy tất cả categories
router.get("/", getCategoriesController);

export default router;
