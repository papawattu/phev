//TODO: this needs to be refactored as its more of an integration test with message bus
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Registration from './registration';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../common/message_bus/message_bus';
import { register, register2 } from '../common/data/data';
import { Topics } from '../common/message_bus/topics';
//import { Mocks } from '../common/test/mocks';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = new MessageBus();
const sut = new Registration({ messageBus: messageBus });

chai.use(chaiAsPromised);

describe('Registration', () => {

	before(() => {
		messageBus.start();
	});
	after(() => {
		messageBus.stop();
	});
	it('Should register user', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		return assert.isFulfilled(sut.registration(register));
	});
	it('Should register another user', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		return assert.isFulfilled(sut.registration(register2));

	});
	it('Should not allow same username to be registered twice', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			const message = Message.replyTo(data);
			message.error = 'Username already registered';
			messageBus.sendMessage(message);
		});
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		return assert.isRejected(sut.registration(register), 'Username already registered');
	});
	it('Should not allow same VIN to be registered twice', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			const message = Message.replyTo(data);
			message.error = 'Vehicle already registered';
			messageBus.sendMessage(message);
		});
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		return assert.isRejected(sut.registration(register), 'Vehicle already registered');
	});
	it('Should not allow same dongle to be registered twice', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			const message = Message.replyTo(data);
			message.error = 'Dongle already registered';
			messageBus.sendMessage(message);
		});
		return assert.isRejected(sut.registration(register), 'Dongle already registered');
	});
	it('Should not allow invalid payload', () => {
		return assert.isRejected(sut.registration({ 123: 123 }));
	});
});