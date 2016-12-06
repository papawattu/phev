import BaseClass from './base_class';
import { Message } from './message_bus/message_bus';
import * as Joi from 'joi';

export const ServiceStatus = { Stopped: 'STOPPED', Started: 'STARTED' };

export default class BaseService extends BaseClass {
	constructor({logger, messageBus, name = 'defaultservicename'}) {
		super({ logger, name });
		this.messageBus = messageBus;
		this.status = ServiceStatus.Stopped;
	}
	start(done) {
		this.logger.info('Started Service ' + this.name);
		this.status = ServiceStatus.Started;
		done();
	}
	stop(done) {
		this.logger.info('Stopped Service ' + this.name);
		this.status = ServiceStatus.Stopped;
		done();
	}
	registerMessageHandler(topic, schema, filter, commands) {
		this.messageBus.subscribe(topic, filter, (message) => {
			const replyMessage = Message.replyTo(message);
			Joi.validate(message.payload.user, schema, (err) => {
				if (err) {
					this.logger.error(this.name + ' register message handler validation failed ' + err);
					replyMessage.error = err;
				} else {
					try {
						replyMessage.payload =
							commands.find(e => e.name === message.command)
								.handle.call(this, message.payload);
					} catch (err) {
						this.logger.error(this.name + ' register message handler command failed ' + err);
						replyMessage.error = err;
					}
				}
				this.messageBus.sendMessage(replyMessage);
			});
		});
	}
}
export class PromiseBaseService extends BaseService {
	constructor({logger, messageBus, name = 'defaultpromiseservicename'}) {
		super({ logger, messageBus, name });
	}
	start() {
		super.start();
		return Promise.resolve();
	}
	stop() {
		super.stop();
		return Promise.resolve();
	}
}