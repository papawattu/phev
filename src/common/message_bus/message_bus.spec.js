'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MessageBus,Message} from './message_bus';

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
		messageBus.receiveMessage('topic',(data) => {
			assert.equal(data.payload,'Hello');
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should send and not receive message when different topic', (done) => {
		const message = new Message({ topic :'newtopic',payload: 'Hello'});
		messageBus.receiveMessage('topic',(data) => {
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
});