// GATEWAY
import express from "express";
import corsHelmet from "./middleware/corsHelmet";
import rateLimiter from "./middleware/rateLimiter";
import errorHandler from "./middleware/errorHandler";
import proxy from "express-http-proxy";
import compression from "compression";
import docsRoutes from "./documentation/documentation.route";
import cookieParser from "cookie-parser";
import { authenticateJWT } from "./middleware/authenticateJWT";
import { winstonMiddleware } from "./middleware/winston";

const app = express();
// Middleware
app.use(express.json());
app.use(corsHelmet);
app.use(rateLimiter);
app.use(compression());
app.use(cookieParser());
app.use(winstonMiddleware);

app.use(docsRoutes);

const isProduction = process.env.NODE_ENV === "production";

const AUTH_SERVICE_URL = isProduction
  ? "http://auth:8085"
  : "http://localhost:8085";
const PRODUCTS_SERVICE_URL = isProduction
  ? "http://products:8083"
  : "http://localhost:8083";

app.get("/", (req, res) => {
  try {
    res.status(200).json({
      message: "Bienvenido a la API de microservicios ",
      services: {
        auth: AUTH_SERVICE_URL,
        products: PRODUCTS_SERVICE_URL,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al procesar la solicitud",
    });
  }
});

// Proxy AUTH
app.use(
  "/auth",
  proxy(AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/auth/, ""),
    proxyReqBodyDecorator: (_, req) => req.body,
  })
);

// Proxy PRODUCTS
app.use(
  "/products",
  /*  authenticateJWT, */
  proxy(PRODUCTS_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/products/, ""),
    proxyReqBodyDecorator: (body, req) => body,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {}; // ✅ fix acá

      proxyReqOpts.headers["Content-Type"] = "application/json";

      if ((srcReq as any).user) {
        proxyReqOpts.headers["x-user-id"] = (srcReq as any).user.userId;
      }

      return proxyReqOpts;
    },
  })
);

// Middleware global de manejo de errores
app.use(errorHandler);

export default app;
