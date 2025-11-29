import User from "./user.model";
import bcrypt from "bcryptjs";

interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

interface UpdateProfileData {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  address?: {
    tinh_thanh?: string;
    quan_huyen?: string;
    phuong_xa?: string;
    dia_chi_chi_tiet?: string;
  };
}

export const getUserById = async (id: string) => {
  return User.findById(id).select("-password -verifyEmailToken -resetPasswordToken");
};

export const getAllUsers = async (
  query: { role?: string; search?: string; limit?: number } = {}
) => {
  let filter: any = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  return User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(query.limit || 20);
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
  if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 12);
  return User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
};

export const deleteUser = async (id: string) => {
  return User.findByIdAndDelete(id);
};

export const getProfile = async (userId: string) => {
  return getUserById(userId);
};

// NEW: Update profile for logged-in user
export const updateProfile = async (userId: string, updateData: UpdateProfileData) => {
  const { name, username, email, phone, address } = updateData;

  // Check if username/email already exists (excluding current user)
  if (username || email) {
    const existing = await User.findOne({
      _id: { $ne: userId },
      $or: [...(username ? [{ username }] : []), ...(email ? [{ email }] : [])],
    });

    if (existing) {
      if (existing.username === username) throw new Error("Username đã tồn tại");
      if (existing.email === email) throw new Error("Email đã tồn tại");
    }
  }

  // Build update object
  const updates: any = {};
  if (name) updates.name = name;
  if (username) updates.username = username;
  if (email) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (address) updates.address = address;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select(
    "-password -verifyEmailToken -resetPasswordToken"
  );

  if (!updatedUser) throw new Error("User không tồn tại");
  return updatedUser;
};
