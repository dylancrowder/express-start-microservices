// PRODUCTS
import express from "express";
import cors from "cors";
import productsRouter from "./module/products/product.routes";
import orders from "./module/orders/ordets.routes";
import orderItems from "./module/order_items/order.items.routes";
// rutes
import {
  errorHandler,
  errorRoute,
  metricsEndpoint,
  metricsRequestCounter,
  winstonMiddleware,
} from "@ecomerce/common";

const app = express();

//middleware configuration
app.use(express.json({ limit: "300kb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(winstonMiddleware);

// metricas
app.use(metricsRequestCounter);

// rutas
app.use("/", productsRouter);
app.use("/orders", orders);
app.use("/order-items", orderItems);

// Monitorizacion
app.get("/metrics", metricsEndpoint);
// Manejo de errores
app.use(errorRoute);
app.use(errorHandler);

export default app;
