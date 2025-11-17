import User from "./user.model";
import bcrypt from "bcryptjs";

interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

export const getUserById = async (id: string) => {
  return User.findById(id).select("-password"); // Exclude sensitive
};

export const getAllUsers = async (
  query: { role?: string; search?: string; limit?: number } = {}
) => {
  let filter: any = {};

  // Chỉ add role filter nếu query.role có giá trị
  if (query.role) {
    filter.role = query.role;
  }

  // Add search filter nếu có (override/add vào filter)
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  // Query: Exclude password, sort desc, limit nếu có
  return User.find(filter)
    .select("-password") // Ẩn password cho an toàn
    .sort({ createdAt: -1 })
    .limit(query.limit || 20); // Default 20 nếu không truyền
};

export const createUser = async (userData: CreateUserData) => {
  const { name, username, email, password, role = "user" } = userData;
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) throw new Error("Username hoặc email đã tồn tại");

  const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
  const user = new User({ name, username, email, password: hashedPassword, role });
  return user.save();
};

export const updateUser = async (id: string, updateData: Partial<CreateUserData>) => {
  // Không cho update password/role nếu không phải admin (handle ở controller)
  if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 12);
  return User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

export const deleteUser = async (id: string) => {
  return User.findByIdAndDelete(id);
};

export const getProfile = async (userId: string) => {
  return getUserById(userId); // Reuse
};
