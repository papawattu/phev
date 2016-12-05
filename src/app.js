'use strict';
import { MessageBus, Message, MessageTypes, MessageCommands } from './common/message_bus/message_bus';
import { Topics } from './common/message_bus/topics';
import { logger } from './common/logger';
import Operations from './operations/operations';
import VehicleManager from './vehicle_manager/vehicle_manager';
import UserRepository from './user_repository/user_repository';
import VehicleService from './vehicle_manager/service/vehicle_service';
import DongleService from './vehicle_manager/service/dongle_service';

export default class App {
	constructor({
		messageBus = new MessageBus({ logger, name: 'Main Application' }),
		operations = new Operations({ logger, messageBus })
	} = {}) {

		this.logger = logger;

		this.messageBus = messageBus;
		this.operations = operations;
		
		this.messageBus.start();
		
		this.operations.start(() => {
			this.logger.info('Started Operation Endpoints');
		});
	}
	stop(done) {
		this.logger.info('Stopping services');

		this.messageBus.stop();

		this.operations.stop(() => {
			this.logger.info('Stopped Operation Endpoints');
			done();
		});
	}
	status() {
		return [];
	}
}