'use strict';
const Logger = require('winston');
const Store = require('../../common/store/promise_store');
const VehNS = 'vehicles.';

module.exports = function VehicleService({store = new Store(), logger = Logger} = {}) {

	function _getVehicle(vin) {
		logger.debug('Call to get vehicle vin ' + vin);
		return store.get(VehNS + vin).then(data => {
			return data;
		});
	}
	function _getVehicleByDeviceId(id) {
		logger.debug('Call to get vehicle by id ' + id);
		return store.get('vehicles').then(data => {
			return data.find(e => e.deviceId === id);
		});
	}
	function _getVehicles() {
		logger.debug('Call to get vehicles vin ');
		return store.get('vehicles').then(data => {
			return data;
		});
	}
	function _addVehicle(vehicle) {
		logger.debug('Call to register vehicle ' + vehicle);
		return store.has(VehNS + vehicle.vin).then((exists) => {
			if(exists) {
				throw new Error('VIN already registered ' + vehicle.vin);
			}    
			return store.set(VehNS + vehicle.vin, vehicle);
		});
	}
	function _registerRemote(vehicle) {
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
		getVehicles: _getVehicles,
		addVehicle: _addVehicle,
		registerRemote: _registerRemote,
		getVehicleByDeviceId: _getVehicleByDeviceId,
	};
};