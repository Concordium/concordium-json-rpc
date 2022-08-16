import winston from 'winston';
import minimist from 'minimist';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    // TODO Log to stdout.
    transports: [
        new winston.transports.File({
            filename:
                minimist(process.argv.slice(2)).logLocation || 'combined.log',
            maxsize: 10000000,
        }),
    ],
});

export default logger;
