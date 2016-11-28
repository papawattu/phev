'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const DeviceService = require('./device_service');

const sut = new DeviceService();

chai.use(chaiAsPromised);

describe.skip('Device Store register', () => {

	it('Should register device ID', () => {
		assert.isFulfilled(sut.addDevice({ id: '123456789' }));
		return assert.becomes(sut.addDevice({ id: '123456789' }),'OK');
	});
	it('Should register more than 1 device', () => {
		assert.isFulfilled(sut.addDevice({ id: '123456789abcdef' }));
		return assert.becomes(sut.addDevice({ id: '123456789abcdef' }),'OK');
	});
	it('Should not allow same device to be registered twice', () => {
		assert.isFulfilled(sut.addDevice({ id: '123456789' }));
		return assert.becomes(sut.addDevice({ id: '123456789' }),'ERROR');
	});
});

describe.skip('Device store get device', () => {
	it('Should get Device from ID', () => {
		return assert.becomes(sut.getDevice('123456789'), {id : '123456789'});
	});
	it('Should not get Device for non registered ID', () => {
		return assert.becomes(sut.getDevice('123456789abc'),undefined);
	});
	it('Should get all Devices', () => {
		return assert.becomes(sut.getDevices(),{'123456789': {id: '123456789'},'123456789abcdef': {id: '123456789abcdef'}});
	});
});
