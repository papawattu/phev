import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import DongleRepository from './dongle_repository';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../common/message_bus';
import { logger } from '../common/logger';
import { Dongle, Dongle2, Dongle3, Dongle4 } from '../common/data/data';
import { Topics } from '../common/message_bus/topics';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = new MessageBus({ logger });
messageBus.start();
const sut = new DongleRepository({ logger: logger, messageBus: messageBus,port: 3035 });

describe('Dongle Repository register', () => {
	it('Should register dongle ID', () => {
		sut.addDongle(Dongle);
		assert.deepEqual(sut.getDongle(Dongle.id),Dongle,'Should be equal to ' + JSON.stringify(Dongle) + ' is ' + JSON.stringify(sut.getDongle(Dongle.id)));
	});
	it('Should register more than one dongle', () => {
		sut.addDongle(Dongle2);
		assert.deepEqual(sut.getDongle(Dongle2.id),Dongle2);
	});
	it('Should not register same dongle twice', () => {
		assert.throws((() => { sut.addDongle(Dongle2); }),'Dongle already exists');
	});
});
describe('Dongle message bus', () => {
	before((done) => {
		sut.start(done);
	});
	after((done) => {
		sut.stop(done);
	});
	it('Should handle GET command', (done) => {
		const message = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: Dongle4.id, correlation: true });
		sut.addDongle(Dongle4);
		
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
			assert.deepEqual(data.payload, Dongle4,`Expected ${data.payload} to be ${JSON.stringify(Dongle2)}`);
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should handle dongle not found ', (done) => {
		const message = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: 'notfound', correlation: true });
		
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
			assert.isUndefined(data.payload,`Expected ${data.payload} to be undefined`);
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should handle ADD command', (done) => {
		const addMessage = new Message({ topic: Topics.DONGLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: Dongle3, correlation: true });
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { correlationId: addMessage.correlationId, type: MessageTypes.Response }, (data) => {
			assert.isNull(data.error);
			done();
		});
		messageBus.sendMessage(addMessage);
	});
});