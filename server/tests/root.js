"use strict";

var globals = require('../common/global');
var HOST = globals.HOST;
var HOST_API = globals.HOST_API;
var PROTOCOL = globals.PROTOCOL;
var PORT = globals.PORT;
var assert = require('chai').assert;
var request = require('superagent');
var server = require('../app');
var status = require('http-status');
var chai = require("chai");

describe('Check root operations', function() {

    before(function() {
//  Set up
    });

    after(function() {
// Tear down
    });

    it('should allow connections to port', function(done) {
        request.get(PROTOCOL + '://' + HOST + ':' + PORT)
            .send({})
            .type('application/hal+json')
            .accept('json')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.status, status.OK);
                done();
            });
    });

    it('should redirect / to /api', function(done) {
        request.get(PROTOCOL + '://' + HOST + ':' + PORT) 
            .send({})
            .type('application/hal+json')
            .accept('json')
            .redirects(0)
            .end(function(err, res) {
                assert.equal(res.statusCode, 302);
                assert.equal(res.header['location'],'/api');
                done();
            });
    });

    it('should support api version 1.0', function(done) {
        request.get(HOST_API + '/version')
            .send({'version' : '1.0'})
            .type('application/hal+json')
            .accept('json')
            .set('X-api-version','1.0')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.status, status.OK);
                assert.oneOf('1.0',res.body.supportedVersions,'Version not supported');
                done();
            });
    });

    it('should have self link', function(done) {
        request.get(HOST_API)
            .type('application/hal+json')
            .accept('json')
            .set('X-api-version','1.0')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.status, status.OK);
                assert.propertyVal(res.body._links.self,'href','/api');
                done();
            });
    });

});