import { Router } from "express";
import productPublicRoutes from "@/modules/product/productPublic.routes";
import categoryPublicRoutes from "@/modules/category/categoryPublic.routes";
import blogPublicRoutes from "@/modules/blog/blogPublic.routes";
import cartPublicRoutes from "@/modules/cart/cart.routes";
import orderPublicRoutes from "@/modules/order/orderPublic.routes";
import authPublicRoutes from "@/modules/auth/authPublic.routes";
import authProtectedRoutes from "@/modules/auth/authProtected.routes";
import aboutPublicRouter from "@/modules/about/aboutPublic.routes";
import userProtectedRoutes from "@/modules/user/userProtected.routes";
import { getActiveCategories } from "@/modules/category/category.service";
import { getAllProducts } from "@/modules/product/product.service";
import { getAllBlogs } from "@/modules/blog/blog.service";
import feedbackRoutes from "@/modules/feedback/feedback.routes";
import notificationRoutes from "@/modules/notification/notification.routes";
import reviewPublicRoutes from "@/modules/review/reviewPublic.routes";
import commentPublicRoutes from "@/modules/comment/commentPublic.routes";

const router = Router();

router.get("/", (req, res) => {
  res.json("Hello from client routes");
});

router.use("/products", productPublicRoutes);
router.use("/categories", categoryPublicRoutes);
router.use("/blogs", blogPublicRoutes);
router.use("/about", aboutPublicRouter);
router.use("/cart", cartPublicRoutes);
router.use("/orders", orderPublicRoutes);
router.use("/auth/logout", authProtectedRoutes);
router.use("/auth", authPublicRoutes);
router.use("/users", userProtectedRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/notification", notificationRoutes);
router.use("/comments", commentPublicRoutes);
router.use("/reviews", reviewPublicRoutes);

router.get("/home", async (req, res) => {
  try {
    const categories = await getActiveCategories();

    const homeProducts = await getAllProducts({});

    const homeBlogs = (await getAllBlogs()).slice(0, 4);

    // Group products by category name (limit 8 each)
    const productsByCategory: { [key: string]: any[] } = {};

    homeProducts.forEach((product: any) => {
      const catName = product.category;

      if (!productsByCategory[catName]) {
        productsByCategory[catName] = [];
      }
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
        homeBlogs,
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
