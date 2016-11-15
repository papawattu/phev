'use strict';

module.exports = function VehicleManagerApiController({logger = require('../../common/logging')} = {}) {

	function _getVehicle(request,reply) {
		logger.debug('Call to get vehicle ' + request.params + ' request.payload ');
        
		return reply({status : 'ok'}).code(200);
	}
	return {
		getVehicle : _getVehicle
	};
};