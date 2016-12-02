import {RegistrationSchema} from '../../../common/data/schema';
import { Topics } from '../../../common/message_bus/topics';
import { Message,MessageTypes,MessageCommands } from '../../../common/message_bus';
import * as Joi from 'joi';
import { logger } from '../../../common/logger';
import BaseService from '../../../common/base_service';

export default class RegistrationService extends BaseService {
	constructor({logger, messageBus}) {
		
		logger.info('Started registration service');
		super({logger: logger,messageBus: messageBus});
	}
	createUser(user) {
		const message = new Message({ topic: Topics.USER_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: {user: user}, correlation: true });
		const response = new Promise((resolve,reject) => {
			this.messageBus.receiveMessageFilter(Topics.USER_TOPIC, { correlationId: message.correlationId,type: MessageTypes.Response }, (data) => {
				if(data.error === null) {
					resolve(data.payload);	
				} else { 
					logger.error(`create user error response : ${JSON.stringify(data.error)}`);
					reject(data.error);
				}
			});
		});
		this.messageBus.sendMessage(message);
		return response;
	}
	createVehicle(vin) {
		return Promise.resolve(vin);
	}
	createDevice(id) {
		return Promise.resolve(id);
	}
	registration(reg) {
		return new Promise((resolve, reject) => {
			Joi.validate(reg, RegistrationSchema, (err, value) => {
				if (err) {
					logger.error('Validation rejected ' + JSON.stringify(value));
					reject(err);
				} else {
					resolve(value);
				}
			});
		}).then(() => {
			return Promise.all([this.createUser(reg.register.user)])
				.then(() => {
					return {balls: true};
				})
				.catch((err) => {
					return err;
				});
		}).catch((err) => {
			return err;
		});
	}
}
