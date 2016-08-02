"use strict";

var globals = require('../../common/global');
var REG_API = globals.HOST_API + '/register';
var assert = require('chai').assert;
var request = require('superagent');
var server = require('../../registration/registrationController');
var status = require('http-status');
var chai = require("chai");

describe('Check registrations controller', function() {

    it('should create new user', function (done) {
        request.post(REG_API)
            .send({username : 'papawattu', firstname: 'Jamie', lastname : 'Nuttall',password : 'password',email : 'jamie@wattu.com'})
            .type('application/hal+json')
            .accept('json')
            .end(function (err, res) {
                assert.equal(200,res.statusCode);
                done();
            });
    });
});