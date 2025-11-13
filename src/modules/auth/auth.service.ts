import User from "../user/user.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (userData: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const { name, username, email, password } = userData;
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new Error("Tên đăng nhập hoặc email đã tồn tại");
  }

  const user = new User({ name, username, email, password });
  await user.save();

  const token = crypto.randomBytes(20).toString("hex");
  user.verifyEmailToken = token;
  await user.save();

  return user;
};

export const login = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }

  // if (!user.isVerified) {
  //   throw new Error("Tài khoản chưa được xác thực");
  // }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { user, token };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
  await user.save();

  // TODO: Send email with token (placeholder)
  console.log(`Reset token for ${email}: ${token}`);

  return { message: "Token reset password đã được gửi đến email" };
};

export const resetPassword = async (token: string, password: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return user;
};

export const profile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return user;
};
