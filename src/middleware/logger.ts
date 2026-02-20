import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, message }) => {
      return `${timestamp} - ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, message }) => {
          return `${timestamp} - ${message}`;
        })
      )
    }),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Capture when response finishes
  res.on('finish', () => {
    const executionTime = Date.now() - startTime;
    const logMessage = `[${req.method}] ${req.originalUrl} - Execution time: ${executionTime}ms`;
    logger.info(logMessage);
  });

  next();
};
