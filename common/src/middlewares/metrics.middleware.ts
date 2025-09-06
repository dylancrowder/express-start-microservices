import { Request, Response, NextFunction } from "express";
import client from "prom-client";

// Registro global para todas las métricas
const register = new client.Registry();

// Recolectar métricas de Node.js
client.collectDefaultMetrics({ register });

// Contador de requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Número total de peticiones HTTP",
  labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestsTotal);

/**
 * Middleware para contar las requests HTTP
 */
export const metricsRequestCounter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
};

/**
 * Endpoint handler para /metrics
 */
export const metricsEndpoint = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
};
