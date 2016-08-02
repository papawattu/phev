var winston = require('winston');

var PROTOCOL    = process.env.PROTOCOL || 'http',
    HOST        = process.env.HOST || 'localhost',
    PORT        = process.env.PORT ||  8081,
    API         = process.env.api || 'api',
    HOST_API    = PROTOCOL + '://' + HOST + ':' + PORT + '/' + API;

// Logging
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding){
        logger.debug(message.replace(/\n$/, ''));
    }
};


exports.HOST        = HOST;
exports.PORT        = PORT;
exports.API         = API;
exports.PROTOCOL    = PROTOCOL;
exports.HOST_API    = HOST_API;
exports.logger      = logger;