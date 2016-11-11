'use strict';

const registrationService = require('./service');

module.exports = function registrationController(logger) {
    
	const _registrationService = new registrationService();

<<<<<<< HEAD
	function _registration(request,reply) {
		logger.debug('Reguest registration ' + request.params + ' request.payload ');
        
        
		return reply({status : 'ok'}).code(200);
	}
	return {
		registration : _registration
	};
=======
    function _registration(request,reply) {
        logger.debug('Reguest registration ' + request.params + ' request.payload ');
        return _registrationService.createUser(request.payload.register).then((user) => {
            return reply({status : 'ok'}).created('/users/' + user.userName);
        });
    }
    return {
        registration : _registration
    }
>>>>>>> 5005871744373ba62352866e6895f747e1594af7
};