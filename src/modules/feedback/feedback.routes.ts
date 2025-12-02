import express from "express";
import feedbackController from "./feedback.controller";
const feedbackRoutes = express.Router();

// ✅ PUBLIC: User gửi feedback (không cần login)
feedbackRoutes.post("/", feedbackController.create);

feedbackRoutes.get("/my-feedback", feedbackController.getMyFeedback);

// PUT /all TRƯỚC /:id
feedbackRoutes.get("/all", feedbackController.getAll);

feedbackRoutes.post("/:id/reply", feedbackController.reply);
feedbackRoutes.delete("/:id", feedbackController.delete);

// Cuối cùng mới đến route /:id
feedbackRoutes.get("/:id", feedbackController.getDetail);

export default feedbackRoutes;
