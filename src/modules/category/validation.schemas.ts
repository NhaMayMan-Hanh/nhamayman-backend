import { z } from "zod";

// Base schema cho category
const baseCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được rỗng").max(100, "Tên quá dài"),
  img: z.string().optional(), // Set sau upload, không validate .url() (relative path)
  slug: z
    .string()
    .min(1, "Slug không được rỗng")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang")
    .max(50, "Slug quá dài"),
  description: z.string().max(500, "Mô tả quá dài").optional(),
});

// Create: Required name/slug, img optional (upload set)
export const createCategorySchema = baseCategorySchema.pick({
  name: true,
  slug: true,
  description: true,
});

// Update: Partial
export const updateCategorySchema = baseCategorySchema.partial();

// Query cho GET list (optional)
export const getCategoriesQuerySchema = z.object({
  search: z.string().min(1, "Từ khóa không được rỗng").max(100).optional(),
});

// ID schema cho :id
export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID danh mục không hợp lệ"),
  }),
});
