'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var VehicleService = require('./vehicle_service');

var sut = new VehicleService();

chai.use(chaiAsPromised);

describe('Vehicle Store register', function () {

	it('Should register VIN', function () {
		return assert.isFulfilled(sut.addVehicle({ vin: '123456789' }));
	});
	it('Should register more than 1 VIN', function () {
		return assert.isFulfilled(sut.addVehicle({ vin: '123456789abcdef' }));
	});
	it('Should not allow same VIN to be registered twice', function () {
		return assert.isRejected(sut.addVehicle({ vin: '123456789' }));
	});
});

describe('Vehicle store get vin', function () {
	it('Should get vehicle from VIN', function () {
		return assert.becomes(sut.getVehicle('123456789'), { vin: '123456789' });
	});
	it('Should not get vehicle for non registered VIN', function () {
		return assert.becomes(sut.getVehicle('123456789abc'), undefined);
	});
	it('Should get all vehicles', function () {
		return assert.becomes(sut.getVehicles(), { '123456789': { vin: '123456789' }, '123456789abcdef': { vin: '123456789abcdef' } });
	});
	it.skip('Should get vehicles by device Id', function () {
		return assert.becomes(sut.getVehicleByDeviceId('1234'), { '123456789': { vin: '123456789' }, '123456789abcdef': { vin: '123456789abcdef' } });
	});
});