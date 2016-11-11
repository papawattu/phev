'use strict';

const registrationService = require('./service');

module.exports = function registrationController(logger) {
    
    const _registrationService = new registrationService();

    function _registration(request,reply) {
        logger.debug('Reguest registration ' + request.params + ' request.payload ');
        return _registrationService.createUser(request.payload.register).then((user) => {
            return reply({status : 'ok'}).created('/users/' + user.userName);
        });
    }
    return {
        registration : _registration
    }
};