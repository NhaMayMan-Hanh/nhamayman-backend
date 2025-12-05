import { Router } from "express";
import reviewController from "./review.controller";
import { authenticate, isAdmin } from "@/middlewares/auth.middleware";
import { validateParams } from "@/middlewares/validation.middleware";
import { reviewIdSchema } from "./review.validation";

const router = Router();

router.use(authenticate, isAdmin);

// [ADMIN] Xóa bất kỳ review nào
router.delete("/:id", validateParams(reviewIdSchema), reviewController.deleteReviewAdmin);

export default router;
