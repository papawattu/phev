'use strict';
import {MessageBus} from './common/message_bus/message_bus';
const logger = require('./common/logging');
const OpManager = require('./operations_manager/operations_manager');
const VehicleMgr = require('./vehicle_manager/vehicle_manager');


module.exports = function App() {

	const messageBus = new MessageBus('main');
	const opmgr = new OpManager({logger,messageBus});
	const vmgr = new VehicleMgr();

	messageBus.start();

	process.on('SIGTERM', function () {
		logger.info('SIGTERM - Stopping application');
		_stop(10000 * 20, () => {
			logger.info('Application stopped');
			process.exit(0);
		});
	});
	try {
		opmgr.start(() => {
			logger.info('Started Operations Manager service.');
		});
		vmgr.start(() => {
			logger.info('Started Vehicle Manager service.');
		});
	} catch (err) {
		throw err;
	}
	function _stop(timeout, done) {
		logger.info('Stopping services');
		opmgr.stop({ timeout: timeout }, (err) => {
			if (err) {
				logger.error('Operations Manager Server failed to stop ' + err);
				done(err);
			}
			logger.info('Operations Manager Server stopped');
		});
		vmgr.stop({ timeout: timeout }, (err) => {
			if (err) {
				logger.error('Vehicle Manager Server failed to stop ' + err);
				done(err);
			}
			logger.info('Vehicle Manager Server stopped');
			done();
		});
	}

	return {
		stop: _stop,
		status: () => {
			return [];
		}
	};
};