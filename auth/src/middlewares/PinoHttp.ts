import pinoHttp from "pino-http";
import logger from "../utilities/pino.logger";

const httpLogger = pinoHttp({
  logger,

  customLogLevel: (res, err) => {
    const status = res.statusCode ?? 0;
    if (status >= 500 || err) return "error";
    if (status >= 400) return "warn";
    if (status >= 300) return "info";
    return "debug";
  },

  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} ${res.statusCode}`,

  customErrorMessage: (req, res, err) => {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode ?? 500;
    const message = err?.message || "Unknown error";

    return `[ERROR] ${method} ${url} ${status} - ${message}`;
  },

  serializers: {
    req: () => undefined,
    res: () => undefined,
  },

  wrapSerializers: false,
});

export default httpLogger;
