import { Request, Response } from "express";
import { register, login, forgotPassword, resetPassword, profile } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await register({ name, username, email, password });
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      // data: { userId: user._id, name: user.name, username: user.username, email: user.email },
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
      // secure: true, // bật khi dùng HTTPS
      sameSite: "strict",
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

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await profile(userId); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User không tồn tại" });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
