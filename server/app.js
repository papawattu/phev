"use strict";

var global = require('./common/global');
var express = require('express');
var status = require('http-status');
var app = express();
var halson = require('halson');
var registrationController = require('./registration/registrationController');
var indexController = require('./root/indexController');
var bodyParser = require('body-parser');
var logger = global.logger;
var morgan = require('morgan');

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

app.use('/api',require('./root/indexController'));

app.use('/api/register',require('./registration/registrationController'));

app.listen(global.PORT, function () {

    logger.debug('HOST is : ' + global.HOST);
    logger.debug('HOST API is : ' + global.HOST_API);
    logger.debug('PORT is : ' + global.PORT);
    logger.info('PHEV server app listening on port ' + global.PORT);
});