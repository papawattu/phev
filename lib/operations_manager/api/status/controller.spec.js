'use strict';

var logger = require('../../../common/logging');
var HOST = 'localhost';
var PROTOCOL = 'http';
var PORT = '3000';
var assert = require('chai').assert;
var request = require('superagent');
var status = require('http-status');
var OpMgr = require('../../../operations_manager');

var opmgr = new OpMgr(logger);

describe('Status operations', function () {
	before(function (done) {
		opmgr.start(done);
	});
	after(function (done) {
		opmgr.stop(60 * 1000, done);
	});
	it('Should get status', function (done) {
		request.get(PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/status').type('application/json').accept('json').end(function (err, res) {
			assert.ifError(err);
			assert.equal(res.status, status.OK);
			assert(res.status != 'undefined');
			done();
		});
	});
});