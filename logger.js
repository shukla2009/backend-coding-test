'use strict';
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, simple } = format;
module.exports = function (callingModule) {

  var getLabel = function () {
    var parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
  };

  return createLogger({
    format: combine(
      label({ label: getLabel() }),
      timestamp(),
      simple()
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'log/error.log',
        level: 'error',
      }),
      new transports.File({
        filename: 'log/server.log',
      })]
  });
};
