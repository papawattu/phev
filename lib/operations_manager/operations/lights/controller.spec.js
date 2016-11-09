'use strict';

const HOST = 'localhost';
const HOST_API = '/api';
const PROTOCOL = 'http';
const PORT = '3000';
const logger = require('../../../common/logging');
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');
const chai = require('chai');
const OperationsManagerHttpApi = require('../../api');

const opmgr = new OperationsManagerHttpApi(logger);

describe('Light operations', (done)=> {
	before((done) => {
		opmgr.start(done);
	});
	after((done) => {
		opmgr.stop(60 * 1000,done);
	});
	it('Should turn on headlights', (done)=> {
		request.put(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/lights/head')
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