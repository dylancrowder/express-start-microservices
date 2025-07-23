//AUTH
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middlewares/error.middleware";
import errorRoute from "./middlewares/error.route";
import { swaggerDocs } from "./documentation/swagger.config";
import { apiLimiter } from "./utilities/apiLimiter";
import expressWinston from "express-winston";
//RUTAS
import authRoutes from "./module/register/auth.routes";
import { logger } from "./utilities/winsdom";

const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// Logger middleware
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    expressFormat: true,
    colorize: true,
  })
);

// Rutas principales del microservicio de autenticación
app.use("/", authRoutes);

// Documentación Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocs);
});

// Manejo de errores
app.use(errorRoute);
app.use(errorHandler);

export default app;
