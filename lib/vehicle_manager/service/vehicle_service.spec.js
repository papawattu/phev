'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const VehicleService = require('./vehicle_service');

const sut = new VehicleService();

chai.use(chaiAsPromised);

describe('Vehicle Store register', () => {

	it('Should register VIN', () => {
		return assert.isFulfilled(sut.addVehicle({ vin: '123456789' }));
	});
	it('Should register more than 1 VIN', () => {
		return assert.isFulfilled(sut.addVehicle({ vin: '123456789abcdef' }));
	});
	it('Should not allow same VIN to be registered twice', () => {
		return assert.isRejected(sut.addVehicle({ vin: '123456789' }));
	});
});

describe('Vehicle store get vin', () => {
	it('Should get vehicle from VIN', () => {
		return assert.becomes(sut.getVehicle('123456789'), {vin : '123456789'});
	});
	it('Should not get vehicle for non registered VIN', () => {
		return assert.becomes(sut.getVehicle('123456789abc'),undefined);
	});
	it('Should get all vehicles', () => {
		return assert.becomes(sut.getVehicles(),{'123456789': {vin: '123456789'},'123456789abcdef': {vin: '123456789abcdef'}});
	});
	it.skip('Should get vehicles by device Id', () => {
		return assert.becomes(sut.getVehicleByDeviceId('1234'),{'123456789': {vin: '123456789'},'123456789abcdef': {vin: '123456789abcdef'}});
	});
});
