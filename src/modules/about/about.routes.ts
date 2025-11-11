import { Router } from "express";
import { getAboutController } from "./about.controller";

const router = Router();

router.get("/", getAboutController);

export default router;
