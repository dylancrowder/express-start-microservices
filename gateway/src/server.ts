import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Gateway escuchando en puerto ${PORT}`);
});

// Errores globales
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Excepción no controlada");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Promesa no manejada");
  process.exit(1);
});
