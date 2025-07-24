// PRODUCTS
import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./documentation/swagger.config";
import cors from "cors";
import expressWinston from "express-winston";
// middlewares
import errorHandler from "./middlewares/error.middleware";
import errorRoute from "./middlewares/error.route";

// rutes
import productsRouter from "./module/products/product.routes";
import { logger } from "./utilities/winsdom";

const app = express();

//middleware configuration
app.use(bodyParser.json({ limit: "300kb" }));

app.use(cors());

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

// Rutas principales del microservicio de productos
app.use("/", productsRouter);
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocs);
});

// Manejo de errores
app.use(errorRoute);
app.use(errorHandler);

export default app;
