import { Router } from "express";
import {
  getAllUsersAdminController,
  getUserByIdAdminController,
  createUserAdminController,
  updateUserAdminController,
  deleteUserAdminController,
} from "./user.controller";
import { authenticate, isAdmin } from "../../middlewares/auth.middleware";
import { validate, validateQuery } from "../../middlewares/validation.middleware";
import {
  createUserSchema,
  getAllUsersQuerySchema,
  updateUserSchema /* from user schemas */,
} from "./validation.schemas";

const router = Router();
router.use(authenticate, isAdmin);

// http://localhost:5000/api/admin/users?role=admin
// GET http://localhost:5000/api/admin/users?role=user
// GET http://localhost:5000/api/admin/users?search=hello&limit=5 → Tìm name/email chứa "hello", max 5.
router.get("/", validateQuery(getAllUsersQuerySchema), getAllUsersAdminController);
router.get("/:id", getUserByIdAdminController);
router.post("/", validate(createUserSchema), createUserAdminController);
router.put("/:id", validate(updateUserSchema), updateUserAdminController);
router.delete("/:id", deleteUserAdminController);

export default router;
