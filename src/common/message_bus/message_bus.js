import EventEmitter from 'events';
import uuid from 'uuid';
import BaseClass from '../base_class';
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
export class MessageBus extends BaseClass {
	constructor({name = 'default', logger = logger} = {}) {
		super({logger: logger});

		this.name = name;
		this.eventEmitter = new EventEmitter();
		this.eventEmitter.setMaxListeners(0);
		this.status = MessageBusStatus.Stopped;
		this.listeners = [];
		this.subscribers = [];
		this.eventEmitter.on('error', (err) => {
			this.logger.error('Whoops! there was an error in the Message Bus : ' + err);
			throw err;
		});
	}
	errorIfNotStarted() {
		if (this.status === MessageBusStatus.Started) return;
		this.logger.error('Message bus not started cannot send or receive messages');
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
		this.eventEmitter.on(this.name, (message) => {
			this.logger.debug('*** ' + JSON.stringify(message));
		});

		this.status = MessageBusStatus.Started;
		this.subscribe(Topics.SYSTEM, {}, (data) => {
			this.handleSystemCommand(data);
		});
		this.eventEmitter.on(this.name, (data) => {
			this.subscribers.forEach((e) => {
				if((e.topic === data.topic) && (this.filter(e.filter,data))) {
					e.callback(data);
				}
			});
		});
		this.eventEmitter.on(this.name, (data) => {
			this.listeners.forEach((e,idx) => {
				if((e.topic === data.topic) && (this.filter(e.filter,data))) {
					this.listeners.splice(idx,1);
					e.callback(data);
				}
			});
		});
		this.logger.info(this.name + ': Message Bus Started');
	}
	stop() {
		this.eventEmitter.removeAllListeners();
		this.subscribers = [];
		this.listeners  = [];
		this.status = MessageBusStatus.Stopped;
		this.logger.info(this.name + ': Message Bus Stopped');
	}
	sendMessage(message) {
		this.errorIfNotStarted();
		this.logger.debug('MESSAGE BUS : sendMessage ' + message);
		this.eventEmitter.emit(this.name, message);
		return message.id;
	}
	subscribe(topic, f, callback) {
		this.errorIfNotStarted();
		
		this.subscribers.push({topic: topic, filter: f, callback: callback});
	}
	filter(f,data) {
		const keys = Object.keys(f);
		return (keys.every((e) => data[e] === f[e]));
	}
	receiveMessageFilter(topic, f, callback) {
		this.errorIfNotStarted();
		
		this.logger.debug('MESSAGE BUS : receiveMessageFilter topic ' + topic + ' filter ' + JSON.stringify(f) + ' Calling callback');
		
		this.listeners.push({topic: topic, filter: f, callback: callback});
		
	}
}