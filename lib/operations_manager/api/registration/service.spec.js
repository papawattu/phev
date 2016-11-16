'use strict';

const logger = require('../../../common/logging');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../../common/store/promise_store');
const assert = chai.assert;
const expect = chai.expect;
const RegistrationService = require('./service');

const store = new Store();
const sut = new RegistrationService({store: new Store, logger: logger});

chai.use(chaiAsPromised);
const User = function(_firstName,_lastName,_userName,_password,_email,_phevSsid,_phevPassword,_vin) {
	let firstName = _firstName;
	let lastName = _lastName;
	let userName = _userName;
	let password = _password;
	let email = _email;
	let phevSsid = _phevSsid;
	let phevPassword = _phevPassword;
	let vin = _vin;
	this.toString = function () {
		return firstName + ' ' + lastName;
	};

};

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