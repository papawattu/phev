'use strict';
import { MessageBus, Message, MessageTypes, MessageCommands } from './common/message_bus/message_bus';
import { Topics } from './common/message_bus/topics';
import { logger } from './common/logger';
import Operations from './operations/operations';
import UserRepository from './user_repository/user_repository';
import DongleRepository from './vehicle_repository/dongle_repository';
import VehicleRepository from './vehicle_repository/vehicle_repository';

export default class App {
	constructor({
		messageBus = new MessageBus({ logger, name: 'Main Application' }),
		operations = new Operations({ logger, messageBus }),
		userRepository = new UserRepository({ logger, messageBus,port: 3037}),
		dongleRepository = new DongleRepository({ logger, messageBus,port: 3038}),
		vehicleRepository = new VehicleRepository({ logger, messageBus, poert: 3039})
	} = {}) {

		this.logger = logger;
		this.messageBus = messageBus;
		this.operations = operations;
		
		
		this.vehicleRepository = vehicleRepository;
		this.userRepository = userRepository;
		this.dongleRepository = dongleRepository;

		this.messageBus.start();

		this.vehicleRepository.start(() => {
			this.logger.info('Started Vehicle Repository');
		});
		this.userRepository.start(() => {
			this.logger.info('Started User Repository');
		});
		this.dongleRepository.start(() => {
			this.logger.info('Started Dongle Repository');
		});
		this.operations.start(() => {
			this.logger.info('Started Operation Endpoints');
		});
	}
	stop(done) {
		this.logger.info('Stopping services');

		this.vehicleRepository.stop(() => {
			this.logger.info('Stopped Vehicle Repository');
		});
		this.userRepository.stop(() => {
			this.logger.info('Stopped User Repository');
		});
		this.dongleRepository.stop(() => {
			this.logger.info('Stopped Dongle Repository');
		});
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