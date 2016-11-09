'use strict';

module.exports = function VehicleManagerApiController(logger) {

	const vehicleStore = [];

	function _getVehicle(request,reply) {
		logger.debug('Call to get vehicle ' + request.params + ' request.payload ');
        
		return reply({status : 'ok'}).code(200);
	}
	return {
		getVehicle : _getVehicle
	};
};