// GATEWAY
import express from "express";
import corsHelmet from "./middleware/corsHelmet";
import rateLimiter from "./middleware/rateLimiter";
import errorHandler from "./middleware/errorHandler";
import { authenticateJWT } from "./middleware/authenticateJWT";
import compression from "compression";
import docsRoutes from "./decumentation/documentation.route";
import { logger } from "./utils/winsdom";
import expressWinston from "express-winston";
import proxy from "express-http-proxy";

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

// URLs de microservicios
const AUTH_SERVICE_URL = "localhost:8085";
const PRODUCTS_SERVICE_URL = "localhost:8083";

// Proxy para /auth
app.use(
  "/auth",
  proxy(AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/auth/, ""),
    proxyReqBodyDecorator: (_, req) => req.body,
  })
);

// Proxy para /products (con autenticación previa)
app.use(
  "/products",
  authenticateJWT,
  proxy(PRODUCTS_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/products/, ""),
  })
);

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
