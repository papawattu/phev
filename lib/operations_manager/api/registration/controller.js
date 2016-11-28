'use strict';

var RegistrationService = require('./service');

module.exports = function registrationController(logger) {

	var registrationService = new RegistrationService();

	function _registration(request, reply) {
		logger.debug('Reguest registration ' + request.payload + ' request.payload ');
		registrationService.registration(request.payload).then(function () {
			return reply({ status: 'ok' }).created('/users/' + request.payload.register.user.username);
		}).catch(function (err) {
			return reply({ status: 'error', error: err }).status(400);
		});
	}
	return {
		registration: _registration
	};
};