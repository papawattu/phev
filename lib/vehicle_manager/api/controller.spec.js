'use strict';

var logger = require('../../common/logging');
var HOST = 'localhost';
var PROTOCOL = 'http';
var PORT = '3001';
var assert = require('chai').assert;
var request = require('superagent');
var status = require('http-status');

var VehicleManager = require('../vehicle_manager');
var vehicleManager = new VehicleManager(logger);

describe('Vehicle manager API', function () {
	before(function (done) {
		vehicleManager.start(done);
	});
	after(function (done) {
		vehicleManager.stop(60 * 1000, done);
	});
	it('Should register vehicle', function (done) {
		request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/vehicleManager').send({ vehicle: { vin: '1234', ssid: '1234', password: '1234' } }).type('application/json').accept('json').end(function (err, res) {
			assert.ifError(err);
			assert.equal(res.status, status.CREATED);
			assert(res.status != 'undefined');
			done();
		});
	});
	it('Should get registered vehicle details', function (done) {
		request.get(PROTOCOL + '://' + HOST + ':' + PORT + '/vehicleManager/1234').type('application/json').accept('json').end(function (err, res) {
			assert.ifError(err);
			assert.equal(res.status, status.OK);
			assert(res.status != 'undefined');
			assert.deepEqual(res.body, { vin: '1234', ssid: '1234', password: '1234' });
			done();
		});
	});
});