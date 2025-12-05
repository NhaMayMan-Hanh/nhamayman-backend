import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sản phẩm không hợp lệ"),

  rating: z
    .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
    .refine((val) => Number.isInteger(val), { message: "Rating phải là số nguyên" })
    .refine((val) => val >= 1 && val <= 5, { message: "Rating phải từ 1 đến 5" }),

  content: z
    .string()
    .min(10, "Nội dung đánh giá phải có ít nhất 10 ký tự")
    .max(1000, "Nội dung đánh giá không được quá 1000 ký tự"),
});

export const updateReviewSchema = z.object({
  rating: z
    .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
    .refine((val) => Number.isInteger(val), { message: "Rating phải là số nguyên" })
    .refine((val) => val >= 1 && val <= 5, { message: "Rating phải từ 1 đến 5" })
    .optional(),

  content: z
    .string()
    .min(10, "Nội dung đánh giá phải có ít nhất 10 ký tự")
    .max(1000, "Nội dung đánh giá không được quá 1000 ký tự")
    .optional(),
});

export const reviewIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID đánh giá không hợp lệ"),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sản phẩm không hợp lệ"),
  }),
});

export const getReviewsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page phải là số hợp lệ").optional(),
  }),
});
