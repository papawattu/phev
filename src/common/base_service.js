import BaseClass from './base_class';
import { Message } from './message_bus/message_bus';

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
	execute(commands, message, replyMessage) {
		const cmd = commands.find(e => e.name === message.command);
		try {
			if (cmd.async) {

				cmd.handle.call(this, message.payload, (data) => {
					replyMessage.payload = data;
					this.messageBus.sendMessage(replyMessage);
				});
			} else {
				replyMessage.payload =
					commands.find(e => e.name === message.command)
						.handle.call(this, message.payload);
				this.messageBus.sendMessage(replyMessage);
			}
		} catch (err) {
			this.logger.error(this.name + ' register message handler command failed ' + err);
			replyMessage.error = err;
			this.messageBus.sendMessage(replyMessage);
		}
	}
	registerMessageHandler(topic, schema, filter, commands) {
		this.messageBus.subscribe(topic, filter, (message) => {
			const replyMessage = Message.replyTo(message);
			this.execute(commands, message, replyMessage);
		});
	}
}