'use strict';
const VehicleService = require('../service/vehicle_service');
const Logger = require('../../common/util').logger;
const Boom = require('boom');	

module.exports = function VehicleManagerApiController() {
	
	const vehicleService = new VehicleService();
	const logger = Logger;

	function _getVehicle(request,reply) {
		logger.debug('Call to get vehicle ' + request.params.vin + ' request.params.vin ');
		return vehicleService.getVehicle(request.params.vin).then((done) => {
			if(done) {
				return reply(done).code(200);
			}
			return reply(Boom.badRequest(''));	
		});
	}
	function _registerVehicle(request,reply) {
		return vehicleService.addVehicle(request.payload.vehicle).then(() => {
			return reply({}).created('/vehicleManger/vehicles/' + request.params.vin);
		});
	}
	return {
		getVehicle : _getVehicle,
		registerVehicle : _registerVehicle,
	};
};