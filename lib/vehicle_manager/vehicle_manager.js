'use strict';

var VM_PORT = 1974;
var API_PORT = 3001;

var net = require('net');
var hapi = require('hapi');

var CRLF = '\r\n';
var logger = require('../common/util').logger;
var eol = require('../common/util').eol;
var VehicleCommandHandler = require('./command_handler');

module.exports = function VehicleMgr() {
	var vehicleCommandHandler = new VehicleCommandHandler();
	var httpServer = null;
	var server = null;

	function _startIPServer() {
		return new Promise(function (resolve, reject) {
			try {
				server = net.createServer(function (socket) {
					socket.write('HELLO PHEV' + CRLF);
					socket.on('connect', function () {
						logger.debug('Client connected ' + socket.toString());
					});
					socket.on('data', function (data) {
						logger.debug('Data ' + data);
						vehicleCommandHandler.handleCommand(data.toString()).then(function (result) {
							socket.write(eol(result));
						});
					});
				});
				server.listen(process.env.VM_PORT || VM_PORT, '0.0.0.0', function () {
					logger.info('Vehicle Manager listening on port ' + VM_PORT);
				});
				resolve(server);
			} catch (err) {
				reject(err);
			}
		});
	}
	function _startHttpServer() {
		return new Promise(function (resolve, reject) {
			httpServer = new hapi.Server();

			httpServer.connection({ port: process.env.VM_API_PORT || API_PORT });
			httpServer.start(function (err) {
				if (err) {
					reject(err);
				}
				_registerPlugins(httpServer);
				logger.info('Vehicle Manager Http Api manager listening', httpServer.info.uri);
				resolve(httpServer);
			});
		});
	}

	function _registerPlugins(server) {
		server.register({
			register: require('./api').VehicleManagerApiPlugin,
			options: {
				logger: logger
			}
		}, function (err) {

			if (err) {
				throw err;
			}
		});
	}
	function _start(done) {

		var startIPProm = _startIPServer();
		var startHttpProm = _startHttpServer();

		Promise.all([startIPProm, startHttpProm]).then(function () {
			done();
		}).catch(function (err) {
			throw err;
		});
	}

	function _stop(timeout, done) {

		Promise.all([new Promise(function (resolve, reject) {
			if (server != null) {
				server.close(function (err) {
					if (err) {
						reject(err);
					}
					logger.info('Vehicle Manager all connections closed and shut down.');
				});
			}
		}), new Promise(function (resolve, reject) {
			if (httpServer != null) {
				httpServer.stop({ 'timeout': timeout }, function (err) {
					if (err) {
						reject(err);
					}
					logger.info('Vehicle Manager api connections closed and shut down.');
					done();
				});
			}
		})]).then(function () {
			done();
		}).catch(function (err) {
			throw err;
		});
	}

	return {
		stop: function stop(timeout, done) {
			_stop(timeout, done);
		},
		start: function start(done) {
			_start(done);
		},
		sendCommand: function sendCommand() { }
	};
};