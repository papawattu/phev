import EventEmitter from 'events';
import uuid from 'uuid';
import BaseClass from '../base_class';
import { Topics } from './topics';
import Store from '../store/new_store_sync';

export const MessageTypes = Object.freeze({ Broadcast: 'BROADCAST', Undefined: 'UNDEFINED', Request: 'REQUEST', Response: 'RESPONSE', 'Error': 'ERROR' });
export const MessageCommands = Object.freeze({ NoOperation: 'NOOP', Get: 'GET', Add: 'ADD', Delete: 'DELETE', List: 'LIST', Shutdown: 'SHUTDOWN' });
export const MessageBusStatus = Object.freeze({ Stopped: 'STOPPED', Started: 'STARTED' });

export class Message {
	constructor({topic = Topics.DEFAULT, type = MessageTypes.Request, command = MessageCommands.noOperation, payload = undefined, correlation = false, error = null} = {}) {
		this.createdTimestamp = new Date();
		this.sentTimestamp = null;
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
		return `${this.createdTimestamp.toISOString()}\tTopic ${this.topic}\tType ${this.type}\tCommmand ${this.command}\tPayload ${JSON.stringify(this.payload)}\tError ${JSON.stringify(this.error)}\tid ${this.id}\tcorrelation Id ${this.correlationId}`;
	}
}
export class MessageBus extends BaseClass {
	constructor({ name = 'Message Bus',store = new Store() } = {}) {
		super({ name });

		this.eventEmitter = new EventEmitter();
		this.eventEmitter.setMaxListeners(0);
		this.status = MessageBusStatus.Stopped;
		this.listeners = [];
		this.subscribers = [];
		this.store = store;
		this.eventEmitter.on('error', (err) => {
			this.logger.error('Whoops! there was an error in the Message Bus : ' + err);
			throw err;
		});
	}
	errorIfNotStarted() {
		if (this.status === MessageBusStatus.Started) {
			return;
		} else {
			this.logger.error('Message bus not started cannot send or receive messages');
			throw new Error('Message bus not started cannot send or receive messages');
		}
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
			this.logger.debug(this.name + ' - MESSAGE BUS RECEIVE :\t' + message.toString());
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
			this.listeners.forEach((e,idx) => {
				if((e.topic === data.topic) && (this.filter(e.filter,data))) {
					this.listeners.splice(idx,1);
					e.callback(data);
				}
			});
		});
		this.eventEmitter.on(this.name, (message) => {
			this.store.set(message.createdTimestamp,message);
		});
		this.logger.info('Started Message Bus : ' + this.name);
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
		message.sentTimestamp = new Date();
		this.logger.debug(this.name + ' - MESSAGE BUS SEND    :\t' + message.toString());

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
		
		this.logger.debug('MESSAGE BUS ' + this.name  + ' : receiveMessageFilter topic ' + topic + ' filter ' + JSON.stringify(f) + ' Calling callback');
		
		this.listeners.push({topic: topic, filter: f, callback: callback});
		
	}
	sendAndReceiveMessage({topic,payload,command = MessageCommands.NoOperation}, callback) {
		this.errorIfNotStarted();
		
		this.logger.debug('MESSAGE BUS ' + this.name  + ' : sendAndReceiveMessage topic ' + topic + ' Calling callback');
		
		const message = new Message({ topic :topic,type: MessageTypes.Request,payload: payload,command: command, correlation: true});
		
		this.receiveMessageFilter(topic,{type: MessageTypes.Response,command: command, correlationId: message.correlationId}, (data) => {
			callback(data);
		});
		
		this.sendMessage(message);

	}
}