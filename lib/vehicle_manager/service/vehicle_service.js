'use strict';

var Logger = require('../../common/util').logger;
var Store = require('../../common/store/promise_store');
var VehNS = 'vehicles.';

module.exports = function VehicleService() {

	var store = new Store();
	var logger = Logger;
	function _getVehicle(vin) {
		logger.debug('Call to get vehicle vin ' + vin);
		return store.get(VehNS + vin).then(function (data) {
			return data;
		});
	}
	function _getVehicleByDeviceId(id) {
		logger.debug('Call to get vehicle by id ' + id);
		return store.get('vehicles').then(function (data) {
			return data.find(function (e) {
				return e.deviceId === id;
			});
		});
	}
	function _getVehicles() {
		logger.debug('Call to get vehicles vin ');
		return store.get('vehicles').then(function (data) {
			return data;
		});
	}
	function _addVehicle(vehicle) {
		logger.debug('Call to register vehicle ' + vehicle);
		return store.has(VehNS + vehicle.vin).then(function (exists) {
			if (exists) {
				throw new Error('VIN already registered ' + vehicle.vin);
			}
			return store.set(VehNS + vehicle.vin, vehicle);
		});
	}
	function _registerRemote(vehicle) {
		logger.debug('Call to register vehicle ' + vehicle);
		return store.has(VehNS + vehicle.vin).then(function (exists) {
			if (exists) {
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
		getVehicleByDeviceId: _getVehicleByDeviceId
	};
};