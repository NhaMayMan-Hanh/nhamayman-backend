import { Router } from "express";
import commentController from "./comment.controller";
import { authenticate, isAdmin } from "@/middlewares/auth.middleware";
import { validate, validateParams } from "@/middlewares/validation.middleware";
import { createCommentSchema, deleteCommentSchema } from "./comment.validation";

const router = Router();

router.use(authenticate, isAdmin);

router.get("/", commentController.getAllComments);

// Tạo bình luận thủ công (case admin nhập)
router.post(
   "/",
   validate(createCommentSchema),
   commentController.createComment
);

// Xóa bình luận
router.delete(
   "/:id",
   validateParams(deleteCommentSchema),
   commentController.deleteComment
);

export default router;
