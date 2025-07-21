//AUTH
import express from "express";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middlewares/error.middleware";
import errorRoute from "./middlewares/error.route";
import { swaggerDocs } from "./documentation/swagger.config";
import { apiLimiter } from "./utilities/apiLimiter";
//RUTAS
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(
  cors(/* {
    origin: ["http://localhost:3000", "http://localhost:4080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  } */)
);

app.use(bodyParser.json({ limit: "300kb" }));
app.use(cookieParser() as express.RequestHandler);
app.use(apiLimiter);

// Rutas principales del microservicio de autenticación
app.use("/auth", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocs);
});

// Manejo de errores
app.use(errorRoute);
app.use(errorHandler);

export default app;
