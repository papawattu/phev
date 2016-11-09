'use strict';
const Logger = require('../../common/logging');
const Store = require('../../common/store');
module.exports = function VehicleStore(_store, logging) {

	const store = _store || new Store();
	const logger = logging || Logger;

	function _getVehicle(vin) {
		logger.debug('Call to get vehicle vin ' + vin);
		return store.get(vin).then(data => data);
	}
	function _registerVehicle(vehicle) {
		logger.debug('Call to register vehicle ' + vehicle);
		return store.has(vehicle.vin).then((data) => {
			if(data) {
				return Promise.reject(new Error('VIN already registered ' + vehicle.vin));
			}    
			return store.set(vehicle.vin, vehicle);
		});
	}
	return {
		getVehicle: _getVehicle,
		registerVehicle: _registerVehicle,
	};
};