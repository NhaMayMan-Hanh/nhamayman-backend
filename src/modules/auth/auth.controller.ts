import { Request, Response } from "express";
import { register, login, forgotPassword, resetPassword } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
   try {
      const { name, username, email, password } = req.body;
      const user = await register({ name, username, email, password });
      res.status(201).json({
         success: true,
         message: "Đăng ký tài khoản thành công",
         data: {
            user: {
               id: user._id,
               name: user.name,
               username: user.username,
               email: user.email,
               role: user.role,
            },
         },
         // Optional: Send verify email với token
      });
   } catch (error) {
      res.status(400).json({
         success: false,
         message: (error as Error).message,
      });
   }
};
export const loginController = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;
      const { user, token } = await login(username, password);

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
         httpOnly: true,
         sameSite: isProduction ? "none" : "lax",
         secure: isProduction, // Chỉ bật HTTPS ở production
         maxAge: 7 * 24 * 60 * 60 * 1000,
         path: "/",
         ...(isProduction && {
            domain: ".nhamayman-hanh.io.vn",
         }),
      });
      res.json({
         success: true,
         message: "Đăng nhập thành công",
         data: {
            user: {
               id: user._id,
               name: user.name,
               username: user.username,
               email: user.email,
               role: user.role,
            },
         },
      });
   } catch (error) {
      res.status(401).json({
         success: false,
         message: (error as Error).message,
      });
   }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
   try {
      const { email } = req.body;
      const result = await forgotPassword(email);
      res.json({
         success: true,
         message: result.message,
      });
   } catch (error) {
      res.status(400).json({
         success: false,
         message: (error as Error).message,
      });
   }
};

export const resetPasswordController = async (req: Request, res: Response) => {
   try {
      const { token, password } = req.body;
      const user = await resetPassword(token, password);
      res.json({
         success: true,
         message: "Reset password successfully",
         data: { userId: user._id, email: user.email },
      });
   } catch (error) {
      res.status(400).json({
         success: false,
         message: (error as Error).message,
      });
   }
};

export const logoutController = async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    ...(isProduction && {
      domain: ".nhamayman-hanh.io.vn",
    }),
  });

  res.json({ success: true, message: "Đăng xuất thành công" });
};
