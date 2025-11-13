import { Router } from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getProfileController,
} from "./auth.controller";
import { validate } from "../../middlewares/validation.middleware";
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "./validation.schemas";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), registerController);

router.post("/login", validate(loginSchema), loginController);

router.post("/forgot", validate(forgotSchema), forgotPasswordController);

router.post("/reset", validate(resetSchema), resetPasswordController);

router.get("/profile", protect, getProfileController);

export default router;
