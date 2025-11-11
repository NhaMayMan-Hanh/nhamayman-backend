// src/modules/auth/auth.controller.ts (Controller - API endpoints)
import { Request, Response } from "express";
import { register, login, forgotPassword, resetPassword } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await register({ name, email, password });
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
      data: { userId: user._id, email: user.email },
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
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token },
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
      message: "Reset mật khẩu thành công. Vui lòng đăng nhập lại.",
      data: { userId: user._id, email: user.email },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
