import { Request, Response } from "express";
import { getProfile, getAllUsers, createUser, updateUser, deleteUser } from "./user.service";
// Import schemas nếu cần validate ở đây

// Protected: Profile
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
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

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
      // Optional: Thêm meta { total: users.length, filteredBy: { role, search } }
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

// Admin: Create user
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

// Tương tự cho getByIdAdmin, updateAdmin, deleteAdmin (copy pattern)
// export const z = async (req: Request, res: Response) => {
//   /* ... */
// };
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
