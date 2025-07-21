import pino from "pino";

const env = process.env.NODE_ENV;

// Setea el nivel de logs según el entorno
const logger = pino({
  level:
    env === "production"
      ? "info" // En producción solo info, warn, error, fatal
      : env === "test"
      ? "silent" // En test no se loguea nada
      : "debug", // En desarrollo: debug, info, etc.

  ...(env === "test"
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }),
});

export default logger;
