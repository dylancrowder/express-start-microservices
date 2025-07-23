import { Request, Response } from "express";
import { logger } from "../utilities/winsdom";

function errorRoute(req: Request, res: Response) {
  logger.error("❌ Ruta no encontrada:", req.originalUrl);

  res.status(404).json({
    error: "Página no encontrada",
    message: `No se encontró la ruta ${req.originalUrl}`,
  });
}

export default errorRoute;
