'use strict';

const VM_PORT = 1974;
const API_PORT = 3001;

const net = require('net');
const hapi = require('hapi');

const CRLF = '\r\n';
const Util = require('../common/util');
const util = new Util();
const logger = new Util().logger;
const eol = util.eol;
const VehicleCommandHandler = require('./command_handler');


module.exports = function VehicleMgr() {
	const vehicleCommandHandler = new VehicleCommandHandler(logger);
	let httpServer = null ;
	let server = null;
	
	function _startIPServer() {
		return new Promise((resolve) => {
			const server = net.createServer(function (socket) {
				socket.write('HELLO PHEV' + CRLF);
				socket.on('connect', () => {
					logger.debug('Client connected ' + socket.toString());
				});
				socket.on('data', (data) => {
					logger.debug('Data ' + data);
					vehicleCommandHandler.handleCommand(data.toString()).then((result) => {
						socket.write(eol(result));
					});
				});
			});
			server.listen(process.env.VM_PORT || VM_PORT, '0.0.0.0', () => {
				logger.info('Vehicle Manager listening on port ' + VM_PORT);
			});
			resolve(server);
		});
	}
	function _startHttpServer() {
		return new Promise((resolve, reject) => {
			const httpServer = new hapi.Server();
		
			httpServer.connection({ port: process.env.VM_API_PORT || API_PORT });
			httpServer.start((err) => {
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
				logger: logger,
			},
		}, (err) => {

			if (err) {
				throw err;
			}
		});
	}
	function _start(done) {

		const startIPProm = _startIPServer();
		const startHttpProm = _startHttpServer();

		Promise.all([startIPProm, startHttpProm])
			.then((resp) => {
				server = resp[0];
				httpServer = resp[1];
				done();
			})
			.catch((err) => {
				throw err;
			});
	}

	function _stop(timeout, done) {

		server.close((err) => {
			if (err) {
				return done(err);
			}
			logger.info('Vehicle Manager all connections closed and shut down.');
		});

		httpServer.stop({ 'timeout': timeout }, (err) => {
			if (err) {
				return done(err);
			}
			logger.info('Vehicle Manager api connections closed and shut down.');
			done();
		});
	}

	return {
		stop: (timeout, done) => {
			_stop(timeout, done);
		},
		start: (done) => {
			_start(done);
		},
		sendCommand: () => {

		},
	};
};