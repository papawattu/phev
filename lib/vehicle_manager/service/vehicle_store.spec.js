'use strict';

const logger = require('../../common/logging');
const assert = require('chai').assert;

const VehicleStore = require('./vehicle_store');


const sut = new VehicleStore(logger);

describe('Vehicle Store', () => {
    before(()=> {
        let dto = new VehicleStore('1234').VehicleDTO;
        sut.registerVehicle((err) => { throw new Error(err);},dto)
    });

    it('Should get vehicle from VIN', () => {
        const result = sut.getVehicle((err)=> { throw new Error(err);}, '1234');
        assert(result.vin === '1234', 'VIN should be returned actually returned ' + result.vin);
    });
});