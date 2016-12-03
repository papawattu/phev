'use strict';

const VehicleManagerApiController = require('./controller');

exports.VehicleManagerApiPlugin = function (server, options, next) {

	const _vehicleManagerApiController = new VehicleManagerApiController({logger: options.logger, messageBus : options.messageBus});

	server.route([{
		method: 'GET',
		path: '/vehicleManager/{vin}',
		handler: _vehicleManagerApiController.getVehicle,
	},{
		method: 'POST',
		path: '/vehicleManager',
		handler: _vehicleManagerApiController.registerVehicle,
	}

	]);

	next();
};

exports.VehicleManagerApiPlugin.attributes = {
	pkg: require('./package.json')
};