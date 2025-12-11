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

router.get("/id/:id", validateParams(productIdSchema), getProductByIdController);
router.get("/slug/:slug", getProductBySlugController);

export default router;
