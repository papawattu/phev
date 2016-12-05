'use strict';

//const Joi = require('joi');
const RegistrationController = require('./controller');

exports.registration = function (server, options, next) {

	const _registrationController = new RegistrationController({logger: options.logger,messageBus: options.messageBus});

	server.route([{
		method: 'POST',
		path: '/api/operations/registration',
		handler: _registrationController.registration,
	}]);

	next();
};

exports.registration.attributes = {
	pkg: require('./package.json')
};