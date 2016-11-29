import EventEmitter from 'events';
import uuid from 'uuid';
//import eventToPromise from 'event-to-promise';
import logger from '../logging';

class Message {
	constructor({topic='DEFAULT',type='DEFAULT',payload,correlation = false} = {}) {
		this.topic = topic;
		this.type = type;
		this.payload = payload;
		this.id = uuid();
		this.correlationId = (correlation?uuid():null);
	}
	toString() {
		return JSON.stringify(this);
	}
}
class MessageBus extends EventEmitter {
	constructor(name = 'default') {
		super();
		super.on('error', (err) => {
			logger.error('whoops! there was an error' + err);
		});
    
		this.name = name;

	}
	start() {
		super.on(this.name, () => {

		});
	}
	stop() {
		this.removeAllListeners();
	}
	sendMessage(message) {
		super.emit(this.name, message);
		return uuid();
	}   
	receiveMessage(topic,callback) {
		super.on(this.name,(data) => {
			if(data.topic === topic) callback(data);
		});
	}
	receiveMessageWithUUID(topic,id,callback) {
		super.on(this.name,(data) => {
			if(data.topic === topic && data.id === id) callback(data);
		});
	}
}

export { MessageBus, Message };