import pinoHttp from "pino-http";
import logger from "../utils/logger";
const httpLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    const statusCode = res.statusCode ?? 0;
    if (statusCode >= 500 || err) return "error";
    if (statusCode >= 400) return "warn";
    if (statusCode >= 300) return "info";
    return "debug";
  },
  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} ${res.statusCode}`,

  // Deshabilitar objetos req y res completos en el log
  serializers: {
    req: () => undefined,
    res: () => undefined,
  },

  // También podes ocultar responseTime si quieres
  wrapSerializers: false,
});

export default httpLogger;
