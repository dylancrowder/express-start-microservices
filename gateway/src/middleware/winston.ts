import expressWinston from "express-winston";
import { logger } from "../utils/winsdom";

export const winstonMiddleware = expressWinston.logger({
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
});
