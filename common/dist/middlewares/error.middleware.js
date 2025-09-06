"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const winsdom_1 = require("../utils/winsdom");
const appError_1 = require("../utils/error/appError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof appError_1.AppError) {
        if (err.isOperational) {
            winsdom_1.logger.warn({
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
                suggestion: "Revise la entrada o contacte a soporte si el problema persiste.",
            });
        }
        else {
            winsdom_1.logger.error({
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
    }
    else {
        winsdom_1.logger.error({
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
exports.errorHandler = errorHandler;
