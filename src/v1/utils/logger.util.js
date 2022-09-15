const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const appRoot = require('app-root-path');
require('winston-daily-rotate-file');

let info = new transports.DailyRotateFile({
    filename: 'info-%DATE%.log',
    dirname: `${appRoot}/src/v1/logs/`,
    datePattern: 'YYYY-MM-DD',
    colorize: true,
    level: 'info',
    maxSize: '20m',
    maxFiles: '14d',
});
let error = new transports.DailyRotateFile({
    filename: 'error-%DATE%.log',
    dirname: `${appRoot}/src/v1/logs/`,
    datePattern: 'YYYY-MM-DD',
    colorize: true,
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
});
const formatLog = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

let createLog = createLogger({
    format: combine(timestamp(), formatLog),
    transports: [info, error],
    exitOnError: false,
});

module.exports = createLog;
