// PRODUCTS
import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./documentation/swagger.config";
import cors from "cors";
// middlewares
import errorHandler from "./middlewares/error.middleware";
import errorRoute from "./middlewares/error.route";
import httpLogger from "./middlewares/pinoHttp";

// rutes
import productsRouter from "./module/products/product.routes";

const app = express();

//middleware configuration
app.use(bodyParser.json({ limit: "300kb" }));
app.use(httpLogger);
app.use(
  cors(/* {
    origin: ["http://localhost:3000", "http://localhost:4080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  } */)
);

// Rutas principales del microservicio de productos
app.use("/products", productsRouter);
app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocs);
});

// Manejo de errores
app.use(errorRoute);
app.use(errorHandler);

export default app;
