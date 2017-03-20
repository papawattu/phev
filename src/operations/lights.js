import { LightsSchema } from '../common/data/schema';
import { Topics } from '../common/message_bus/topics';
import { Message, MessageTypes, MessageCommands } from '../common/message_bus';
import * as Joi from 'joi';
import HttpService from '../common/http_service';

export default class Lights extends HttpService {
	constructor({ messageBus,port}) {
		super({ messageBus, name: 'Lights', port});
		this.logger.info('Started Lights');
	}
	start() {
		return super.start(() => {
			this.registerHttpHandler('lights', {
				get: {
					path: '/lights/head',
					method: () => {},
				},
				put: {
					path: '/lights/head',
					method: (request, reply) => {
						this.lights(request.payload).then(() => {
							reply({ status: 'ok' }).code(200);
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
	lights(reg) {
		return new Promise((resolve, reject) => {
			Joi.validate(reg, LightsSchema, (err, value) => {
				if (err) {
					this.logger.error(`Validation rejected : ${JSON.stringify(value)}`);
					reject(err);
				} else {
					resolve(value);
				}
			});
		}).then(() => {
			return new Promise((resolve,reject) => {
				resolve();
			});
		});
	}
}
