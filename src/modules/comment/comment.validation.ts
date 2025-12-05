import { z } from "zod";

export const createCommentSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sản phẩm không hợp lệ"),
  content: z
    .string()
    .min(1, "Nội dung không được rỗng")
    .max(1000, "Nội dung không được quá 1000 ký tự"),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID bình luận không hợp lệ"),
  }),
});

export const getCommentsParamsSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sản phẩm không hợp lệ"),
  }),
});

export const getCommentsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page phải là số hợp lệ").optional(),
  }),
});
