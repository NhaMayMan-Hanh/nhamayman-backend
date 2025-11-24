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

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      // secure: process.env.NODE_ENV === 'production',
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
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.json({ success: true, message: "Đăng xuất thành công" });
};
