'use strict';

var _logger = require('../common/logging');
var hapi = require('hapi');

module.exports = function OperationsManagerHttpApi(logger) {

	var httpServer = new hapi.Server({
		debug: {
			request: ['error'],
			log: ['error']
		}
	});
	var _status = 'STOPPED';
	var pluginsRegistered = false;
	logger = logger || _logger;

	httpServer.connection({
		port: process.env.SERVER_PORT || 3000
	});

	if (!pluginsRegistered) {
		_registerPlugins();
		pluginsRegistered = true;
	}

	function _registerPlugins() {
		//if (pluginsRegistered) return;
		logger.debug('Register plugins');
		httpServer.register([{
			register: require('./api/lights').lights,
			options: {
				logger: logger
			}
		}, {
			register: require('./api/registration').registration,
			options: {
				logger: logger
			}
		}, {
			register: require('./api/status').status,
			options: {
				logger: logger,
				status: _status
			}
		}], function (err) {

			if (err) {
				throw err;
			}
		});
	}

	return {
		start: function start(done) {
			logger.debug('Starting Operations Manager.');
			if (_status === 'RUNNING') {
				logger.info('Operations Manager Http Api manager already running');
				return done();
			}
			httpServer.start(function (err) {
				if (err) {
					throw err;
				}
				logger.info('Operations Manager Http Api manager listening', httpServer.info.uri);
				_status = 'RUNNING';
				return done();
			});
		},
		stop: function stop(timeout, done) {
			logger.debug('Stopping Operations Manager.');
			httpServer.stop({ timeout: timeout }, function (err) {
				if (err) {
					_status = 'UNKNOWN';
					throw err;
				}
				logger.info('Operations Manager Http Api manager stopped listening');
				_status = 'STOPPED';
				done();
			});
		},
		status: function status() {
			return _status;
		}
	};
};