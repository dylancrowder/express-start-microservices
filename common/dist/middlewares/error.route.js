"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRoute = errorRoute;
function errorRoute(req, res, next) {
    console.log("Error: Ruta no encontrada");
    res.status(404).json({
        error: "Página no encontrada",
        message: `No se encontró la ruta ${req.originalUrl}`,
    });
}
