'use strict';

module.exports = function VehicleStore(_store,logging) {
    const Logger  = require('../../common/logging');
    const Store = require('../../common/Store');

    const store = _store || new Store();
    const logger = logging || Logger;

    function _getVehicle(vin) {
        logger.debug('Call to get vehicle vin ' + vin);
        return store.get(vin).then((resolve,reject) => {
            resolve();
        });
    }
    function _registerVehicle(vehicle) {
        logger.debug('Call to register vehicle ' + vehicle);
        store.set(vehicle.vin,vehicle);
    }
    return {
        getVehicle : _getVehicle,
        registerVehicle : _registerVehicle,
    }
}