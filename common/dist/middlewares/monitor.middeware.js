"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prom_client_1 = __importDefault(require("prom-client"));
const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });
const counter = new prom_client_1.default.Counter({
    name: 'http_requests_total',
    help: 'Cantidad total de solicitudes HTTP',
    labelNames: ['method', 'status_code'],
});
function monitor(req, res, next) {
    res.on('finish', () => {
        counter.labels(req.method, res.statusCode).inc();
    });
    next();
}
exports.default = monitor;
