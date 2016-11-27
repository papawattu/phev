'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const UserService = require('./user_service');

const sut = new UserService();

chai.use(chaiAsPromised);

describe('User Service add', () => {

    it('Should add user', () => {
        return assert.isFulfilled(sut.addUser({ userId: '123456789' }));
    });
    it('Should not add user with existing username', () => {
        return assert.isFulfilled(sut.addUser({ userId: '123456789abcdef' }));
    });
    it('Should not add user with existing email', () => {
        return assert.isRejected(sut.addUser({ userId: 'abcdef',email: 'jamie@me.com' }));
    });
    it('Should not allow same User Id to be registered twice', () => {
        return assert.isRejected(sut.addUser({ userId: '123456789' }));
    });
});

describe('User store get user Id', () => {
    it('Should get user from User Id', () => {
        return assert.becomes(sut.getUser('123456789'), {userId : '123456789'});
    });
    it('Should not get user for non registered User Id', () => {
        return assert.becomes(sut.getUser('123456789abc'),undefined);
    });
    it('Should get all users', () => {
        return assert.becomes(sut.getUsers(),{'123456789': {userId: '123456789'},'123456789abcdef': {userId: '123456789abcdef'}});
    });
    it.skip('Should get users by device Id', () => {
        return assert.becomes(sut.getUserByDeviceId('1234'),{'123456789': {userId: '123456789'},'123456789abcdef': {userId: '123456789abcdef'}});
    });
});
