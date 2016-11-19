'use strict';


const HOST = '127.0.0.1';
const PORT = '1974';
const Util = require('../common/util');
const logger = new Util().logger;
const eol = new Util().eol;
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
describe('Register vehicle', () => {
	it('Should register VIN', (done) => {
		client.write(eol('REGISTER JMAXDGG2WGZ002035'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.length > 0);
				assert(data.toString() === eol('OK'), 'Return string should be OK is ' + data);
				done();
			});
		});
	});
	it('Should not allow register VIN twice', (done) => {
		client.write(eol('REGISTER JMAXDGG2WGZ002035'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.length > 0);
				assert(data.toString() === eol('ERROR'), 'Return string should be ERROR is ' + data);
				done();
			});
		});
	});
});
describe('Get secret', () => {
	it('Should get secret', (done) => {
		client.write(eol('SECRET'), () => {
			client.once('data', (data) => {
				logger.debug('Received: ' + data);
				assert(data.toString().length - eol().length === 16, 'Secret should be 16 digits and got ' + data.toString().length - eol().length);
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