'use strict';

const hapi = require('hapi');

module.exports = function OperationsManagerHttpApi({logger,messageBus}) {

	const httpServer = new hapi.Server({
		debug: {
			request: ['error'],
			log: ['error']
		}
	});
	let _status = 'STOPPED';
	let pluginsRegistered = false;

	httpServer.connection({
		port: process.env.SERVER_PORT || 3000,
	});

	if (!pluginsRegistered) {
		_registerPlugins();
		pluginsRegistered = true;
	}

	function _registerPlugins() {
		logger.debug('Register plugins');
		httpServer.register([{
			register: require('./api/lights/').lights,
			options: {
				logger: logger,
				messageBus: messageBus,
			},
		},
		{
			register: require('./api/registration').registration,
			options: {
				logger: logger,
				messageBus: messageBus,
			},
		},
		{
			register: require('./api/status').status,
			options: {
				logger: logger,
				status: _status,
			},
		}], (err) => {

			if (err) {
				throw err;
			}
		});
	}

	return {
		start: (done) => {
			logger.debug('Starting Operations Manager.');
			if (_status === 'RUNNING') {
				logger.info('Operations Manager Http Api manager already running');
				return done();
			}
			httpServer.start((err) => {
				if (err) {
					throw err;
				}
				logger.info('Operations Manager Http Api manager listening', httpServer.info.uri);
				_status = 'RUNNING';
				return done();
			});
		},
		stop: (timeout, done) => {
			logger.debug('Stopping Operations Manager.');
			httpServer.stop({ timeout: timeout }, (err) => {
				if (err) {
					_status = 'UNKNOWN';
					throw err;
				}
				logger.info('Operations Manager Http Api manager stopped listening');
				_status = 'STOPPED';
				done();
			});

		},
		status: () => {
			return _status;
		}
	};
};