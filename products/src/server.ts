import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

import app from "./app";
import { initMongo } from "./db/db_connect";
import { logger } from "@ecomerce/common";

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
    logger.error("Error al conectar a MongoDB. Cerrando...", error);
    process.exit(1);
  }
}

// Iniciar app
startServer();

// Errores globales
process.on("uncaughtException", (err) => {
  logger.error("Excepción no controlada", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Promesa no manejada", reason);
  process.exit(1);
});
