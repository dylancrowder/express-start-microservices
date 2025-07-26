// GATEWAY
import express from "express";
import corsHelmet from "./middleware/corsHelmet";
import rateLimiter from "./middleware/rateLimiter";
import errorHandler from "./middleware/errorHandler";
import proxy from "express-http-proxy";
import compression from "compression";
import docsRoutes from "./decumentation/documentation.route";
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

const AUTH_SERVICE_URL = "localhost:8085";
const PRODUCTS_SERVICE_URL = "localhost:8083";

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
  authenticateJWT,
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
