'use strict';

const logger = require('../../common/logging');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Store = require('../../common/store');
const assert = chai.assert;
const VehicleStore = require('./vehicle_store');

const store = new Store();
const sut = new VehicleStore(store, logger);

chai.use(chaiAsPromised);

describe('Vehicle Store register', () => {

<<<<<<< HEAD
	it('Should register VIN', () => {
		return sut.registerVehicle({ vin: '12345678' })
            .then(() => {
	return assert.eventually.isTrue(store.has('12345678'));
});
	});
	it('Should not allow same VIN to be registered twice', () => {
		return assert.isRejected(sut.registerVehicle({ vin: '12345678' }));
	});
=======
    it('Should register VIN', () => {
        return sut.registerVehicle({ vin: '123456789' })
            .then(() => {
                return assert.eventually.isTrue(store.has('123456789'));
            });
    });
    it('Should not allow same VIN to be registered twice', () => {
        return assert.isRejected(sut.registerVehicle({ vin: '12345678' }));
    });
>>>>>>> 5005871744373ba62352866e6895f747e1594af7
});

describe('Vehicle store get vin', () => {
	it('Should get vehicle from VIN', () => {
		return assert.eventually.equal(sut.getVehicle('12345678'), {vin : '12345678'});
	});
	it('Should not get vehicle for non registeed VIN', () => {
		return assert.eventually.equal(sut.getVehicle('12345678abcd',null));
	});
});
