'use strict';

const logger = require('../../common/logging');
const assert = require('chai').assert;
const Store = require('../../common/Store');

const VehicleStore = require('./vehicle_store');

const store = new Store();
const sut = new VehicleStore(store,logger);

describe('Vehicle Store', () => {

    it('Should register VIN', (done) => {
        sut.registerVehicle({ vin : '1234'})
            .then((resolve,reject) => {
                done();
            });
    });
    it('Should get vehicle from VIN', () => {
        const result = sut.getVehicle('1234');
        assert(result.vin === '1234', 'VIN should be returned actually returned ' + result.vin);
    });
});