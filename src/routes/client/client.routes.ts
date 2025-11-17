import { Router } from "express";
import productPublicRoutes from "../../modules/product/productPublic.routes.ts";
import categoryPublicRoutes from "../../modules/category/categoryPublic.routes";
import blogPublicRoutes from "../../modules/blog/blogPublic.routes";
import cartRoutes from "../../modules/cart/cart.routes.ts";
import orderPublicRoutes from "../../modules/order/orderPublic.routes.ts";
import authPublicRoutes from "../../modules/auth/authPublic.routes.ts";
import aboutPublicRouter from "../../modules/about/aboutPublic.routes";
import userProtectedRoutes from "../../modules/user/userProtected.routes";
import { getAllCategories } from "../../modules/category/category.service";
import { getAllProducts } from "../../modules/product/product.service";

const router = Router();

router.use("/products", productPublicRoutes);
router.use("/categories", categoryPublicRoutes);
router.use("/blogs", blogPublicRoutes);
router.use("/about", aboutPublicRouter);
router.use("/cart", cartRoutes);
router.use("/orders", orderPublicRoutes);
router.use("/auth", authPublicRoutes);
router.use("/users", userProtectedRoutes);

router.get("/home", async (req, res) => {
  try {
    const categories = await getAllCategories();
    const allProducts = await getAllProducts({});

    // Group products by category name (limit 8 each)
    const productsByCategory: { [key: string]: any[] } = {};
    allProducts.forEach((product: any) => {
      const catName = product.category;

      if (!productsByCategory[catName]) {
        productsByCategory[catName] = [];
      }

      // Chỉ push nếu chưa quá 8 sản phẩm
      if (productsByCategory[catName].length < 8) {
        productsByCategory[catName].push(product);
      }
    });

    res.json({
      success: true,
      message: "Successfully get data home",
      data: {
        categories,
        productsByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get data home",
      error: (error as Error).message,
    });
  }
});

export default router;
