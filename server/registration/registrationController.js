var express = require('express')
    , router = express.Router();
var registrationService = require('./registrationService');
var winston = require('winston');

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

router.post('/', function(req, res) {
  if(registrationService.createUser(req.body.username, req.body.firstname, req.body.lastname,
      req.body.email, req.body.password)) {
      res.status(200);
      res.end();
  } else {
      res.status(500);
      res.end();
  }
});

module.exports = router;