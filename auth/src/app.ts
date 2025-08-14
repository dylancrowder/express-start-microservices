//AUTH
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//RUTAS
import authRoutes from "./module/register/auth.routes";
import {
  errorHandler,
  errorRoute,
  metricsEndpoint,
  metricsRequestCounter,
  winstonMiddleware,
} from "@ecomerce/common";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(winstonMiddleware);

// Monitorizacion
app.use(metricsRequestCounter);

// Rutas principales del microservicio de autenticación
app.use("/", authRoutes);

app.get("/metrics", metricsEndpoint);

// Manejo de errores
app.use(errorHandler);
app.use(errorRoute);

export default app;
