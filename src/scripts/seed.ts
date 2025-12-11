import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "../modules/product/product.model";
import Category from "../modules/category/category.model";
import Blog from "../modules/blog/blog.model";
import About from "../modules/about/about.model";
import User from "../modules/user/user.model";
import Order from "../modules/order/order.model";
import Cart from "../modules/cart/cart.model";
import feedback from "@/modules/feedback/feedback.model";
import notification from "@/modules/notification/notification.model";
import Comment from "../modules/comment/comment.model";
import Review from "../modules/review/review.model";

import { categoriesData } from "./data/categories";
import { productsData } from "./data/products";
import { blogsData } from "./data/blogs";
import { aboutData } from "./data/about";
import { usersData } from "./data/users";
import { ordersData } from "./data/orders";
import { cartData } from "./data/cart";
import { feedbackData } from "./data/feedback";
import { notificationData } from "./data/notifications";
import { commentsData } from "./data/comments";

dotenv.config();

// =======================
//  TẠO SLUG CHUẨN
// =======================
const createSlug = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove weird chars
    .trim()
    .replace(/\s+/g, "-");
};

// =======================
//  CHUYỂN ĐỔI _id TỪ MONGO ATLAS EXPORT
// =======================
const convertObjectId = (item: any): any => {
  if (item._id && item._id.$oid) {
    item._id = new mongoose.Types.ObjectId(item._id.$oid);
  }

  // Đệ quy xử lý cả các field con (ví dụ: userId, productId trong order.items, comment.author, v.v.)
  Object.keys(item).forEach((key) => {
    if (item[key] && typeof item[key] === "object" && item[key].$oid) {
      item[key] = new mongoose.Types.ObjectId(item[key].$oid);
    }

    // Xử lý mảng (rất hay gặp trong order.items, cart.items, v.v.)
    if (Array.isArray(item[key])) {
      item[key] = item[key].map((elem: any) => {
        if (elem && elem.$oid) return new mongoose.Types.ObjectId(elem.$oid);
        if (elem && typeof elem === "object") return convertObjectId(elem);
        return elem;
      });
    }

    // Đệ quy sâu hơn nếu cần
    if (
      item[key] &&
      typeof item[key] === "object" &&
      !Array.isArray(item[key]) &&
      !(item[key] instanceof mongoose.Types.ObjectId)
    ) {
      convertObjectId(item[key]);
    }
  });

  return item;
};

// =======================
//  UPSERT MỘT CÁCH AN TOÀN (theo _id)
// =======================
const upsertMany = async (Model: any, data: any[], label: string) => {
  if (!data || data.length === 0) {
    console.log(`No ${label} to seed`);
    return;
  }

  const withId: any[] = [];
  const withoutId: any[] = [];

  for (let item of data) {
    // QUAN TRỌNG: Chuyển đổi toàn bộ _id dạng $oid thành ObjectId thật
    convertObjectId(item);

    // Tạo slug
    if (item.name && !item.slug) {
      item.slug = createSlug(item.name);
    }

    if (item._id) {
      withId.push(item);
    } else {
      withoutId.push(item);
    }
  }

  // 1. Những cái có _id → update chính xác theo _id cũ
  for (const item of withId) {
    await Model.updateOne({ _id: item._id }, { $set: item }, { upsert: true });
  }

  // 2. Những cái không có _id → tạo mới (nếu cần)
  if (withoutId.length > 0) {
    await Model.insertMany(withoutId, { ordered: false } as any);
  }

  console.log(`Upserted ${data.length} ${label}`);
};

// =======================
//  SEED CHÍNH
// =======================
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    // ==========================
    //  CLEAN LOCAL TRƯỚC KHI IMPORT
    // ==========================
    console.log("🧹 Cleaning local database...");

    await Product.deleteMany({});
    await Category.deleteMany({});
    // await Blog.deleteMany({});
    // await About.deleteMany({});
    // await User.deleteMany({});
    // await Order.deleteMany({});
    // await Cart.deleteMany({});
    // await feedback.deleteMany({});
    // await notification.deleteMany({});
    // await Comment.deleteMany({});
    // await Review.deleteMany({});

    console.log("🗑 Clean done! Local DB is EMPTY.");

    // ==========================
    //  IMPORT & UPSERT DỮ LIỆU CỦA PRODUCTION (EXPORT VỀ)
    // ==========================
    console.log("📥 Importing production data to local...");

    await upsertMany(Category, categoriesData, "categories");
    await upsertMany(Product, productsData, "products");
    // await upsertMany(Blog, blogsData, "blogs");
    // await upsertMany(About, aboutData, "about info");
    // await upsertMany(User, usersData, "users");
    // await upsertMany(Order, ordersData, "orders");
    // await upsertMany(Cart, cartData, "cart");
    // await upsertMany(feedback, feedbackData, "feedback");
    // await upsertMany(notification, notificationData, "notifications");
    // await upsertMany(Comment, commentsData, "comments");

    console.log("🎉 Seed update completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
