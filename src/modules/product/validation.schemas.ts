import { z } from "zod";

const baseProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được rỗng").max(100, "Tên sản phẩm quá dài"),

  price: z
    .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
    .refine((val) => val > 0, { message: "Giá phải lớn hơn 0" })
    .refine((val) => val <= 999999999, { message: "Giá quá lớn" })
    .refine((val) => Number.isFinite(val), { message: "Giá phải là số hợp lệ" }),

  category: z.string().min(1, "Danh mục không được rỗng"),

  image: z.string().optional(),

  stock: z
    .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
    .refine((val) => Number.isInteger(val), { message: "Số lượng phải là số nguyên" })
    .refine((val) => val >= 0, { message: "Số lượng tồn kho phải >= 0" })
    .refine((val) => val <= 999999, { message: "Số lượng quá lớn" })
    .refine((val) => Number.isFinite(val), { message: "Số lượng phải là số hợp lệ" }),

  description: z.string().max(500, "Mô tả ngắn quá dài").optional(),

  detailedDescription: z.string().max(5000, "Mô tả chi tiết quá dài").optional(),
});

export const createProductSchema = baseProductSchema;
export const updateProductSchema = baseProductSchema.partial();

export const getProductsQuerySchema = z.object({
  category: z.string().min(1, "Slug danh mục không hợp lệ").optional(),
  search: z
    .string()
    .min(1, "Từ khóa tìm kiếm không được rỗng")
    .max(100, "Từ khóa quá dài")
    .optional(),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sản phẩm không hợp lệ"),
  }),
});
