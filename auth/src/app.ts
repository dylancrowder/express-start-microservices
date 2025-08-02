//AUTH
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { errorHandler, errorRoute } from "@ecomerce/common";
import { swaggerDocs } from "./documentation/swagger.config";
//RUTAS
import authRoutes from "./module/register/auth.routes";
import { winstonMiddleware } from "@ecomerce/common";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(winstonMiddleware);

// Rutas principales del microservicio de autenticación
app.use("/", authRoutes);

// Documentación Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocs);
});

// Manejo de errores
app.use(errorHandler);
app.use(errorRoute);

export default app;
