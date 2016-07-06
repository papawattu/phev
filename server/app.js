"use strict";

var PORT = 8080;

var express = require('express');
var status = require('http-status');
var app = express();
var halson = require('halson');
var registrationController = require('./registration/registrationController');
var bodyParser = require('body-parser');

app.use(bodyParser.json({ type: 'application/*+json' }));

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
        .addLink('register','/api/signin');
    res.json(root);
});

app.use('/api/register',require('./registration/registrationController'));

app.listen(PORT, function () {
    console.log('PHEV server app listening on port ' + PORT);
});