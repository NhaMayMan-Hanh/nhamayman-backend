import { Router } from "express";
import { getProfileController /* updateProfileController nếu có */ } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware"; // Nếu cần schema cho update

const router = Router();
router.use(authenticate);

router.get("/profile", getProfileController);
// router.put("/profile", validate(updateProfileSchema), updateProfileController);

export default router;
