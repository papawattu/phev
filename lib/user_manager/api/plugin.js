'use strict';

var VehicleManagerApiController = require('./controller');

exports.VehicleManagerApiPlugin = function (server, options, next) {

	var _vehicleManagerApiController = new VehicleManagerApiController(options.logger);

	server.route([{
		method: 'GET',
		path: '/vehicleManager/{vin}',
		handler: _vehicleManagerApiController.getVehicle
	}, {
		method: 'POST',
		path: '/vehicleManager',
		handler: _vehicleManagerApiController.registerVehicle
	}]);

	next();
};

exports.VehicleManagerApiPlugin.attributes = {
	pkg: require('./package.json')
};