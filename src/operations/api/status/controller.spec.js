'use strict';
import {MessageBus} from '../../../common/message_bus';
const logger = require('../../../common/logging');
const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3000';
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');
const OperationsManagerHttpApi = require('../../../operations');

const messageBus = new MessageBus();
const opmgr = new OperationsManagerHttpApi({logger,messageBus});

describe('Status operations', () => {
	before((done) => {
		opmgr.start(done);
	});
	after((done) => {
		opmgr.stop(60 * 1000, done);
	});
	it('Should get status', (done) => {
		request.get(PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/status')
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