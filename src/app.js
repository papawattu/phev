'use strict';
import {MessageBus,Message,MessageTypes,MessageCommands} from './common/message_bus/message_bus';
import {Topics} from './common/message_bus/topics';
import {logger} from './common/logger';

const OpManager = require('./operations_manager/operations_manager');
const VehicleMgr = require('./vehicle_manager/vehicle_manager');


module.exports = function App() {

	const messageBus = new MessageBus('main');
	const opmgr = new OpManager({logger,messageBus});
	const vmgr = new VehicleMgr();

	messageBus.start();

	process.on('exit', () => {
		logger.info('Exit - Stopping application');
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
		const message = new Message({topic: Topics.SYSTEM,type: MessageTypes.Broadcast,command: MessageCommands.Shutdown});
		
		logger.info('Stopping services');
		
		messageBus.sendMessage(message);
		
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