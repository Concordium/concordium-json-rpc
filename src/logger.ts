import winston from 'winston';
import { logLevel, logLocation } from './config';

const logger = winston.createLogger({
    level: logLevel || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: logLocation || 'combined.log',
            maxsize: 10000000,
        }),
    ],
});

export default logger;
