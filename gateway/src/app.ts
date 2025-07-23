//GATEWAY
import express from "express";
import corsHelmet from "./middleware/corsHelmet";
import rateLimiter from "./middleware/rateLimiter";
import errorHandler from "./middleware/errorHandler";
import { authenticateJWT } from "./middleware/authenticateJWT";
import authRoutes from "./routes/authRoutes";
import productsRoutes from "./routes/productsRoutes";
import compression from "compression";
import docsRoutes from "./routes/documentation.route";
import httpLogger from "./middleware/pinoHttp";

const app = express();

app.use(express.json());
app.use(corsHelmet);
app.use(rateLimiter);
app.use(compression());

app.use(docsRoutes);
app.use(httpLogger);
// Rutas públicas (auth)
app.use("/auth", authRoutes);
// Rutas protegidas (products)
app.use("/products", authenticateJWT, productsRoutes);

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
