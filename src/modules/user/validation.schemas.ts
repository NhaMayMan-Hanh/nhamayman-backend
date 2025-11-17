import { z } from "zod";
export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6).optional(), // Optional cho admin create (set random?)
  role: z.enum(["user", "admin"]).optional().default("user"),
});

export const getAllUsersQuerySchema = z.object({
  role: z.enum(["user", "admin"]).optional(), // Chỉ allow enum values
  search: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20), // Coerce string -> number
});

export const updateUserSchema = createUserSchema.partial(); // Partial cho update
// Thêm query schema cho list: { role: z.enum(...).optional(), search: z.string().optional() }
