import winston from "winston";

const isTest = process.env.NODE_ENV === "test";

export const logger = winston.createLogger({
  level: isTest ? "error" : "debug",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info: winston.Logform.TransformableInfo) => {
      const {
        level,
        message,
        timestamp,
        stack,
        error,
        meta,
        httpMessage,
        ...rest
      } = info as {
        level: string;
        message: string;
        timestamp: string;
        stack?: string;
        error?: { stack?: string };
        meta?: Record<string, unknown>;
        httpMessage?: string;
        [key: string]: unknown;
      };

      if (rest.meta && Object.keys(rest.meta).length === 0) {
        delete rest.meta;
      }
      if (meta && Object.keys(meta).length === 0) {
        delete info.meta;
      }

      const stackTrace = stack || (error && error.stack);
      const cleanRest = { ...rest };
      delete cleanRest.stack;
      delete cleanRest.error;

      const extraInfo =
        Object.keys(cleanRest).length > 0
          ? JSON.stringify(cleanRest, null, 2)
          : "";

      const stackInfo = stackTrace ? `\n📌 Stack trace:\n${stackTrace}` : "";

      const firstMsg = httpMessage ? httpMessage : message;

      return `🕒 [${timestamp}] ${level}: ${firstMsg}${
        extraInfo ? `\n📦 Data:\n${extraInfo}` : ""
      }${stackInfo}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      silent: isTest, // SILENCIA TODO EN TEST
    }),
  ],
});
