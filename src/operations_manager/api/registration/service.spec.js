'use strict';

const logger = require('winston');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../../common/store/promise_store');
const assert = chai.assert;
const RegistrationService = require('./service');

const sut = new RegistrationService({ store: new Store, logger: logger });

chai.use(chaiAsPromised);

const register = {
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
		device: {
			id: '12345',
		}
	}
};
const register2 = {
	register: {
		user: {
			firstName: 'Jamie',
			lastName: 'Nuttall',
			username: 'papawattu2',
			password: 'Pa55word!',
			email: 'jamie2@me.com',
		},
		vehicle: {
			ssid: 'REMOTE123456',
			password: 'qwertyuiop',
			vin: 'VIN1234',
		},
		device: {
			id: '12345',
		}
	}
};

const register3 = {
	register: {
		user: {
			lastName: 'Nuttall',
			username: 'papawattu2',
			password: 'Pa55word!',
			email: 'jamie2@me.com',
		},
		vehicle: {
			ssid: 'REMOTE123456',
			password: 'qwertyuiop',
			vin: 'VIN1234',
		},
		device: {
			id: '12345',
		}
	}
};

describe('Registration service', () => {

	before(() => {

	});
	it('Should register user', () => {
		return assert.isFulfilled(sut.registration(register));

	});
	it('Should register another user', () => {
		return assert.isFulfilled(sut.registration(register2));

	});
	it('Should not allow same username to be registered twice', () => {
		return assert.isRejected(sut.registration(register));
	});
	it('Should not allow invalid payload', () => {
		return assert.isRejected(sut.registration(register3));
	});
});