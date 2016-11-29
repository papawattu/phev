import EventEmitter from 'events';
import uuid from 'uuid';
import logger from '../logging';

class Message {
	constructor({topic='DEFAULT',type='REQUEST',command='NOOP',payload,correlation = false} = {}) {
		this.topic = topic;
		this.type = type;
		this.command = command;
		this.payload = payload;
		this.id = uuid();
		this.correlationId = (correlation?uuid():null);
	}
	static replyTo(message) {
		const reply = new Message({topic : message.topic,type: 'REPLY', command: message.command});
		reply.correlationId = message.correlationId;
		return reply;
	}
	toString() {
		return JSON.stringify(this);
	}
}
class MessageBus extends EventEmitter {
	constructor(name = 'default') {
		super();
		this.setMaxListeners(0);
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
	receiveMessages(topic,callback) {
		super.on(this.name,(data) => {
			if(data.topic === topic) callback(data);
		});
	}
	receiveMessageWithUUID(topic,id,callback) {
		super.on(this.name,(data) => {
			if(data.topic === topic && data.id === id) callback(data);
		});
	}
	receiveMessagesFilter(topic,filter,callback) {
		super.on(this.name,(data) => {
			if(data.topic === topic) {
				const keys = Object.keys(filter);	
				if(keys.every((e) => data[e] === filter[e])) callback(data);
			}
		});
	}
}

export { MessageBus, Message };