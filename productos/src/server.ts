import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

import app from "./app";
import logger from "./utilities/pino.logger";
import { initMongo } from "./db/db_connect";

const PORT = process.env.APP_PORT || 8083;

async function startServer() {
  try {
    await initMongo();
    app.listen(PORT, () => {
      logger.info(
        `Products service corriendo en puerto ${PORT} - ${process.env.NODE_ENV}`
      );
    });
  } catch (error) {
    logger.error({ error }, "Error al conectar a MongoDB. Cerrando...");
    process.exit(1);
  }
}

// Iniciar app
startServer();

// Errores globales
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Excepción no controlada");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Promesa no manejada");
  process.exit(1);
});
