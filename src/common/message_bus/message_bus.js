import EventEmitter from 'events';
import uuid from 'uuid';
import { logger } from '../logger';
import { Topics } from './topics';

export const MessageTypes = Object.freeze({ Broadcast: 'BROADCAST', Undefined: 'UNDEFINED', Request: 'REQUEST', Response: 'RESPONSE', 'Error': 'ERROR' });
export const MessageCommands = Object.freeze({ NoOperation: 'NOOP', Get: 'GET', Add: 'ADD', Delete: 'DELETE', List: 'LIST', Shutdown: 'SHUTDOWN' });
export const MessageBusStatus = Object.freeze({ Stopped: 'STOPPED', Started: 'STARTED' });

export class Message {
	constructor({topic = Topics.DEFAULT, type = MessageTypes.Request, command = MessageCommands.noOperation, payload = undefined, correlation = false, error = null} = {}) {
		this.topic = topic;
		this.type = type;
		this.command = command;
		this.payload = payload;
		this.error = error;
		this.id = uuid();
		this.correlationId = (correlation ? uuid() : null);
	}
	static replyTo(message) {
		const reply = new Message({ topic: message.topic, type: MessageTypes.Response, command: message.command });
		reply.correlationId = message.correlationId;
		return reply;
	}
	toString() {
		return JSON.stringify(this);
	}
}
export class MessageBus extends EventEmitter {
	constructor({name = 'default', logger = logger} = {}) {
		super();
		this.setMaxListeners(0);
		this.status = MessageBusStatus.Stopped;
		super.on('error', (err) => {
			logger.error('Whoops! there was an error in the Message Bus : ' + err);
			throw err;
		});

		this.name = name;

	}
	errorIfNotStarted() {
		if (this.status === MessageBusStatus.Started) return;
		logger.error('Message bus not started cannot send or receive messages');
		throw new Error('Message bus not started cannot send or receive messages');
	}
	handleSystemCommand(data) {
		switch (data.command) {
		case MessageCommands.Shutdown: {
			this.stop();
			break;
		}
		}
	}
	start() {
		super.on(this.name, () => {
			logger.info(this.name + ': Message Bus Started');
		});
		this.status = MessageBusStatus.Started;
		this.subscribe(Topics.SYSTEM, {}, (data) => {
			this.handleSystemCommand(data);
		});
	}
	stop() {
		this.removeAllListeners();
		this.status = MessageBusStatus.Stopped;
		logger.info(this.name + ': Message Bus Stopped');
	}
	sendMessage(message) {
		this.errorIfNotStarted();
		super.emit(this.name, message);
		return message.id;
	}
	subscribe(topic, f, callback) {
		this.errorIfNotStarted();
		super.on(this.name, (data) => {
			if (data.topic === topic) this.filter(f,data,callback);
		});
	}
	filter(f,data,callback) {
		const keys = Object.keys(f);
		if (keys.every((e) => data[e] === f[e])) callback(data);
	}
	receiveMessageFilter(topic, f, callback) {
		this.errorIfNotStarted();
		super.once(this.name, (data) => {
			if (data.topic === topic) this.filter(f,data,callback);
		});
	}
}