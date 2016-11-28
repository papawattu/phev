'use strict';

var logger = require('winston');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Store = require('../../../common/store/promise_store');
var assert = chai.assert;
var RegistrationService = require('./service');

var sut = new RegistrationService({ store: new Store(), logger: logger });

chai.use(chaiAsPromised);

var register = {
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
var register2 = {
	register: {
		user: {
			firstName: 'Jamie',
			lastName: 'Nuttall',
			username: 'papawattu2',
			password: 'Pa55word!',
			email: 'jamie2@me.com'
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

var register3 = {
	register: {
		user: {
			lastName: 'Nuttall',
			username: 'papawattu2',
			password: 'Pa55word!',
			email: 'jamie2@me.com'
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

describe('Registration service', function () {

	before(function () {});
	it('Should register user', function () {
		return assert.isFulfilled(sut.registration(register));
	});
	it('Should register another user', function () {
		return assert.isFulfilled(sut.registration(register2));
	});
	it('Should not allow same username to be registered twice', function () {
		return assert.isRejected(sut.registration(register));
	});
	it('Should not allow invalid payload', function () {
		return assert.isRejected(sut.registration(register3));
	});
});