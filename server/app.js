"use strict";

var global = require('./common/global');
var express = require('express');
var status = require('http-status');
var app = express();
var halson = require('halson');
var registrationController = require('./registration/registrationController');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var winston = require('winston');

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

logger.debug('HOST is : ' + global.HOST);
logger.debug('HOST API is : ' + global.HOST_API);
logger.debug('PORT is : ' + global.PORT);

app.use(bodyParser.json({ type: 'application/*+json' }));

app.use(
    //Log requests
    morgan(':method :url :status :response-time ms - :res[content-length]', {
        stream: logger.stream
    })
);

app.get('/', function (req, res) {
    res.redirect('/api');
});

app.get('/api/version', function (req, res) {
    var version = halson({
        supportedVersions: ['1.0']
    });
    res.json(version);
});

app.get('/api', function (req, res) {
    var root = halson({
        description: "An API for control of the Mitsubishi PHEV",
        version: '1.0'
    })
        .addLink('self', '/api')
        .addLink('register','/api/register')
        .addLink('signin','/api/signin');
    res.json(root);
});

app.use('/api',require('./root/indexController'));

app.use('/api/register',require('./registration/registrationController'));

app.listen(global.PORT, function () {
    console.log('PHEV server app listening on port ' + global.PORT);
});