import { z } from "zod";

// Schema cho register
export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải ít nhất 2 ký tự").max(50, "Tên quá dài"),
  username: z
    .string()
    .min(3, "Tên đăng nhập phải ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập quá dài")
    .regex(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ chứa chữ và số"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").max(100, "Mật khẩu quá dài"),
});

// Schema cho login
export const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập không hợp lệ"),
  password: z.string().min(6, "Mật khẩu không hợp lệ"),
});

// Schema cho forgot
export const forgotSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

// Schema cho reset
export const resetSchema = z.object({
  token: z.string().min(1, "Token không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").max(100, "Mật khẩu quá dài"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải ít nhất 6 ký tự")
      .max(100, "Mật khẩu quá dài"),
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });
