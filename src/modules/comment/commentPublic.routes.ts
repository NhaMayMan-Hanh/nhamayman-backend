import { Router } from "express";
import commentController from "./comment.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate, validateParams, validateQuery } from "@/middlewares/validation.middleware";
import {
  createCommentSchema,
  getCommentsParamsSchema,
  getCommentsQuerySchema,
} from "./comment.validation";

const router = Router();

// [PUBLIC] Lấy comments của sản phẩm
router.get(
  "/product/:productId",
  validateParams(getCommentsParamsSchema),
  validateQuery(getCommentsQuerySchema),
  commentController.getComments
);

router.use(authenticate);

router.post("/", validate(createCommentSchema), commentController.createComment);

export default router;
