'use strict';

const RegistrationService = require('./service');

module.exports = function registrationController(logger) {
    
	const registrationService = new RegistrationService();

	function _registration(request,reply) {
		logger.debug('Reguest registration ' + request.payload + ' request.payload ');
		registrationService.registration(request.payload).then(() => {
			return reply({status : 'ok'}).created('/users/' + request.payload.register.user.username);
		}).catch((err) => {
			return reply({status : 'error',error : err}).status(400);
		});
	}
	return {
		registration : _registration
	};
};