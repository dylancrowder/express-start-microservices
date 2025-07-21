import pino from "pino";

const isTestEnv = process.env.NODE_ENV === 'test';

const logger = pino({
  level: isTestEnv ? 'silent' : 'trace', 
  ...(isTestEnv
    ? {} 
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
});

export default logger;
