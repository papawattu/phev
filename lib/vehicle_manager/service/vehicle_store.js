'use strict';
const logger  = require('../../common/logging');
const Store = require('../../common/Store');

module.exports = function VehicleStore() {

    const store = new Store();

    function _getVehicle(vin) {
        logger.debug('Call to get vehicle vin ' + vin);
        return store.get(vin).then((resolve,reject) => {
            resolve
        });
    }
    function _registerVehicle(vehicle) {
        return new Promise((resolve,reject)=> {
            logger.debug('Call to register vehicle ' + vehicle);
            resolve(store.set(vehicle.vin,vehicle));
        });
            
    }
    return {
        getVehicle : _getVehicle,
        registerVehicle : _registerVehicle,
    }
}