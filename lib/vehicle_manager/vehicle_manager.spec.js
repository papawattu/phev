'use strict';

var HOST = '127.0.0.1';
var PORT = '1974';
var logger = require('winston');
var eol = require('../common/util').eol;
var assert = require('chai').assert;
var net = require('net');
var VehicleManager = require('./vehicle_manager');
var client = new net.Socket();
var sut = new VehicleManager();

describe('Vehicle Manager', () => {
	before('Start up VM', ()=>{
		client = new net.Socket();
		sut = new VehicleManager();
	});
	after('Stop VM', (done)=>{
		sut.stop(1000 * 20, done);
	});
	
	describe('Connect vehicle', function () {
		it('Should connect and return HELLO PHEV', function (done) {
			sut.start(function () {
				client.connect(PORT, HOST, function () {
					logger.debug('Connected');
				});
			});
			client.once('data', function (data) {
				assert(data.length > 0);
				assert(data.toString() === eol('HELLO PHEV'), 'Return string should be HELLO PHEV is' + data.toString());
				done();
			});
		});
		it('Should connect and return OK', function (done) {
			client.write(eol('CONNECT'), function () {
				client.once('data', function (data) {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() == eol('OK'), 'Return string should be OK is ' + data.toString());
					done();
				});
			});
		});
	});
	describe('Register device', function () {
		it('Should register vehicle when passed a device', function (done) {
			client.write(eol('REGISTER 123456'), function () {
				client.once('data', function (data) {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('OK'), 'Return string should be OK is ' + data);
					done();
				});
			});
		});
		it('Should not allow device to be registered twice', function (done) {
			client.write(eol('REGISTER 123456'), function () {
				client.once('data', function (data) {
					logger.debug('Received: ' + data);
					assert(data.length > 0);
					assert(data.toString() === eol('ERROR'), 'Return string should be ERROR is ' + data);
					done();
				});
			});
		});
	});
	describe('Wifi details', function () {
		it('Should get SSID', function (done) {
			client.write(eol('SSID'), function () {
				client.once('data', function (data) {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'SSID should be returned  : ' + data.toString());
					assert(data.toString() === eol('SSID123'), 'SSID should be SSID123 is ' + data.toString());
					done();
				});
			});
		});
		it('Should get password', function (done) {
			client.write(eol('PASSWORD'), function () {
				client.once('data', function (data) {
					logger.debug('Received: ' + data);
					assert(data.toString().length > 0, 'PASSWORD should be returned  : ' + data.toString());
					assert(data.toString() === eol('PASSWORD123'), 'Password should be PASSWORD123 is ' + data.toString());
					done();
				});
			});
		});
	});
	describe('Close socket', function () {
		it('Should close socket', function () {
			client.destroy();
			assert.isTrue(client.destroyed, 'Socket closed error');
		});
	});
});