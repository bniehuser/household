import expressWinston from 'express-winston';
import winston, { format, LeveledLogMethod, Logger, LogMethod } from 'winston';
import { Service } from 'typedi';
import { ErrorRequestHandler, RequestHandler } from 'express'; // for transports.Console

const formatStripBearer = format((info) => {
    if (info.meta && info.meta.req && info.meta.req.headers.authorization) {
        info.meta.req.headers.authorization = info.meta.req.headers.authorization.replace(
            /^Bearer (.+)$/,
            (all: string, match: string) => `Bearer ${match.substr(0, 5)}...${match.substr(match.length-5)}`
        )
    }
    return info;
});

@Service('LogService')
export class LogService {
    private readonly _logger: winston.Logger;
    private _formats = [
        formatStripBearer(),
        winston.format.colorize(),
        winston.format.json(),
    ];

    public preRouteLogging: RequestHandler;
    public postRouteLogging: ErrorRequestHandler;
    public log: LogMethod;
    public error: LeveledLogMethod;
    public warn: LeveledLogMethod;
    public info: LeveledLogMethod;
    public http: LeveledLogMethod;
    public verbose: LeveledLogMethod;
    public debug: LeveledLogMethod;
    public silly: LeveledLogMethod;

    constructor() {
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(...this._formats)
        });

        this.preRouteLogging = expressWinston.logger({ winstonInstance: logger });
        this.postRouteLogging = expressWinston.errorLogger({ winstonInstance: logger });

        this.log = logger.log.bind(logger);
        this.error = logger.error.bind(logger);
        this.warn = logger.warn.bind(logger);
        this.info = logger.info.bind(logger);
        this.http = logger.http.bind(logger);
        this.verbose = logger.verbose.bind(logger);
        this.debug = logger.debug.bind(logger);
        this.silly = logger.silly.bind(logger);

        this._logger = logger;
    }

    public get logger(): winston.Logger {
        return this._logger;
    }


}
