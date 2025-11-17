import About from "./about.model";
import { IAbout } from "./about.model";

export const getAbout = async (query: { slug?: string } = {}): Promise<IAbout | null> => {
  let filter: any = {};
  if (query.slug) {
    filter.slug = query.slug;
  }
  return About.findOne(filter).sort({ createdAt: -1 }); // Latest nếu không slug
};

export const getAboutById = async (id: string): Promise<IAbout | null> => {
  return About.findById(id);
};

export const getAllAbout = async (): Promise<IAbout[]> => {
  return About.find({}).sort({ createdAt: -1 });
};

export const createAbout = async (aboutData: Partial<IAbout>): Promise<IAbout> => {
  const newAbout = new About(aboutData);
  return newAbout.save();
};

export const updateAbout = async (
  id: string,
  aboutData: Partial<IAbout>
): Promise<IAbout | null> => {
  return About.findByIdAndUpdate(id, aboutData, { new: true });
};

export const deleteAbout = async (id: string): Promise<IAbout | null> => {
  // Xóa img cũ nếu có
  const about = await getAboutById(id);
  if (about?.img && about.img.startsWith("/uploads/about/")) {
    const fs = require("fs");
    const oldPath = `.${about.img}`;
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  return About.findByIdAndDelete(id);
};
