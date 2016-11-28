'use strict';

var LightsController = require('./controller');

exports.lights = function (server, options, next) {

	var _lightsController = new LightsController(options.logger);

	server.route([{
		method: 'PUT',
		path: '/api/operations/lights/{type}',
		handler: _lightsController.updateLights
	}]);

	next();
};

exports.lights.attributes = {
	pkg: require('./package.json')
};