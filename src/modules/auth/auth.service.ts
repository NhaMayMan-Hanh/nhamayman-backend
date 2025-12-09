import User from "../user/user.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { user, token };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  // Tạo token
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
  await user.save();

  // Tạo reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  // Cấu hình transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   console.log("EMAIL_USER:", process.env.EMAIL_USER);
  //   console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "NO");

  // Nội dung email
  const mailOptions = {
    from: `"Nhà May Mắn Hạnh" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu - Nhà Máy Mận Hạnh",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Đặt lại mật khẩu</h1>
          </div>
          <div class="content">
            <p>Xin chào <strong>${user.name}</strong>,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
            </div>
            
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Lưu ý:</strong>
              <ul style="margin: 5px 0;">
                <li>Link này chỉ có hiệu lực trong <strong>10 phút</strong></li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
              </ul>
            </div>
            
            <p>Trân trọng,<br><strong>Đội ngũ Nhà Máy Mận Hạnh</strong></p>
          </div>
          <div class="footer">
            <p>Email này được gửi tự động, vui lòng không reply.</p>
            <p>&copy; 2024 Nhà Máy Mận Hạnh. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Gửi email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email reset password đã gửi đến: ${email}`);
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }

  return { message: "Email đặt lại mật khẩu đã được gửi" };
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

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error("Mật khẩu hiện tại không đúng");
  }

  // Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
  const isSameAsOld = await user.comparePassword(newPassword);
  if (isSameAsOld) {
    throw new Error("Mật khẩu mới không được trùng với mật khẩu hiện tại");
  }

  // Cập nhật mật khẩu mới (sẽ tự động hash qua pre-save hook)
  user.password = newPassword;
  await user.save();

  return user;
};

export const profile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return user;
};
