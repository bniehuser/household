import expressWinston from 'express-winston';
import winston from 'winston'; // for transports.Console

const consoleLogger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
});

export const logger = consoleLogger;

export const preRouteLogging = expressWinston.logger({ winstonInstance: consoleLogger });

export const postRouteLogging = expressWinston.errorLogger({ winstonInstance: consoleLogger });

