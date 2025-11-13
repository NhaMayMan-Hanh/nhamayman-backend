import { Router } from "express";
import productRoutes from "../../modules/product/product.routes.ts";
import categoryRoutes from "../../modules/category/category.routes.ts";
import blogRoutes from "../../modules/blog/blog.routes.ts";
import aboutRoutes from "../../modules/about/about.routes.ts";
import cartRoutes from "../../modules/cart/cart.routes.ts";
import orderRoutes from "../../modules/order/order.routes.ts";
import authRoutes from "../../modules/auth/auth.routes.ts";
import { getAllCategories } from "../../modules/category/category.service";
import { getAllProducts } from "../../modules/product/product.service";

const router = Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/blogs", blogRoutes);
router.use("/about", aboutRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);

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
