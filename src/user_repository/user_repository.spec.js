import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import UserRepository from './user_repository';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../common/message_bus';
import { logger } from '../common/logger';
import { Topics } from '../common/message_bus/topics';
import { User1, User3 } from '../common/data/data';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = new MessageBus({logger});
messageBus.start();
const sut = new UserRepository({ logger: logger, messageBus: messageBus,port: 3036 });

chai.use(chaiAsPromised);

describe('User Service', () => {
	it('Should add user', () => {
		sut.addUser(User1);
		assert.deepEqual(sut.getUser(User1.username), User1, `Expected to get : ${JSON.stringify(User1)} got ${JSON.stringify(sut.getUser(User1.username))}`);
	});
	it('Should not add user with existing username', () => {
		return assert.throws((() => { sut.addUser(User1); }), `Username already exists : ${User1.username}`);
	});
});

describe('User service get user Id', () => {
	before(()=>{
		messageBus.start();
	});	
	it('Should get user from User Id', () => {
		return assert.deepEqual(sut.getUser(User1.username), User1);
	});
	it('Should not get user for non registered User Id', () => {
		return assert.isUndefined(sut.getUser('nonuser'));
	});
});
describe('User service message bus', () => {
	before((done) => {
		messageBus.start();
		sut.start(done);
	});
	after((done) => {
		messageBus.stop();
		sut.stop(done);
	});
	it('Should handle GET command', (done) => {
		const message = new Message({ topic: Topics.USER_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: User1.username, correlation: true });

		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
			assert.deepEqual(data.payload, User1);
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should handle ADD command', (done) => {
		const addMessage = new Message({ topic: Topics.USER_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: User3, correlation: true });
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { correlationId: addMessage.correlationId, type: MessageTypes.Response }, (data) => {
			assert.isNull(data.error);
			done();
		});
		messageBus.sendMessage(addMessage);
	});
});