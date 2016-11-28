'use strict';

var VehicleService = require('../service/vehicle_service');
var Logger = require('../../common/util').logger;
var Boom = require('boom');

module.exports = function VehicleManagerApiController() {

	var vehicleService = new VehicleService();
	var logger = Logger;

	function _getVehicle(request, reply) {
		logger.debug('Call to get vehicle ' + request.params.vin + ' request.params.vin ');
		return vehicleService.getVehicle(request.params.vin).then(function (done) {
			if (done) {
				return reply(done).code(200);
			}
			return reply(Boom.badRequest(''));
		});
	}
	function _registerVehicle(request, reply) {
		return vehicleService.addVehicle(request.payload.vehicle).then(function () {
			return reply({}).created('/vehicleManger/vehicles/' + request.payload.vehicle.vin);
		});
	}
	return {
		getVehicle: _getVehicle,
		registerVehicle: _registerVehicle
	};
};