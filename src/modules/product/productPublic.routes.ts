import { Router } from "express";
import {
  getProductsController,
  getProductBySlugController,
  getProductByIdController,
} from "./product.controller";
import { validateQuery, validateParams } from "@/middlewares/validation.middleware";
import { getProductsQuerySchema, productIdSchema } from "./validation.schemas";

const router = Router();

router.get("/", validateQuery(getProductsQuerySchema), getProductsController);

router.get("/:slug", getProductBySlugController);

// router.get("/:id", validateParams(productIdSchema), getProductByIdController);

export default router;
