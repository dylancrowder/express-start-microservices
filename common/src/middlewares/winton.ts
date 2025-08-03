import expressWinston from "express-winston";
import { logger } from "../utils/winsdom";
import { Request, Response, NextFunction } from "express";
const isTest = process.env.NODE_ENV === "test";

export const winstonMiddleware = !isTest
  ? expressWinston.logger({
      winstonInstance: logger,
      level: "info",
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}}",
      dynamicMeta: (req, res) => {
        return {
          httpMessage: `HTTP ${req.method} ${req.url} - ${res.statusCode}`,
        };
      },
      colorize: true,
    })
  : (req: Request, res: Response, next: NextFunction) => next(); // Middleware vacío tipado
