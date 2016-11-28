'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var UserService = require('./user_service');

var sut = new UserService();

chai.use(chaiAsPromised);

describe('User Service add', function () {

	it('Should add user', function () {
		return assert.isFulfilled(sut.addUser({ userId: '123456789' }));
	});
	it('Should not add user with existing username', function () {
		return assert.isFulfilled(sut.addUser({ userId: '123456789abcdef' }));
	});
	it.skip('Should not add user with existing email', function () {
		return assert.isRejected(sut.addUser({ userId: 'abcdef', email: 'jamie@me.com' }));
	});
	it('Should not allow same User Id to be registered twice', function () {
		return assert.isRejected(sut.addUser({ userId: '123456789' }));
	});
});

describe('User store get user Id', function () {
	it('Should get user from User Id', function () {
		return assert.becomes(sut.getUser('123456789'), { userId: '123456789' });
	});
	it('Should not get user for non registered User Id', function () {
		return assert.becomes(sut.getUser('123456789abc'), undefined);
	});
	it('Should get all users', function () {
		return assert.becomes(sut.getUsers(), { '123456789': { userId: '123456789' }, '123456789abcdef': { userId: '123456789abcdef' } });
	});
	it.skip('Should get users by device Id', function () {
		return assert.becomes(sut.getUserByDeviceId('1234'), { '123456789': { userId: '123456789' }, '123456789abcdef': { userId: '123456789abcdef' } });
	});
});