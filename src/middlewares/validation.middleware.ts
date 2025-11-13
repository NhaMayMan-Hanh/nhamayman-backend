import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => e.message).join(", ");

        return res.status(400).json({
          success: false,
          message: errorMessages || "Dữ liệu không hợp lệ",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(400).json({
        success: false,
        message: "Lỗi validation",
      });
    }
  };
};
