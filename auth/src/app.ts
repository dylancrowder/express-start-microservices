//AUTH
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middlewares/error.middleware";
import errorRoute from "./middlewares/error.route";
import { swaggerDocs } from "./documentation/swagger.config";
import { apiLimiter } from "./utilities/apiLimiter";
//RUTAS
import authRoutes from "./module/register/auth.routes";
import httpLogger from "./middlewares/PinoHttp";

const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);
app.use(httpLogger);
// Rutas principales del microservicio de autenticación
app.use("/", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocs);
});

// Manejo de errores
app.use(errorRoute);
app.use(errorHandler);

export default app;
