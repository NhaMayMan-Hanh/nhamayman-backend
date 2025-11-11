import { Request, Response } from "express";
import { getAbout } from "./about.service";

export const getAboutController = async (req: Request, res: Response) => {
  try {
    const about = await getAbout();
    res.json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy about",
      error: (error as Error).message,
    });
  }
};
