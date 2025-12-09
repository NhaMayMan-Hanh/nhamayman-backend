import { Router } from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} from "./auth.controller";
import { validate } from "@/middlewares/validation.middleware";
import { authenticate, isAdmin } from "@/middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  forgotSchema,
  resetSchema,
  changePasswordSchema,
} from "./validation.schemas";

import rateLimit from "express-rate-limit";

const router = Router();

// Rate limit riêng cho LOGIN
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5, // Tối đa 5 lần / phút
  message: {
    success: false,
    message: "Temporarily unavailable. Please try later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// APPLY LIMITER TO LOGIN
router.post("/login", loginLimiter, validate(loginSchema), loginController);

router.put(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePasswordController
);

router.post("/register", validate(registerSchema), registerController);
router.post("/forgot", validate(forgotSchema), forgotPasswordController);
router.post("/reset", validate(resetSchema), resetPasswordController);

export default router;
