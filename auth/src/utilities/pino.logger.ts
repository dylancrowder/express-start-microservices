import pino from "pino";

const env = process.env.NODE_ENV;

const logger = pino({
  level: env === "production" ? "info" : env === "test" ? "silent" : "debug",
  transport:
    env !== "test"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: true,
            messageFormat: "{msg}", // 🟢 Muestra solo el msg como línea principal
          },
        }
      : undefined,
});

export default logger;
