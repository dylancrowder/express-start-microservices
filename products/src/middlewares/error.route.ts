import { Request, Response, NextFunction } from "express";

function errorRoute(req: Request, res: Response, next: NextFunction) {
  console.log("Error: Ruta no encontrada");
  
  res.status(404).json({
    error: "Página no encontrada",
    message: `No se encontró la ruta ${req.originalUrl}`,
  });
}

export default errorRoute;
