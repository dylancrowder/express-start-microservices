import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { logger } from "@ecomerce/common";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Gateway escuchando en puerto ${PORT}`);
});

// Errores globales
process.on("uncaughtException", (err) => {
  logger.error("Excepción no controlada", { err });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Promesa no manejada", { reason });
  process.exit(1);
});
