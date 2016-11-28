'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var DeviceService = require('./device_service');

var sut = new DeviceService();

chai.use(chaiAsPromised);

describe.skip('Device Store register', function () {

	it('Should register device ID', function () {
		assert.isFulfilled(sut.addDevice({ id: '123456789' }));
		return assert.becomes(sut.addDevice({ id: '123456789' }), 'OK');
	});
	it('Should register more than 1 device', function () {
		assert.isFulfilled(sut.addDevice({ id: '123456789abcdef' }));
		return assert.becomes(sut.addDevice({ id: '123456789abcdef' }), 'OK');
	});
	it('Should not allow same device to be registered twice', function () {
		assert.isFulfilled(sut.addDevice({ id: '123456789' }));
		return assert.becomes(sut.addDevice({ id: '123456789' }), 'ERROR');
	});
});

describe.skip('Device store get device', function () {
	it('Should get Device from ID', function () {
		return assert.becomes(sut.getDevice('123456789'), { id: '123456789' });
	});
	it('Should not get Device for non registered ID', function () {
		return assert.becomes(sut.getDevice('123456789abc'), undefined);
	});
	it('Should get all Devices', function () {
		return assert.becomes(sut.getDevices(), { '123456789': { id: '123456789' }, '123456789abcdef': { id: '123456789abcdef' } });
	});
});