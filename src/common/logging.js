'use strict';

const winston = require('winston');

winston.emitErrs = true;
const _logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			timestamp: true,
			level: 'error',
			handleExceptions: true,
			json: false,
			colorize: true
		}), 
		new winston.transports.File({
			name: 'info',
			filename: 'logs/app-info.log',
			timestamp: true,
			level: 'info',
			handleExceptions: true,
			json: false,
			colorize: true
		}),
		new winston.transports.File({
			name: 'debug',
			filename: 'logs/app-debug.log',
			timestamp: true,
			level: 'debug',
			handleExceptions: true,
			json: false,
			colorize: true
		})
	],
	exitOnError: false
});

_logger.stream = {
	write: function (message) {
		_logger.debug(message.replace(/\n$/, ''));
	}
};

module.exports = _logger;