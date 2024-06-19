const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, timestamp, context, requestId, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }
}
