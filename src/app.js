'use strict';
import { MessageBus, Message, MessageTypes, MessageCommands } from './common/message_bus/message_bus';
import { Topics } from './common/message_bus/topics';
import { logger } from './common/logger';
import Operations from './operations/operations';
import VehicleManager from './vehicle_manager/vehicle_manager';
import UserService from './user_manager/service/user_service';
import VehicleService from './vehicle_manager/service/vehicle_service';
import DongleService from './vehicle_manager/service/dongle_service';

export default class App {
	constructor({
		messageBus = new MessageBus({ logger }),
		operations = new Operations({ logger, messageBus })
	} = {}) {

		this.logger = logger;

		this.messageBus = messageBus;
		this.operations = operations;
		
		this.messageBus.start();
		
		process.on('exit', () => {
			this.logger.info('Exit - Stopping application');
			this.stop(60 * 1000, () => {
				this.logger.info('Application stopped');
				process.exit(0);
			});
		});
		this.operations.start(() => {
			this.logger.info('Started Operations Manager service.');
		});
	}
	stop(timeout, done) {
		this.logger.info('Stopping services');

		this.messageBus.stop();

		this.operations.stop({ timeout: timeout }, (err) => {
			if (err) {
				this.logger.error('Operations Manager Server failed to stop ' + err);
				done(err);
			}
			this.logger.info('Operations Manager Server stopped');
		});
	}
	status() {
		return [];
	}
}