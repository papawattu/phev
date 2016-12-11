'use strict';

const VM_PORT = 1974;
const API_PORT = 3001;

const net = require('net');
const hapi = require('hapi');

const eol = require('../common/util').eol;
const VehicleCommandHandler = require('./command_handler');

const CRLF = '/r/n';

// TODO: change to class
module.exports = function VehicleMgr({logger=logger,messageBus}) {
	const vehicleCommandHandler = new VehicleCommandHandler();
	let httpServer = null;
	let server = null;
	let vmStatus = 'STOPPED';
	let vmApi = 'STOPPED';

	function _startIPServer() {
		return new Promise((resolve) => {
			server = net.createServer(function (socket) {
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
			server.on('error', (err) => {
				throw err;
			});
			try {
				server.listen(process.env.VM_PORT || VM_PORT, '0.0.0.0', () => {
					logger.info('Vehicle Manager listening on port ' + VM_PORT);
					vmStatus = 'STARTED';
					resolve(server);
				});
			} catch (err) {
				logger.error('Vehicle manager failed to start : ' + err);
				throw err;
			}
		});
	}
	function _startHttpServer() {
		return new Promise((resolve, reject) => {
			httpServer = new hapi.Server();

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
				messageBus: messageBus,
			},
		}, (err) => {

			if (err) {
				throw err;
			}
		});
	}
	function _start(done) {

		if (vmStatus != 'STARTED') {
			_startIPServer().then(() => {
				vmStatus = 'STARTED';
			}).catch((err) => {
				throw err;
			});
		} else {
			logger.info('Vehicle manaer already started');
			done();
		}
		if (vmApi != 'STARTED') {
			_startHttpServer().then(() => {
				vmApi = 'STARTED';
			}).catch((err) => {
				throw err;
			});
		}
		done();
	}
	function _stop(timeout, done) {

		Promise.all([
			new Promise((resolve, reject) => {
				if (vmStatus === 'STARTED') {
					server.close((err) => {
						if (err) {
							reject(err);
						}
						vmStatus = 'STOPPED';
						logger.info('Vehicle Manager IP connections closed and shut down.');
						resolve();
					});
				} else {
					logger.info('Tried to stop Vehicle Manager when it was not started');
					resolve();
				}
			}),
			new Promise((resolve, reject) => {
				if (vmApi === 'STARTED') {
					httpServer.stop({ 'timeout': timeout }, (err) => {
						if (err) {
							reject(err);
						}
						vmApi = 'STOPPED';
						logger.info('Vehicle Manager API connections closed and shut down.');
						resolve();
					});
				} else {
					logger.info('Tried to stop Vehicle API when it was not started');
					resolve();
				}
			})
		]).then(() => {
			done();
		}).catch(err => {
			done(err);
			throw err;
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