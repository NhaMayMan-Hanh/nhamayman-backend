import { Router } from "express";
import { getAboutController } from "./about.controller";

const router = Router();

// Public: GET /api/about (single, optional ?slug=ve-nhamayman-hanh)
router.get("/", getAboutController);

export default router;
