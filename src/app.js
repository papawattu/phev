'use strict';
import { MessageBus } from './common/message_bus/message_bus';
import { logger } from './common/logger';
import Operations from './operations/operations';
import UserRepository from './user_repository/user_repository';
import DongleRepository from './vehicle_repository/dongle_repository';
import VehicleRepository from './vehicle_repository/vehicle_repository';
import VehicleGateway from './vehicle_gateway/vehicle_gateway';

export default class App {
	constructor({
		messageBus = new MessageBus({ name: 'Main Application' }),
		operations = new Operations({ messageBus }),
		userRepository = new UserRepository({ messageBus, port: 3000 }),
		dongleRepository = new DongleRepository({ messageBus, port: 3001 }),
		vehicleRepository = new VehicleRepository({ messageBus, port: 3002 }),
		vehicleGateway = new VehicleGateway({ messageBus, port: 3003 }),
	} = {}) {

		this.logger = logger;
		this.messageBus = messageBus;
		this.operations = operations;

		this.vehicleRepository = vehicleRepository;
		this.vehicleGateway = vehicleGateway;
		this.userRepository = userRepository;
		this.dongleRepository = dongleRepository;
		this.status = 'STOPPED';
		this.err = null;

		this.start((err) => {
			if (err) {
				this.logger.error('App failed to start : ' + err);
			}
		});
	}
	start(done) {

		this.messageBus.start();

		Promise.all([
			new Promise((response, reject) => {
				this.vehicleRepository.start((err) => {
					if (err) {
						reject(err);
					} else {
						this.logger.info('Started Vehicle Repository');
						response('Started Vehicle Repository');
					}
				});
			}),
			new Promise((response, reject) => {
				this.userRepository.start((err) => {
					if (err) {
						reject(err);
					} else {
						this.logger.info('Started User Repository');
						response('Started User Repository');
					}
				});
			}),
			new Promise((response, reject) => {
				this.dongleRepository.start((err) => {
					if (err) {
						reject(err);
					} else {
						this.logger.info('Started Dongle Repository');
						response('Started Dongle Repository');
					}
				});
			}),
			new Promise((response, reject) => {
				this.vehicleGateway.start((err) => {
					if (err) {
						reject(err);
					} else {
						this.logger.info('Started Vehicle Gateway');
						response('Started Vehicle Gateway');
					}
				});
			}),
			new Promise((response, reject) => {
				this.operations.start((err) => {
					if (err) {
						reject(err);
					} else {
						this.logger.info('Started Operation Endpoints');
						response('Started Operation Endpoints');
					}
				});
			})
		]).then(() => {
			this.logger.info('All services started sucessfully');
			this.status = 'STARTED';
			done();
		}).catch((err) => {
			this.logger.error('One or more applications failed to start with error(s) : ' + err);
			this.status = 'FAILED';
			this.err = err;
			done(err);
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
		this.vehicleGateway.stop(() => {
			this.logger.info('Stopped Vehicle Gateway');
		});
		this.operations.stop(() => {
			this.logger.info('Stopped Operation Endpoints');
		});
		this.messageBus.stop();
		done();
	}
}