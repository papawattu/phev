'use strict';

const logger = require('../../common/logging');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../common/store/promise_store');
const assert = chai.assert;
const VehicleStore = require('./vehicle_store');

const store = new Store();
const sut = new VehicleStore({store, logger});

chai.use(chaiAsPromised);

describe('Vehicle Store register', () => {

    it('Should register VIN', () => {
        return assert.isFulfilled(sut.registerVehicle({ vin: '123456789' }));
    });
    it('Should not allow same VIN to be registered twice', () => {
        return assert.isRejected(sut.registerVehicle({ vin: '123456789' }));
    });
});

describe('Vehicle store get vin', () => {
	it('Should get vehicle from VIN', () => {
		return assert.becomes(sut.getVehicle('123456789'), {vin : '123456789'});
	});
	it('Should not get vehicle for non registered VIN', () => {
		return assert.becomes(sut.getVehicle('12345678abcd',null));
	});
});
