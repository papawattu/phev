'use strict';

//const LightsService = require('./lightsService');

module.exports = function VehicleManagerApiController(logger) {
    
    //const _lightsService = new LightsService();

    function _getVehicle(request,reply) {
        logger.debug('Call to get vehicle ' + request.params + ' request.payload ');
        
        return reply({status : 'ok'}).code(200);
    }
    return {
        getVehicle : _getVehicle
    }
};