import { Router } from "express";
import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./product.controller";
import { authenticate, isAdmin } from "../../middlewares/auth.middleware";
import { handleMulterError, uploadProductImage } from "../../middlewares/upload.middleware";
import { validate, validateQuery, validateParams } from "../../middlewares/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
  productIdSchema,
} from "./validation.schemas";

const router = Router();

router.use(authenticate, isAdmin);

router.get("/", validateQuery(getProductsQuerySchema), getProductsController);

router.get("/:id", validateParams(productIdSchema), getProductByIdController);

router.post(
  "/",
  uploadProductImage.single("image"),
  handleMulterError,
  validate(createProductSchema),
  createProductController
);

router.put(
  "/:id",
  validateParams(productIdSchema),
  uploadProductImage.single("image"),
  handleMulterError,
  validate(updateProductSchema),
  updateProductController
);

router.delete("/:id", validateParams(productIdSchema), deleteProductController);

export default router;
