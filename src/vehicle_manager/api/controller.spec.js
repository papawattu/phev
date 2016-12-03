'use strict';
// TODO: Change to class
import {MessageBus} from '../../common/message_bus/message_bus';
import {Vehicle} from '../../common/data/data';

const logger = require('../../common/logging');
const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3001';
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');


const messageBus = new MessageBus({logger});

const VehicleManager = require('../vehicle_manager');
const vehicleManager = new VehicleManager({logger,messageBus});

describe.skip('Vehicle manager API', () => {
	before((done) => {
		vehicleManager.start(done);
		messageBus.start();
	});
	after((done) => {
		vehicleManager.stop(60 * 1000, done);
		messageBus.stop();
	});
	it('Should register vehicle', (done) => {
		request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/vehicleManager')
			.send(Vehicle)
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
				assert.deepEqual(res.body, { vin: '1234',ssid: '1234', password: '1234'});
				done();
			});
	});
});