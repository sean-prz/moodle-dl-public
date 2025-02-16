import winston from 'winston';

const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(info => {
                return `[${info.level}]: ${info.message}`;
        })
        ),
        transports: [
            new winston.transports.Console(),
        ]
    })

export default logger;