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

describe('Registration operations', function () {
	before(function (done) {
		opmgr.start(done);
	});
	after(function (done) {
		opmgr.stop(60 * 1000, done);
	});
	it('Should register', function (done) {
		var req = {
			register: {
				user: {
					firstName: 'Jamie',
					lastName: 'Nuttall',
					username: 'papawattu',
					password: 'Pa55word!',
					email: 'jamie@me.com'
				},
				vehicle: {
					ssid: 'REMOTE123456',
					password: 'qwertyuiop',
					vin: 'VIN1234'
				},
				device: {
					id: '12345'
				}
			}
		};
		request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/api/operations/registration').send(req).type('application/json').accept('json').end(function (err, res) {
			assert.ifError(err);
			assert.equal(res.headers.location, '/users/papawattu');
			assert.equal(res.status, status.CREATED);
			return done();
		});
	});
});