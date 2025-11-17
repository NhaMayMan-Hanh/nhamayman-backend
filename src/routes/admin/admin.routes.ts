import { Router } from "express";
import categoryAdminRoutes from "../../modules/category/categoryAdmin.routes";
import productAdminRoutes from "../../modules/product/productAdmin.routes";
import userAdminRoutes from "../../modules/user/userAdmin.routes";
import aboutAdminRouter from "../../modules/about/aboutAdmin.routes";
import blogAdminRouter from "../../modules/blog/blogAdmin.routes";
import orderAdminRouter from "../../modules/order/orderAdmin.routes";

const router = Router();

router.use("/categories", categoryAdminRoutes);
router.use("/products", productAdminRoutes);
router.use("/users", userAdminRoutes);
router.use("/about", aboutAdminRouter);
router.use("/blogs", blogAdminRouter);
router.use("/orders", orderAdminRouter);

export default router;
