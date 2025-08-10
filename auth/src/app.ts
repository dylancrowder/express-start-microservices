//AUTH
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//RUTAS
import authRoutes from "./module/register/auth.routes";
import { errorHandler, errorRoute, winstonMiddleware } from "@ecomerce/common";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(winstonMiddleware);

// Rutas principales del microservicio de autenticación
app.use("/", authRoutes);

// Manejo de errores
app.use(errorHandler);
app.use(errorRoute);

export default app;
