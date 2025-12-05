import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modules/product/product.model";
import Category from "../modules/category/category.model";
import Blog from "../modules/blog/blog.model";
import About from "../modules/about/about.model";
import User from "../modules/user/user.model";
import Order from "../modules/order/order.model";
import Cart from "../modules/cart/cart.model";

import { categoriesData } from "./data/categories";
import { productsData } from "./data/products";
import { blogsData } from "./data/blogs";
import { aboutData } from "./data/about";
import { usersData } from "./data/users";
import { ordersData } from "./data/orders";
import { cartData } from "./data/cart";
import { feedbackData } from "./data/feedback";
import feedback from "@/modules/feedback/feedback.model";
import notification from "@/modules/notification/notification.model";
import { notificationData } from "./data/notifications";
import { commentsData } from "./data/comments";
dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB for seeding");

    await Category.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});
    await About.deleteMany({});
    await feedback.deleteMany({});
    await notification.deleteMany({});
    // await User.deleteMany({});
    // await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log("🗑️ Cleared existing data");

    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Inserted ${categories.length} categories`);

    const products = await Product.insertMany(productsData);
    console.log(`✅ Inserted ${products.length} products`);

    const blogs = await Blog.insertMany(blogsData);
    console.log(`✅ Inserted ${blogs.length} blogs`);

    const about = await About.insertMany(aboutData);
    console.log(`✅ Inserted ${about.length} abouts`);

    const users = await User.insertMany(usersData);
    console.log(`✅ Inserted ${users.length} users`);

    const feedbacks = await feedback.insertMany(feedbackData);
    console.log(`✅ Inserted ${feedbacks.length} feedbacks`);

    const notifications = await notification.insertMany(notificationData);
    console.log(`✅ Inserted ${notifications.length} notifications`);

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
