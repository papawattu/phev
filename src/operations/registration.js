import { RegistrationSchema } from '../common/data/schema';
import { Topics } from '../common/message_bus/topics';
import { Message, MessageTypes, MessageCommands } from '../common/message_bus';
import * as Joi from 'joi';
import HttpService from '../common/http_service';

export default class Registration extends HttpService {
	constructor({ messageBus}) {
        super({ messageBus, name: 'Registration'});
		this.logger.info('Started Registration');
	}
	start() {
		return super.start(() => {
			this.registerHttpHandler('registration', {
				get: {
                    path: '/registration',
                    method: () => {},
                },
                post: {
                    path: '/registration',
					method: (request, reply) => {
						this.registration(request.payload).then(() => {
							reply({ status: 'ok' }).created('/users/' + request.payload.register.user.username);
						}).catch((err) => {
							this.logger.error(`Registration error : ${JSON.stringify(err)}`);
							reply({ status: 'error', error: err }).code(400);
						});
					},
				},
			});
		});
	}
	stop(done) {
		super.stop(done);
	}
	createUser(user) {
		this.logger.debug(`createUser : ${JSON.stringify(user)}`);
		const message = new Message({ topic: Topics.USER_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: { user: user }, correlation: true });
		const response = new Promise((resolve, reject) => {
			this.messageBus.receiveMessageFilter(Topics.USER_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
				if (data.error === null) {
					resolve(data.payload);
				} else {
					this.logger.error(`create user error response : ${JSON.stringify(data.error)}`);
					reject(data.error);
				}
			});
		});
		this.messageBus.sendMessage(message);
		return response;
	}
	createVehicle(vehicle) {
		this.logger.debug(`createVehicle : ${JSON.stringify(vehicle)}`);
		const message = new Message({ topic: Topics.VEHICLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: { vehicle: vehicle }, correlation: true });
		const response = new Promise((resolve, reject) => {
			this.messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
				if (data.error === null) {
					resolve(data.payload);
				} else {
					this.logger.error(`create vehicle error response : ${JSON.stringify(data.error)}`);
					reject(data.error);
				}
			});
		});
		this.messageBus.sendMessage(message);
		return response;
	}
	createDevice(dongleId, vin) {
		this.logger.debug(`createDevice id: ${dongleId} vin: ${vin}`);
		const message = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: { dongle: { id: dongleId, vin: vin } }, correlation: true });
		const response = new Promise((resolve, reject) => {
			this.messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
				if (data.error === null) {
					resolve(data.payload);
				} else {
					this.logger.error(`create dongle error response : ${JSON.stringify(data.error)}`);
					reject(data.error);
				}
			});
		});
		this.messageBus.sendMessage(message);
		return response;
	}
	registration(reg) {
		return new Promise((resolve, reject) => {
			Joi.validate(reg, RegistrationSchema, (err, value) => {
				if (err) {
					this.logger.error('Validation rejected ' + JSON.stringify(value));
					reject(err);
				} else {
					resolve(value);
				}
			});
		}).then(() => {
			return Promise.all([
				this.createUser(reg.register.user),
				this.createVehicle(reg.register.vehicle),
				this.createDevice(reg.register.dongle.id, reg.register.vehicle.vin),
			]).then((resp) => {
				return resp;
			}).catch((err) => {
				this.logger.error('Failed to register ' + err);
				return Promise.reject(err);
			});
		}).catch((err) => {
			this.logger.error('Failed to register ' + err);
			return Promise.reject(err);
		});
	}
}
