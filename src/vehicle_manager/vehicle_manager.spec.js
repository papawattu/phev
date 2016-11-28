'use strict';


const HOST = '127.0.0.1';
const PORT = '1974';
const logger = require('winston');
const eol = require('../common/util').eol;
const assert = require('chai').assert;
const net = require('net');
const VehicleManager = require('./vehicle_manager');
const client = new net.Socket();
const sut = new VehicleManager();

describe('Connect vehicle', () => {
	it('Should connect and return HELLO PHEV', (done) => {
		sut.start(() => {
			client.connect(PORT, HOST, () => {
				logger.debug('Connected');
			});
		});
		client.once('data', (data) => {
			assert(data.length > 0);
			assert(data.toString() === eol('HELLO PHEV'), 'Return string should be HELLO PHEV is' + data.toString());
			done();
		});
	});
	it('Should connect and return OK', (done) => {
		client.write(eol('CONNECT'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.length > 0);
				assert(data.toString() == eol('OK'), 'Return string should be OK is ' + data.toString());
				done();
			});
		});
	});
});
describe('Register device', () => {
	it('Should register vehicle when passed a device', (done) => {
		client.write(eol('REGISTER 123456'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.length > 0);
				assert(data.toString() === eol('OK'), 'Return string should be OK is ' + data);
				done();
			});
		});
	});
	it('Should not allow device to be registered twice', (done) => {
		client.write(eol('REGISTER 123456'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.length > 0);
				assert(data.toString() === eol('ERROR'), 'Return string should be ERROR is ' + data);
				done();
			});
		});
	});
});
describe('Wifi details', () => {
	it('Should get SSID', (done) => {
		client.write(eol('SSID'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.toString().length > 0, 'SSID should be returned  : ' + data.toString());
				assert(data.toString() === eol('SSID123'),'SSID should be SSID123 is ' + data.toString());
				done();
			});
		});
	});
	it('Should get password', (done) => {
		client.write(eol('PASSWORD'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.toString().length > 0, 'PASSWORD should be returned  : ' + data.toString());
				assert(data.toString() === eol('PASSWORD123'),'Password should be PASSWORD123 is ' + data.toString());
				done();
			});
		});
	});
});
describe('Close socket', () => {
	it('Should close socket', () => {
		client.destroy();
		assert.isTrue(client.destroyed, 'Socket closed error');
	});
});