'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MessageBus,Message,MessageTypes} from './message_bus';

const assert = chai.assert;
chai.use(chaiAsPromised);

const messageBus = new MessageBus('test');

describe('Messages', () => {

	it('Should assign msg with correlation id as a string', () => {
		const message = new Message({ topic :'topic', payload: 'Hello',correlation: true});
		assert.isString(message.correlationId);
	});
	it('Should not assign msg with correlation id', () => {
		const message = new Message({ topic :'topic', payload: 'Hello',correlation: false});
		assert.isNull(message.correlationId);
	});
	it('Should default correlation to false', () => {
		const message = new Message({ topic :'topic', payload: 'Hello'});
		assert.isNull(message.correlationId);
	});
	it('Should have an id as a string', () => {
		const message = new Message({ topic :'topic', payload: 'Hello'});
		assert.isString(message.id);
	});
	it('Should create a reply message', () => {
		const message = new Message({ topic :'topic', payload: 'Hello',correlation: true});
		const replyMessage = Message.replyTo(message);

		assert.equal(replyMessage.correlationId,message.correlationId);
		assert.equal(replyMessage.topic,message.topic);
		assert.equal(replyMessage.command,message.command);
		assert.equal(replyMessage.type,MessageTypes.RESPONSE);
		assert.isUndefined(replyMessage.payload);
	});
});

describe('Message bus', () => {	
	beforeEach(()=>{
		messageBus.start();
	});
	afterEach(() => {
		messageBus.stop();
	});
	it('Should have "test" as event name', () => {
		assert.equal(messageBus.name,'test');
	});
	it('Should send and receive message', (done) => {
		const message = new Message({ topic :'topic',payload: 'Hello'});
		messageBus.receiveMessages('topic',(data) => {
			assert.equal(data.payload,'Hello');
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should send and receive message id', (done) => {
		const message = new Message({ topic :'topic',payload: 'Hello'});
		let id = message.id;
		messageBus.receiveMessages('topic',(data) => {
			assert.equal(data.id,id);
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should send and receive more than one message', (done) => {
		const message = new Message({ topic :'topic',payload: 'Hello'});
		const message2 = new Message({ topic :'topic',payload: 'Hello again'});
		let num = 0;
		messageBus.receiveMessages('topic',(data) => {
			
			if(num == 0) {
				assert(data.payload === 'Hello' || data.payload === 'Hello again');
				num++;
			}
			else {
				assert(data.payload === 'Hello' || data.payload === 'Hello again');
				done();
			}
		});
		messageBus.sendMessage(message);
		messageBus.sendMessage(message2);
	});
	it('Should send and not receive message when different topic', (done) => {
		const message = new Message({ topic :'newtopic',payload: 'Hello'});
		messageBus.receiveMessages('topic',(data) => {
			assert.fail(null,null,'Should not get this message : ' + data);
		});
		messageBus.sendMessage(message);
		process.nextTick(()=>{
			done();
		});
	});
	it('Should send message and return id', () => {
		const message = new Message({ topic :'topic',payload: 'Hello'});
		const id = messageBus.sendMessage(message);
		assert.isString(id,'Should be a string is ' + id);
	});
	it('Should receive messages with filter', (done) => {
		const message = new Message({ topic :'topic',payload: 'Hello',correlation:true});
		const message2 = new Message({ topic :'topic',payload: 'Hello2',correlation:true});
		
		messageBus.receiveMessagesFilter('topic',{correlationId: message2.correlationId}, (data) => {
			assert.deepEqual(data,message2,'Should get Hello2 message but got this message : ' + data);
			done();
		});
		
		messageBus.sendMessage(message);
		messageBus.sendMessage(message2);
		
	});
	it('Should not receive messages with filter', (done) => {
		const message = new Message({ topic :'topic',payload: 'Hello',correlation:true});
		const message2 = new Message({ topic :'topic',payload: 'Hello2',correlation:true});
		
		messageBus.receiveMessagesFilter('topic',{correlationId: message2.correlationId}, (data) => {
			assert.false(null,null,'Should not get message but got this message : ' + data);
			
		});
		
		messageBus.sendMessage(message);
		process.nextTick(()=>{
			done();
		});
	});
	it('Should receive messages with type filter', (done) => {
		const message = new Message({ topic :'topic',type: 'ERROR',payload: 'Hello'});
		
		messageBus.receiveMessagesFilter('topic',{type: 'ERROR'}, (data) => {
			assert.deepEqual(data,message,'Should get error type message but got this message : ' + data);
			done();
		});
		
		messageBus.sendMessage(message);
	});
	it('Should receive messages with multi filter', (done) => {
		const message = new Message({ topic :'topic',command: 'NOOP', type: MessageTypes.ERROR,payload: 'Hello'});
		
		messageBus.receiveMessagesFilter('topic',{type: MessageTypes.ERROR,command: 'NOOP'}, (data) => {
			assert.deepEqual(data,message,'Should get error type message but got this message : ' + data);
			done();
		});
		
		messageBus.sendMessage(message);
	});
	it('Should not receive messages with multi filter', (done) => {
		const message = new Message({ topic :'topic',payload: 'Hello',correlation:true});
		
		messageBus.receiveMessagesFilter('topic',{command: 'NOOP',type: 'TYPE'}, (data) => {
			assert.fail(null,null,'Should not get message but got this message : ' + data);
		});
		
		messageBus.sendMessage(message);
		process.nextTick(()=>{
			done();
		});
	});
});