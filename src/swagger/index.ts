import homePaths from "./paths/home.json";

export default {
  openapi: "3.0.0",
  info: { title: "My API", version: "1.0.0" },
  paths: {
    ...homePaths,
  },
};
