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

describe('Registration operations', (done)=> {
	before((done) => {
		opmgr.start(done);
	});
	after((done) => {
		opmgr.stop(60 * 1000,done);
	});
	it('Should register', (done)=> {
		request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/registration')
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