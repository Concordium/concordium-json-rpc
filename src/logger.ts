import winston from 'winston';
import minimist from 'minimist';

const logger = winston.createLogger({
    level: 'info',
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

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export default logger;
