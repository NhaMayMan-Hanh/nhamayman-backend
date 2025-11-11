// src/modules/auth/auth.routes.ts (Routes)
import { Router } from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller";

const router = Router();

// POST /auth/register
router.post("/register", registerController);

// POST /auth/login
router.post("/login", loginController);

// POST /auth/forgot
router.post("/forgot", forgotPasswordController);

// POST /auth/reset
router.post("/reset", resetPasswordController);

export default router;
