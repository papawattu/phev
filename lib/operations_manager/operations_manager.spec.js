'use strict';

var HOST = 'localhost';
var PROTOCOL = 'http';
var PORT = '3000';

var logger = require('../common/logging');
var assert = require('chai').assert;
var request = require('superagent');
var OperationsManagerHttpApi = require('./operations_manager');

var sut = new OperationsManagerHttpApi(logger);

describe('Operations Manager status', function () {
	it('Should return service status as string', function () {
		var statuses = sut.status();
		assert.isString(statuses);
	});
	it('Should be stopped by default', function () {
		var statuses = sut.status();
		assert(statuses === 'STOPPED', 'Expected status to be STOPPED and is ' + statuses);
	});
});
describe('Operations Manager start', function () {
	after(function (done) {
		sut.stop(60 * 1000, done);
	});
	it('Should start service', function () {
		assert(sut.status() === 'STOPPED', 'Expetced status to be STOPPED is ' + sut.status());
		sut.start(function () {
			assert(sut.status() === 'RUNNING');
		});
	});
	it('Should not error if start service again', function () {
		sut.start(function () {
			assert(sut.status() === 'RUNNING', 'Expetced status to be RUNNING is ' + sut.status());
			sut.start(function () {
				assert(sut.status() === 'RUNNING');
			});
		});
	});
});
describe('Operations Manager listen on port', function () {
	before(function (done) {
		sut.start(done);
	});
	after(function (done) {
		sut.stop(60 * 10000, done);
	});
	it('Should be listening on port', function (done) {
		var uri = PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/status';
		logger.debug('Connecting to ' + uri);
		request.get(uri).type('application/json').accept('json').end(function (err, res) {
			assert.ifError(err);
			assert.equal(res.status, 200);
			assert(res.status != 'undefined');
			done();
		});
	});
});