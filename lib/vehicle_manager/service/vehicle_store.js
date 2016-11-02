'use strict';
const logger  = require('../../common/logging');
const Store = require('../../common/Store');
const VehicleDTO = function (vin) {
    this.vin = vin;
    return this;
}
module.exports = function VehicleStore() {

    const store = new Store();

    function _getVehicle(err,vin) {
        logger.debug('Call to get vehicle vin ' + vin);
        let dto = store.get(vin);
        if(dto === undefined) {
            return err('Vehicle not found');
        }
        return dto;
    }
    function _registerVehicle(err,vehicle) {
        logger.debug('Call to register vehicle ' + vehicle);
        store.set(vehicle.vin,vehicle);
    }
    return {
        getVehicle : _getVehicle,
        registerVehicle : _registerVehicle,
        vehicleDto : VehicleDTO,
    }
}

exports.VehicleDTO;
