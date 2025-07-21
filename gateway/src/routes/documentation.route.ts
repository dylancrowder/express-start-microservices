import express from "express";
import swaggerUi from "swagger-ui-express";

const router = express.Router();

const services = [
  { name: "auth", jsonUrl: "http://localhost:8085/swagger.json" },
  { name: "products", jsonUrl: "http://localhost:8083/swagger.json" },
];

// Swagger UI sirve la UI, con configuración para múltiples specs remotos:
router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    explorer: true,
    swaggerOptions: {
      urls: services.map((s) => ({
        url: s.jsonUrl,
        name: s.name,
      })),
    },
  })
);

export default router;
