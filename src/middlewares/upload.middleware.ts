import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

// Hàm tạo multer storage linh hoạt
const createStorage = (folder: string, prefix: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

// File filter chung
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)"));
  }
};

// Hàm tạo middleware upload với storage, fileFilter và giới hạn kích thước
const createUpload = (folder: string, prefix: string, maxSizeMB: number) =>
  multer({
    storage: createStorage(folder, prefix),
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

// Dùng chung cho product và category
export const uploadProductImage = createUpload("uploads/products/", "product", 5);
export const uploadCategoryImage = createUpload("uploads/categories/", "category", 2);
export const uploadAboutImage = createUpload("uploads/about/", "about", 2);
export const uploadBlogImage = createUpload("uploads/blogs/", "blog", 2);

// Xử lý lỗi multer
export const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File ảnh quá lớn" });
    }
  }

  if (error instanceof Error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  next(error);
  
};
