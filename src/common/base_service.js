import BaseClass from './base_class';
import * as Joi from 'joi';

export default class BaseService extends BaseClass {
	constructor({logger, messageBus} = {}) {
		super({logger});
		this.messageBus = messageBus;
	}
	registerMessageHandler(topic,schema,filter,commands) {
		this.messageBus.subscribe(topic, filter, (message) => {
			const replyMessage = Message.replyTo(message);
			Joi.validate(message.payload.user, schema, (err) => {
				if (err) {
					replyMessage.error = err;
				} else {
					replyMessage.payload =
						commands.find(e => e.name === message.command)
							.handle.call(this, message.payload);
				}
				messageBus.sendMessage(replyMessage);
			});
		});
	}
}