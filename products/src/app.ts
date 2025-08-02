// PRODUCTS
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./documentation/swagger.config";
import cors from "cors";

// middlewares
import { errorHandler } from "@ecomerce/common";
import { errorRoute } from "@ecomerce/common";

// rutes
import productsRouter from "./module/products/product.routes";
/* import { winstonMiddleware } from "@ecomerce/common";
 */
const app = express();

//middleware configuration
app.use(express.json({ limit: "300kb" }));
app.use(
  cors({
    origin: "http://localhost:3000", // solo tu front
    credentials: true, // si estás usando cookies o auth
  })
);
/* app.use(winstonMiddleware); */
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
