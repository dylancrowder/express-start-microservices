import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/winsdom";

export const errorRoute = (req: Request, res: Response, next: NextFunction) => {
  logger.error("Error: Ruta no encontrada");

  res.status(404).json({
    error: "Página no encontrada",
    message: `No se encontró la ruta ${req.originalUrl}`,
  });
};
