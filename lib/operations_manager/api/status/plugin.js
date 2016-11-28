'use strict';

var StatusController = require('./controller');

exports.status = function (server, options, next) {
	var _statusController = new StatusController(options.status, options.logger);
	server.route([{
		method: 'GET',
		path: '/api/operations/status',
		handler: _statusController.getStatus
	}]);

	next();
};

exports.status.attributes = {
	pkg: require('./package.json')
};