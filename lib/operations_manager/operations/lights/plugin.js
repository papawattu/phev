'use strict';

const LightsController = require('./controller');

exports.lights = function (server, options, next) {

	const _lightsController = new LightsController(options.logger);

	server.route([{
		method: 'PUT',
		path: '/operations/lights/{type}',
		handler: _lightsController.updateLights,
	},

	]);

	next();
};

exports.lights.attributes = {
	pkg: require('./package.json')
};