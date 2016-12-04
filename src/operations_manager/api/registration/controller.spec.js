'use strict';

import {MessageBus} from '../../../common/message_bus';

const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3000';
const logger = require('../../../common/logging');
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');
const OperationsManagerHttpApi = require('../../../operations_manager');

const messageBus = new MessageBus({logger});
messageBus.start();
const opmgr = new OperationsManagerHttpApi({logger,messageBus});

describe.skip('Registration operations', () => {
	before((done) => {
		opmgr.start(done);
	});
	after((done) => {
		opmgr.stop(60 * 1000, done);
	});
	it('Should register', (done) => {
		const req = {
			register: {
				user: {
					firstName: 'Jamie',
					lastName: 'Nuttall',
					username: 'papawattu',
					password: 'Pa55word!',
					email: 'jamie@me.com',
				},
				vehicle: {
					ssid: 'REMOTE123456',
					password: 'qwertyuiop',
					vin: 'VIN1234',
				},
				dongle: {
					id: '12345',
				}
			}
		};
		request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/registration')
			.send(req)
			.type('application/json')
			.accept('json')
			.end(function (err, res) {
				assert.ifError(err);
				assert.equal(res.status, status.CREATED,`expected 201 return code, got ${res.status}`);
				assert.equal(res.headers.location, '/users/papawattu');
				return done();
			});
	});

});