import { Router } from "express";
import { logoutController } from "./auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.post("/", logoutController);

export default router;
