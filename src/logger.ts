import winston from 'winston';
import { logLevel, logLocation } from './config';

const logger = winston.createLogger({
    level: logLevel || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        logLocation
            ? new winston.transports.File({
                  filename: logLocation,
                  maxsize: 10000000,
              })
            : new winston.transports.Console(),
    ],
});

export default logger;
