import expressWinston from "express-winston";
import { logger } from "../utils/winsdom";
export function winstonMiddleware() {
  expressWinston.logger({
    winstonInstance: logger,
    level: "info",
    meta: true, // para que mande info extra (podés poner false si querés menos)
    msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}}",
    dynamicMeta: (req, res) => {
      return {
        httpMessage: `HTTP ${req.method} ${req.url} - ${res.statusCode}`,
      };
    },
    colorize: true,
  });
}
