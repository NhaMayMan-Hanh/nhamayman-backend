import { Router } from "express";
import reviewController from "./review.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate, validateParams, validateQuery } from "@/middlewares/validation.middleware";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  productIdSchema,
  getReviewsQuerySchema,
} from "./review.validation";

const router = Router();

// [PUBLIC] Lấy reviews của sản phẩm
router.get(
  "/product/:productId",
  validateParams(productIdSchema),
  validateQuery(getReviewsQuerySchema),
  reviewController.getReviews
);

// [PUBLIC] Lấy thống kê rating của sản phẩm
router.get(
  "/product/:productId/stats",
  validateParams(productIdSchema),
  reviewController.getProductRating
);

// === CÁC ROUTE CẦN AUTHENTICATION ===
router.use(authenticate);

// [AUTH] Kiểm tra user có thể review không
router.get(
  "/product/:productId/can-review",
  validateParams(productIdSchema),
  reviewController.checkCanReview
);

// [AUTH] Lấy review của user cho sản phẩm cụ thể
router.get(
  "/product/:productId/my-review",
  validateParams(productIdSchema),
  reviewController.getUserReview
);

// [AUTH] Tạo review mới
router.post("/", validate(createReviewSchema), reviewController.createReview);

// [AUTH] Update review của user
router.put(
  "/:id",
  validateParams(reviewIdSchema),
  validate(updateReviewSchema),
  reviewController.updateReview
);

// [AUTH] Xóa review của user
router.delete("/:id", validateParams(reviewIdSchema), reviewController.deleteReview);

export default router;
