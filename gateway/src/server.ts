import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { logger } from "@ecomerce/common";

const PORT = process.env.PORT || 4000;

// Variable para guardar la instancia del servidor
const server = app.listen(PORT, () => {
  logger.info(`Gateway escuchando en puerto ${PORT}`);
});

// Manejo de señales para apagado gentil
process.on("SIGTERM", () => {
  logger.info("SIGTERM recibido: cerrando servidor de forma ordenada...");

  // Dejar de aceptar nuevas conexiones
  server.close((err) => {
    if (err) {
      logger.error("Error cerrando servidor", err);
      process.exit(1);
    }
    // Aquí cerrá conexiones a DB, colas, etc si las tenés
    logger.info("Servidor cerrado correctamente. Saliendo...");
    process.exit(0);
  });

  // Opcional: timeout para forzar cierre si tarda demasiado (ej 10 seg)
  setTimeout(() => {
    logger.error("Cierre forzado tras timeout");
    process.exit(1);
  }, 10000);
});

// Manejo de errores globales
process.on("uncaughtException", (err) => {
  logger.error("Excepción no controlada", { err });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Promesa no manejada", { reason });
  process.exit(1);
});
