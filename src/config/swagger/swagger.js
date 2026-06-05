import swaggerJSDoc from "swagger-jsdoc";
import { serve } from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Innovapyme API",
      version: "1.0.0",
      description:
        "API para gestionar inventarios, ventas e historial de microempresarios",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    contacts: [
      {
        name: "YLopezB",
        url: "https://github.com/YLopezB",
        email: "andislopez13@gmail.com",
      },
      {
        name: "yeison495",
        url: "https://github.com/yeison495",
        email: "",
      },
      {
        name: "Chris-Maiguel",
        url: "https://github.com/Chris-Maiguel",
        email: "andislopez13@gmail.com",
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJSDoc(options);

export default specs
