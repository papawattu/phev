'use strict';

const LightsService = require('./service');

module.exports = function lightsController(logger) {
    
	const _lightsService = new LightsService();

	function _updateLights(request,reply) {
		logger.debug('Reguest update lights ' + request.params + ' request.payload ');
		if(request.params.type === 'head')  {
			if(request.payload.set === 'on') {
				_lightsService.switchOnHeadLights();
			} else {
				_lightsService.switchOffHeadLights();
			}
		}
        
		return reply({status : 'ok'}).code(200);
	}
	return {
		updateLights : _updateLights
	};
};