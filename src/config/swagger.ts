import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
    },
  },

  apis: ["./src/swagger/schemas/*.ts", "./src/swagger/paths/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
