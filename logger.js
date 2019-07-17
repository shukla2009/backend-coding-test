'use strict';
const winston = require('winston')
module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `server.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'log/server.log' })
    ]
  });
