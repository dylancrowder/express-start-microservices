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
import { logger } from "./utils/winsdom";
import expressWinston from "express-winston";
const app = express();

app.use(express.json());
app.use(corsHelmet);
app.use(rateLimiter);
app.use(compression());

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    level: "info",
    meta: true, // para que mande info extra (podés poner false si querés menos)
    msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}}",
    dynamicMeta: (req, res) => {
      return {
        httpMessage: `HTTP ${req.method} ${req.url} - ${res.statusCode}`,
      };
    },
    colorize: true,
  })
);

app.use(docsRoutes);

// Rutas públicas (auth)
app.use("/auth", authRoutes);
// Rutas protegidas (products)
app.use("/products", authenticateJWT, productsRoutes);

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
