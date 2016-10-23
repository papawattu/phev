'use strict';

const LightsService = require('./lightsService');

module.exports = function lightsController() {
    
    const _lightsService = new LightsService();

    function _updateLights(request,reply) {
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
    }
};