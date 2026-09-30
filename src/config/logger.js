const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',

    format: combine(
        timestamp(),
        logFormat
    ),

    transports: [
        // Console — development
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                logFormat
            )
        }),

        // Errors only
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),

        // Everything
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

module.exports = logger;

