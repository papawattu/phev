'use strict';

import RegistrationService from './service';

module.exports = function registrationController({logger,messageBus}) {
    
	const registrationService = new RegistrationService({logger,messageBus});

	function _registration(request,reply) {
		logger.debug('Reguest registration ' + request.payload + ' request.payload ');
		registrationService.registration(request.payload).then(() => {
			reply({status : 'ok'}).created('/users/' + request.payload.register.user.username);
		}).catch((err) => {
			logger.error('Registration controller error ' + err);
			reply({status : 'error',error : err}).code(400);
		});
	}
	return {
		registration : _registration
	};
};