"use strict";

var PORT = 8080;

var express = require('express');
var status = require('http-status');
var app = express();
var halson = require('halson');


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
        .addLink('register','/api/register');
    res.json(root);
});

app.put('/api/register', function (req, res) {
    var root = halson({
        response: "OK"
    })
        .addLink('self', '/api/register');
    res.json(root);
});


app.listen(PORT, function () {
    console.log('PHEV server app listening on port ' + PORT);
});