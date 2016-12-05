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

const messageBus = new MessageBus();
const opmgr = new OperationsManagerHttpApi({logger,messageBus});

describe.skip('Light operations', ()=> {
	before((done) => {
		opmgr.start(done);
	});
	after((done) => {
		opmgr.stop(60 * 1000,done);
	});
	it('Should turn on headlights', (done)=> {
		request.put(PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/lights/head')
            .send({status : 'on'})
            .type('application/json')
            .accept('json')
            .end(function(err, res) {
	assert.ifError(err);
	assert.equal(res.status, status.OK);
	return done();
});
	});
});