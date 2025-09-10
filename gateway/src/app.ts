import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import corsHelmet from "./middleware/corsHelmet";

import { authenticateJWT } from "./middleware/authenticateJWT";
import { createProxy } from "./middleware/proxy";
import {
  errorHandler,
  errorRoute,
  metricsEndpoint,
  metricsRequestCounter,
  winstonMiddleware,
} from "@ecomerce/common";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { authorizeRoles } from "./middleware/roles";

const commonPath = path.dirname(require.resolve("@ecomerce/common"));
const app = express();

// --------------------
// Middlewares globales
// --------------------
app.use(express.json());
app.use(corsHelmet);
app.use(cookieParser());
app.use(winstonMiddleware);

// --------------------
// Documentación Swagger
// --------------------

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API Gateway",
      version: "3.0.0",
    },
  },
  apis: [
    path.join(commonPath, "documentation/auth.yaml"),
    path.join(commonPath, "documentation/products.yaml"),
  ],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(metricsRequestCounter);
// --------------------
// Config servicios
// --------------------

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:8085";
const PRODUCTS_SERVICE_URL =
  process.env.PRODUCTS_SERVICE_URL || "http://localhost:8083";

// --------------------
// Rutas y proxies
// --------------------
app.use("/auth", createProxy(AUTH_SERVICE_URL, "/auth"));
app.use(
  "/products",
  authenticateJWT,
  authorizeRoles("admin"),
  createProxy(PRODUCTS_SERVICE_URL, "/products", true)
);

// --------------------
// Monitor
// --------------------
app.use(metricsRequestCounter);
app.get("/metrics", metricsEndpoint);

// --------------------
// Manejo de errores
// --------------------
app.use(errorHandler);
app.use(errorRoute);

export default app;
