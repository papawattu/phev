'use strict';

const logger = require('../../common/logging');
const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3001';
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');

const VehicleManager = require('../vehicle_manager');
const vehicleManager = new VehicleManager(logger);

describe('Vehicle manager API', () => {
	before((done) => {
		vehicleManager.start(done);
	});
	after((done) => {
		vehicleManager.stop(60 * 1000, done);
	});
	it('Should register vehicle', (done) => {
		request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/vehicleManager')
			.send({ vehicle: { vin: '1234' } })
			.type('application/json')
			.accept('json')
			.end(function (err, res) {
				assert.ifError(err);
				assert.equal(res.status, status.CREATED);
				assert(res.status != 'undefined');
				done();
			});
	});
	it('Should get registered vehicle details', (done) => {
		request.get(PROTOCOL + '://' + HOST + ':' + PORT + '/vehicleManager/1234')
			.type('application/json')
			.accept('json')
			.end(function (err, res) {
				assert.ifError(err);
				assert.equal(res.status, status.OK);
				assert(res.status != 'undefined');
				done();
			});
	});
});