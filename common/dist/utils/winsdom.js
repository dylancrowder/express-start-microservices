"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
exports.logger = winston_1.default.createLogger({
    level: "debug",
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf((info) => {
        const { level, message, timestamp, stack, error, meta, httpMessage, ...rest } = info;
        // Limpieza de meta vacío
        if (rest.meta && Object.keys(rest.meta).length === 0) {
            delete rest.meta;
        }
        if (meta && Object.keys(meta).length === 0) {
            delete info.meta;
        }
        // Stack trace
        const stackTrace = stack || (error && error.stack);
        const cleanRest = { ...rest };
        delete cleanRest.stack;
        delete cleanRest.error;
        const extraInfo = Object.keys(cleanRest).length > 0
            ? JSON.stringify(cleanRest, null, 2)
            : "";
        const stackInfo = stackTrace ? `\n📌 Stack trace:\n${stackTrace}` : "";
        // Primero mensaje HTTP si existe, sino mensaje normal
        const firstMsg = httpMessage ? httpMessage : message;
        return `🕒 [${timestamp}] ${level}: ${firstMsg}${extraInfo ? `\n📦 Data:\n${extraInfo}` : ""}${stackInfo}`;
    })),
    transports: [new winston_1.default.transports.Console()],
});
