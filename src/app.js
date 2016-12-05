'use strict';
import { MessageBus, Message, MessageTypes, MessageCommands } from './common/message_bus/message_bus';
import { Topics } from './common/message_bus/topics';
import { logger } from './common/logger';
import Operations from './operations_manager/operations_manager';
import VehicleManager from './vehicle_manager/vehicle_manager';
import UserService from './user_manager/service/user_service';
import VehicleService from './vehicle_manager/service/vehicle_service';
import DongleService from './vehicle_manager/service/dongle_service';

export default class App {
	constructor({
		messageBus = new MessageBus({ logger }),
		operationsManager = new Operations({ logger, messageBus }),
		vehicleManager = new VehicleManager({ logger, messageBus }) }= {}) {
		
		this.logger = logger;
		
		this.messageBus = messageBus;
		this.userService = new UserService({logger, messageBus,port: 3031});
		this.vehicleService = new VehicleService({logger, messageBus,port: 3032});
		this.dongleService = new DongleService({logger, messageBus,port: 3033});
		
		this.operationsManager = operationsManager;
		this.vehicleManager = vehicleManager;
		
		this.messageBus.start();
		this.userService.start();
		this.vehicleService.start();
		this.dongleService.start();
	
		process.on('exit', () => {
			this.logger.info('Exit - Stopping application');
			this.stop(10000 * 20, () => {
				this.logger.info('Application stopped');
				process.exit(0);
			});
		});
		try {
			this.operationsManager.start(() => {
				this.logger.info('Started Operations Manager service.');
			});
			this.vehicleManager.start(() => {
				this.logger.info('Started Vehicle Manager service.');
			});
		} catch (err) {
			throw err;
		}
	}
	stop(timeout, done) {
		const message = new Message({ topic: Topics.SYSTEM, type: MessageTypes.Broadcast, command: MessageCommands.Shutdown });

		this.logger.info('Stopping services');

		this.userService.stop(() => {});

		this.messageBus.sendMessage(message);

		this.messageBus.stop();
		
		this.operationsManager.stop({ timeout: timeout }, (err) => {
			if (err) {
				this.logger.error('Operations Manager Server failed to stop ' + err);
				done(err);
			}
			this.logger.info('Operations Manager Server stopped');
		});
		this.vehicleManager.stop({ timeout: timeout }, (err) => {
			if (err) {
				this.logger.error('Vehicle Manager Server failed to stop ' + err);
				done(err);
			}
			this.logger.info('Vehicle Manager Server stopped');
			done();
		});
	}
	status() {
		return [];
	}
}