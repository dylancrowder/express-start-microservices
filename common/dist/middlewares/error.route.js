"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRoute = void 0;
const winsdom_1 = require("../utils/winsdom");
const errorRoute = (req, res, next) => {
    winsdom_1.logger.error("Error: Ruta no encontrada");
    res.status(404).json({
        error: "Página no encontrada",
        message: `No se encontró la ruta ${req.originalUrl}`,
    });
};
exports.errorRoute = errorRoute;
