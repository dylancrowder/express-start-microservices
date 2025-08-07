"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
class AppError extends Error {
    httpCode;
    isOperational;
    responseMessage;
    constructor(name, httpCode, message, responseMessage, isOperational = true) {
        super(message);
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        this.responseMessage = responseMessage;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
