import BaseClass from './base_class';
import { Message } from './message_bus/message_bus';
import * as Joi from 'joi';

export const ServiceStatus = {Stopped: 'STOPPED', Started: 'STARTED'};

export default class BaseService extends BaseClass {
	constructor({logger, messageBus} = {}) {
		super({logger});
		this.messageBus = messageBus;
		this.status = ServiceStatus.Stopped;
	}
	start() {
		this.status = ServiceStatus.Started;
	}
	stop() {
		this.status = ServiceStatus.Stopped;
	}
	registerMessageHandler(topic,schema,filter,commands) {
		this.messageBus.subscribe(topic, filter, (message) => {
			const replyMessage = Message.replyTo(message);
			Joi.validate(message.payload.user, schema, (err) => {
				if (err) {
					replyMessage.error = err;
				} else {
					try {
						replyMessage.payload =
							commands.find(e => e.name === message.command)
								.handle.call(this, message.payload);
					} catch(err) {
						replyMessage.error = err;
					}
				}
				this.messageBus.sendMessage(replyMessage);
			});
		});
	}
}