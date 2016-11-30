'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
import {UserService} from './user_service';
import {MessageBus,Message,MessageTypes} from '../../common/message_bus';
import {logger} from '../../common/logger';
import {Topics} from '../../common/message_bus/topics';
import {User1,User3} from '../../common/data/data';

const messageBus = new MessageBus();
const sut = new UserService({logger: logger,messageBus: messageBus});

messageBus.start();

chai.use(chaiAsPromised);

describe('User Service', () => {

	it('Should add user', () => {
		sut.addUser(User1);
		assert.isDefined(sut.getUser(User1.user.username));
	});
	it('Should not add user with existing username', () => {
		return assert.throws((()=>{sut.addUser(User1);}),'User already exists ');
	});
});

describe('User service get user Id', () => {
	it('Should get user from User Id', () => {
		return assert.deepEqual(sut.getUser(User1.user.username), User1);
	});
	it('Should not get user for non registered User Id', () => {
		return assert.isUndefined(sut.getUser(User3.user.username));
	});
	it('Should get all users', () => {
		return assert.deepEqual(sut.getUsers(),[User1]);
	});
});
describe('User service message bus', () => {
	it('Should handle GET command',(done) => {
		const message = new Message({topic : Topics.USER_TOPIC,type: MessageTypes.REQUEST, command: 'GET', payload : User1.user.username, correlation: true});

		messageBus.receiveMessagesFilter(Topics.USER_TOPIC,{correlationId: message.correlationId,type: MessageTypes.RESPONSE}, (data) => {
			assert.deepEqual(data.payload,User1);
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should handle ADD command',(done) => {
		const addMessage = new Message({topic : Topics.USER_TOPIC,type: MessageTypes.REQUEST, command: 'ADD', payload : User3, correlation: true});
		const getMessage = new Message({topic : Topics.USER_TOPIC,type: MessageTypes.REQUEST, command: 'GET', payload : User3.user.username, correlation: true});

		messageBus.receiveMessagesFilter(Topics.USER_TOPIC,{correlationId: addMessage.correlationId,type: MessageTypes.RESPONSE}, (data) => {
			assert.isUndefined(data.payload);
			messageBus.receiveMessagesFilter(Topics.USER_TOPIC,{correlationId: getMessage.correlationId,type: MessageTypes.RESPONSE}, (data) => {
				assert.deepEqual(data.payload,User3);
				done();
			});
			messageBus.sendMessage(getMessage);
		});
		messageBus.sendMessage(addMessage);
	});
});