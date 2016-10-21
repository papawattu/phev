"use strict";

const HOST = 'localhost';
var HOST_API = '/api';
var PROTOCOL = 'http';
var PORT = '3000';
var assert = require('chai').assert;
var request = require('superagent');
var status = require('http-status');
var chai = require("chai");
var App = require("../../App");

describe('Light operations', function() {

    before(function() {
  //      var app = new App();
//  Set up
    });

    after(function() {
// Tear down

    });

    it('should turn on headlights', function(done) {
        request.put(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/lights/head')
            .send({status : 'on'})
            .type('application/json')
            .accept('json')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.status, status.OK);
                done();
            });
    });
});