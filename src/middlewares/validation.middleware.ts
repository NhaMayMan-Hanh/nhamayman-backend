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
          message: errorMessages || "Body request error",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(400).json({
        success: false,
        message: "Error validate body request",
      });
    }
  };
};

// Validate query params
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ query: req.query });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => e.message).join(", ");
        return res.status(400).json({
          success: false,
          message: errorMessages || "Query params error",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(400).json({ success: false, message: "Error validate query" });
    }
  };
};

// Validate params (e.g., :id)
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ params: req.params });
      next();
    } catch (error) {
      // Tương tự như trên...
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => e.message).join(", ");
        return res.status(400).json({
          success: false,
          message: errorMessages || "Params error",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(400).json({ success: false, message: "Error validate params" });
    }
  };
};
