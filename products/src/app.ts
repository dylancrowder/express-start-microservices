// PRODUCTS
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./documentation/swagger.config";
import cors from "cors";

// middlewares
import errorHandler from "./middlewares/error.middleware";
import errorRoute from "./middlewares/error.route";

// rutes
import productsRouter from "./module/products/product.routes";
import { winstonMiddleware } from "./middlewares/winton";

const app = express();

//middleware configuration
app.use(express.json({ limit: "300kb" }));
app.use(cors());

app.use(winstonMiddleware);
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
