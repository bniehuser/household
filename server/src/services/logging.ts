import expressWinston from 'express-winston';
import winston, { format } from 'winston'; // for transports.Console

const stripBearer = format((info) => {
    if (info.meta && info.meta.req && info.meta.req.headers.authorization) {
        info.meta.req.headers.authorization = info.meta.req.headers.authorization.replace(
            /^Bearer (.+)$/,
            (all: string, match: string) => `Bearer ${match.substr(0, 5)}...${match.substr(match.length-5)}`
        )
    }
    return info;
});


const consoleLogger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        stripBearer(),
        winston.format.colorize(),
        winston.format.json()
    )
});

export const logger = consoleLogger;

export const preRouteLogging = expressWinston.logger({ winstonInstance: consoleLogger });

export const postRouteLogging = expressWinston.errorLogger({ winstonInstance: consoleLogger });

