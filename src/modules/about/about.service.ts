import About from "./about.model";
import { IAbout } from "./about.model";

export const getAbout = async (): Promise<IAbout | null> => {
  return About.findOne({});
};
