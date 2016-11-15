'use strict';

const RegistrationService = require('./service');

module.exports = function registrationController(logger) {
    
	const registrationService = new RegistrationService();

    function _registration(request,reply) {
        logger.debug('Reguest registration ' + request.payload + ' request.payload ');
        return registrationService.createUser(request.payload.register).then(() => {
            return reply({status : 'ok'}).created('/users/' + request.payload.register.username);
        });
    }
    return {
        registration : _registration
    }
};