'use strict';

const logger = require('../../common/logging');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../common/store/promise_store');
const assert = chai.assert;
const DeviceStore = require('./device_store');

const store = new Store();
const sut = new DeviceStore({store, logger});

chai.use(chaiAsPromised);

describe('Device Store register', () => {

	it('Should register device ID', () => {
		return assert.isFulfilled(sut.addDevice({ id: '123456789' }));
	});
	it('Should register more than 1 device', () => {
		return assert.isFulfilled(sut.addDevice({ id: '123456789abcdef' }));
	});
	it('Should not allow same device to be registered twice', () => {
		return assert.isRejected(sut.addDevice({ id: '123456789' }));
	});
});

describe('Device store get device', () => {
	it('Should get Device from VIN', () => {
		return assert.becomes(sut.getDevice('123456789'), {id : '123456789'});
	});
	it('Should not get Device for non registered VIN', () => {
		return assert.becomes(sut.getDevice('123456789abc'),undefined);
	});
	it('Should get all Devices', () => {
		return assert.becomes(sut.getDevices(),{'123456789': {id: '123456789'},'123456789abcdef': {id: '123456789abcdef'}});
	});
});
