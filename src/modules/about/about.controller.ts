import { Request, Response } from "express";
import {
  getAbout,
  getAboutById,
  getAllAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} from "./about.service";
import { buildImageUrl } from "@/utils/buildImageUrl";

// Public: GET single (latest hoặc by slug)
export const getAboutController = async (req: Request, res: Response) => {
  try {
    const { slug } = req.query;
    const about = await getAbout({ slug: slug as string });

    if (!about) {
      return res.status(404).json({ success: false, message: "About not found" });
    }

    // Prepend URL cho img
    const responseData = {
      ...about.toObject(),
      img: buildImageUrl(about.img),
    };

    res.json({
      success: true,
      message: "Successfully get about",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error get about",
      error: (error as Error).message,
    });
  }
};

// Admin: GET all (list)
export const getAllAboutController = async (req: Request, res: Response) => {
  try {
    const abouts = await getAllAbout();

    // Prepend URL cho imgs
    const responseData = abouts.map((ab) => ({
      ...ab.toObject(),
      img: buildImageUrl(ab.img),
    }));

    res.json({
      success: true,
      message: "Successfully get abouts",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error get abouts",
      error: (error as Error).message,
    });
  }
};

// Admin: GET by ID
export const getAboutByIdController = async (req: Request, res: Response) => {
  try {
    const about = await getAboutById(req.params.id);
    if (!about) {
      return res.status(404).json({ success: false, message: "About not found" });
    }

    const responseData = {
      ...about.toObject(),
      img: buildImageUrl(about.img),
    };

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error get about",
      error: (error as Error).message,
    });
  }
};

// Admin: POST create (với upload)
export const createAboutController = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      req.body.img = `/uploads/about/${req.file.filename}`;
    }

    const newAbout = await createAbout(req.body);

    const responseData = {
      ...newAbout.toObject(),
      img: buildImageUrl(newAbout.img),
    };

    res.status(201).json({
      success: true,
      message: "Successfully create about",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error create about",
      error: (error as Error).message,
    });
  }
};

// Admin: PUT update (với upload optional, xóa img cũ)
export const updateAboutController = async (req: Request, res: Response) => {
  try {
    let updateData = req.body;
    if (req.file) {
      // Xóa img cũ
      const oldAbout = await getAboutById(req.params.id);
      if (oldAbout?.img && oldAbout.img.startsWith("/uploads/about/")) {
        const fs = require("fs");
        const oldPath = `.${oldAbout.img}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.img = `/uploads/about/${req.file.filename}`;
    }

    const updatedAbout = await updateAbout(req.params.id, updateData);
    if (!updatedAbout) {
      return res.status(404).json({ success: false, message: "About not found" });
    }

    const responseData = {
      ...updatedAbout.toObject(),
      img: buildImageUrl(updatedAbout.img),
    };

    res.json({
      success: true,
      message: "Successfully update about",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error update about",
      error: (error as Error).message,
    });
  }
};

// Admin: DELETE
export const deleteAboutController = async (req: Request, res: Response) => {
  try {
    const deletedAbout = await deleteAbout(req.params.id);
    if (!deletedAbout) {
      return res.status(404).json({ success: false, message: "About not found" });
    }
    res.json({
      success: true,
      message: "Successfully delete about",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa about",
      error: (error as Error).message,
    });
  }
};
