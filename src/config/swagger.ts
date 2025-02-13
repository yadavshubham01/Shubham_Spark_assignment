import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spontaneous Meetup Broadcast API",
      version: "1.0.0",
      description: "API documentation for managing spontaneous meetups.",
      contact: {
        name: "Shubham",
        email: "your-email@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
