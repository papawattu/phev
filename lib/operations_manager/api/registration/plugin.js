'use strict';

//const Joi = require('joi');

var RegistrationController = require('./controller');

exports.registration = function (server, options, next) {

	var _registrationController = new RegistrationController(options.logger);

	server.route([{
		method: 'POST',
		path: '/api/operations/registration',
		handler: _registrationController.registration
	}]);

	next();
};

exports.registration.attributes = {
	pkg: require('./package.json')
};