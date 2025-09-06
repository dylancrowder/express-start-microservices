import { ErrorRequestHandler } from "express";

import { logger } from "../utils/winsdom";
import { AppError } from "../utils/error/appError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.warn({
        message: "Error operacional manejado:",
        name: err.name,
        httpCode: err.httpCode,
        description: err.message,
        stack: err.stack,
        responseMessage: err.responseMessage,
      });

      res.status(err.httpCode).json({
        status: "error",
        name: err.name,
        message: err.responseMessage,
        suggestion:
          "Revise la entrada o contacte a soporte si el problema persiste.",
      });
    } else {
      logger.error({
        message: "Error no operacional detectado:",
        name: err.name,
        stack: err.stack,
        description: err.message,
      });

      res.status(500).json({
        status: "error",
        message: "Error interno del servidor. Por favor, contacte al soporte.",
      });
    }
  } else {
    logger.error({
      message: "Error inesperado no manejado:",
      name: err.name,
      description: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};
