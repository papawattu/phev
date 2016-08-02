"use strict";

var globals = require('../common/global');
var express = require('express')
    , router = express.Router();
var halson = require('halson');

router.get('/', function (req, res) {
    var root = halson({
        description: "An API for control of the Mitsubishi PHEV",
        version: '1.0'
    })
        .addLink('self', '/api')
        .addLink('register','/api/register')
        .addLink('signin','/api/signin');
    res.json(root);
});

router.get('/version', function (req, res) {
    var version = halson({
        supportedVersions: ['1.0']
    });
    res.json(version);
});
module.exports = router;