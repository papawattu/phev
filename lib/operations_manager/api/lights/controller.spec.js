'use strict';

var HOST = 'localhost';
var PROTOCOL = 'http';
var PORT = '3000';
var logger = require('../../../common/logging');
var assert = require('chai').assert;
var request = require('superagent');
var status = require('http-status');
var OperationsManagerHttpApi = require('../../../operations_manager');

var opmgr = new OperationsManagerHttpApi(logger);

describe('Light operations', function () {
	before(function (done) {
		opmgr.start(done);
	});
	after(function (done) {
		opmgr.stop(60 * 1000, done);
	});
	it('Should turn on headlights', function (done) {
		request.put(PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/lights/head').send({ status: 'on' }).type('application/json').accept('json').end(function (err, res) {
			assert.ifError(err);
			assert.equal(res.status, status.OK);
			return done();
		});
	});
});