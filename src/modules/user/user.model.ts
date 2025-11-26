import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  phone?: string;
  address?: {
    tinh_thanh?: string;
    quan_huyen?: string;
    phuong_xa?: string;
    dia_chi_chi_tiet?: string;
  };
  verifyEmailToken?: string;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date; // thêm dòng này
  updatedAt?: Date; // nếu cần

  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "/img/default-avatar.jpg" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String },
    address: {
      tinh_thanh: { type: String },
      quan_huyen: { type: String },
      phuong_xa: { type: String },
      dia_chi_chi_tiet: { type: String },
    },
    verifyEmailToken: { type: String },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

export default mongoose.model<IUser>("User", userSchema);
