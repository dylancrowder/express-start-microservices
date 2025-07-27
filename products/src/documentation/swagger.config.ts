import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Prueba",
      version: "1.0.0",
      description: "Documentación de API ",
    },
    servers: [
      {
        url: "http://localhost:8085",
        description: "Mircroservicio de autenticación",
      },
      {
        url: "http://localhost:8083",
        description: "Microservicio de productos",
      },
    ],
  },
  apis: ["documentation/**/*.ts", "src/**/*.ts"],
};
export const swaggerDocs = swaggerJsDoc(swaggerOptions);
