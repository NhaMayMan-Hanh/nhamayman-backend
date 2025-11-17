import { z } from "zod";

// Base schema cho about
const baseAboutSchema = z.object({
  name: z.string().min(1, "Tên không được rỗng").max(100, "Tên quá dài"),
  img: z.string().optional(), // Set sau upload
  slug: z
    .string()
    .min(1, "Slug không được rỗng")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang")
    .max(50, "Slug quá dài"),
  description: z.string().max(500, "Mô tả quá dài").optional(),
  content: z
    .string()
    .min(1, "Nội dung không được rỗng")
    .max(10000, "Nội dung quá dài (max 10k chars)"), // HTML content
});

// Create: Required name/slug/content
export const createAboutSchema = baseAboutSchema.pick({
  name: true,
  slug: true,
  description: true,
  content: true,
});

// Update: Partial
export const updateAboutSchema = baseAboutSchema.partial();

// ID schema cho :id
export const aboutIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID about không hợp lệ"),
  }),
});
