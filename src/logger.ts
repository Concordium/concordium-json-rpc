import winston from 'winston';
import minimist from 'minimist';

const logger = winston.createLogger({
    level: minimist(process.argv.slice(2)).log || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename:
                minimist(process.argv.slice(2)).logLocation || 'combined.log',
            maxsize: 10000000,
        }),
    ],
});

export default logger;
