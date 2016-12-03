import VehicleService from '../service/vehicle_service';

module.exports = function VehicleManagerApiController({logger,messageBus}) {
	
	const vehicleService = new VehicleService({logger,messageBus});

	function _getVehicle(request,reply) {
		logger.debug('Call to get vehicle ' + request.params.vin + ' request.params.vin ');
		const vehicle = vehicleService.getVehicle(request.params.vin);
		if(vehicle != undefined) {
			reply(vehicle).code(200);
		} else {
			reply({status: '\"Not Found\"'}).code(404);
		}
		//reply(Boom.badRequest(' ' + vehicle));	
	}
	function _registerVehicle(request,reply) {
		try {
			vehicleService.addVehicle(request.payload.vehicle);
			return reply({}).created('/vehicleManger/vehicles/' + request.payload.vehicle.vin);
		} catch(err) {
			throw err;
		}
	}
	return {
		getVehicle : _getVehicle,
		registerVehicle : _registerVehicle,
	};
};