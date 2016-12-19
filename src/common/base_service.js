import BaseClass from './base_class';
import { Message } from './message_bus/message_bus';
import * as Joi from 'joi';

export const ServiceStatus = { Stopped: 'STOPPED', Started: 'STARTED' };

export default class BaseService extends BaseClass {
	constructor({messageBus, name = 'defaultservicename'} = {}) {
		super({ name });
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
	execute(commands,message,replyMessage) {
		const cmd = commands.find(e => e.name === message.command);
		if (cmd.async) {
			console.log('cmd async ' + JSON.stringify(cmd) + ' payload ' + JSON.stringify(message.payload) + ' string ' + typeof message.payload);

			cmd.handle.call(this, message.payload, (data) => {
				console.log('data ' + data);
				replyMessage.payload = data;
				this.messageBus.sendMessage(replyMessage);
			});
		} else {
			console.log('cmd sync ' + JSON.stringify(cmd));

			try {
				replyMessage.payload =
					commands.find(e => e.name === message.command)
						.handle.call(this, message.payload);
			} catch (err) {
				this.logger.error(this.name + ' register message handler command failed ' + err);
				replyMessage.error = err;
			}
			this.messageBus.sendMessage(replyMessage);

		}
	}
	registerMessageHandler(topic, schema, filter, commands) {
		this.messageBus.subscribe(topic, filter, (message) => {
			const replyMessage = Message.replyTo(message);
			//if (schema != null) {
			//	Joi.validate(message.payload, schema, (err) => {
			//		if (err) {
			//			this.logger.error(this.name + ' register message handler validation failed ' + err);
			//			replyMessage.error = err;
			//			this.messageBus.sendMessage(replyMessage);
			//		} else {
						this.execute(commands,message,replyMessage);
			//		}
			//	});

	//		} else {
	//			this.execute(commands,message,replyMessage);
	//		}
		});
	}
}