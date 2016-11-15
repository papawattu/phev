'use strict';
const Logger = require('../../common/logging');
const Store = require('../../common/store/promise_store');
const VehNS = 'vehicle.store.';

module.exports = function VehicleStore({store = new Store(), logger = Logger} = {}) {

	function _getVehicle(vin) {
		logger.debug('Call to get vehicle vin ' + vin);
		return store.get(VehNS + vin).then(data => data);
	}
	function _registerVehicle(vehicle) {
		logger.debug('Call to register vehicle ' + vehicle);
		return store.has(VehNS + vehicle.vin).then((exists) => {
			if(exists) {
				throw new Error('VIN already registered ' + vehicle.vin);
			}    
			return store.set(VehNS + vehicle.vin, vehicle);
		});
	}
	return {
		getVehicle: _getVehicle,
		registerVehicle: _registerVehicle,
	};
};