'use strict';

const logger = require('../../../common/logging');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../../common/store/promise_store');
const assert = chai.assert;
const RegistrationService = require('./service');

const sut = new RegistrationService({ store: new Store, logger: logger });

chai.use(chaiAsPromised);

const user = {
	name: 'Jamie',
	last: 'Nuttall',
	username: 'papawattu',
	email: 'email',
	phevSsid: '1234',
	phevPassword: '1234',
	vin: '1234',
};

const user2 = {
	name: 'Jamie',
	last: 'Nuttall',
	username: 'papawattu2',
	email: 'email',
	phevSsid: '1234',
	phevPassword: '1234',
	vin: '1234',
};

describe('Registration service', () => {

	before(() => {

	});
	it('Should register user', () => {
		return assert.isFulfilled(sut.createUser(user));

	});
	it('Should register another user', () => {
		return assert.isFulfilled(sut.createUser(user2));

	});
	it('Should not allow same username to be registered twice', () => {
		return assert.isRejected(sut.createUser(user));
	});
});