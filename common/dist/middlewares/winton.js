"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonMiddleware = void 0;
const express_winston_1 = __importDefault(require("express-winston"));
const winsdom_1 = require("../utils/winsdom");
exports.winstonMiddleware = express_winston_1.default.logger({
    winstonInstance: winsdom_1.logger,
    level: "info",
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}}",
    dynamicMeta: (req, res) => {
        return {
            httpMessage: `HTTP ${req.method} ${req.url} - ${res.statusCode}`,
        };
    },
    colorize: true,
});
