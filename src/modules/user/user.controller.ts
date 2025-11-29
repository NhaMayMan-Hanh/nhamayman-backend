import { Request, Response } from "express";
import {
  getProfile,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./user.service";

// GET /api/client/users/profile
export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await getProfile(userId);
    if (!user) return res.status(404).json({ success: false, message: "User không tồn tại" });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        phone: user.phone || "",
        address: {
          tinh_thanh: user.address?.tinh_thanh || "",
          quan_huyen: user.address?.quan_huyen || "",
          phuong_xa: user.address?.phuong_xa || "",
          dia_chi_chi_tiet: user.address?.dia_chi_chi_tiet || "",
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// PUT /api/client/users/profile
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, username, email, phone, address } = req.body;

    // Validation
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Tên không được để trống" });
    }
    if (!username?.trim()) {
      return res.status(400).json({ success: false, message: "Username không được để trống" });
    }
    if (!email?.trim()) {
      return res.status(400).json({ success: false, message: "Email không được để trống" });
    }

    const updatedUser = await updateProfile(userId, {
      name,
      username,
      email,
      phone,
      address,
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        phone: updatedUser.phone || "",
        address: {
          tinh_thanh: updatedUser.address?.tinh_thanh || "",
          quan_huyen: updatedUser.address?.quan_huyen || "",
          phuong_xa: updatedUser.address?.phuong_xa || "",
          dia_chi_chi_tiet: updatedUser.address?.dia_chi_chi_tiet || "",
        },
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// ========== ADMIN CONTROLLERS ==========

export const getAllUsersAdminController = async (req: Request, res: Response) => {
  try {
    const { role, search, limit = 20 } = req.query;
    const users = await getAllUsers({
      role: (role as string) || undefined,
      search: search as string,
      limit: typeof limit === "string" ? parseInt(limit) : (limit as number),
    });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getUserByIdAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getProfile(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const createUserAdminController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Create user successfully",
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const updateUserAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await updateUser(id, req.body);
    res.json({ success: true, message: "Update user successfully", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const deleteUserAdminController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);
    res.json({ success: true, message: "Delete user successfully", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
