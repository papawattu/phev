"use strict";

const HOST = 'localhost';
const PORT = '1974';
const assert = require('chai').assert;
const status = require('http-status');
const chai = require("chai");
const net = require('net');
const client = new net.Socket();

describe('Register vehicle', function() {

    before(function() {
        client.connect(PORT, HOST, function() {
	        console.log('Connected');
	    });
    });

    after(function() {
// Tear down

    });

    it('should register VIN', function(done) {
        client.on('data', function(data) {
	        console.log('Received: ' + data);
            assert(data.length > 0);
            assert(data == 'OK','Return string should be OK is ' + data);
            done();
        });
        client.write('REGISTER JMAXDGG2WGZ002035');
    });
    it('should get secret', function(done) {
        client.on('data', function(data) {
	        console.log('Received: ' + data);
            assert(data.toString().length == 16,'Secret should be 16 digits and got ' + data.toString().length);
            done();
        });
        client.write('SECRET');
    });
});