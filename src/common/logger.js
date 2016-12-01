import * as winston from 'winston';

winston.emitErrs = true;

export const logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			name: 'error',
			filename: 'logs/app-error.log',
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
	exitOnError: false,
});

logger.stream = {
	write: function (message) {
		logger.debug(message.replace(/\n$/, ''));
	}
};