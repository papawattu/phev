'use strict';

import { logger } from '../../../common/logger';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
import RegistrationService from './service';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../../../common/message_bus/message_bus';
import { register, register2,register3 } from '../../../common/data/data';
import { Topics } from '../../../common/message_bus/topics';

const messageBus = new MessageBus({ logger: logger });
const sut = new RegistrationService({ logger: logger, messageBus: messageBus });

chai.use(chaiAsPromised);

describe('Registration service', () => {

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
		const p = sut.registration(register);
		return assert.eventually.equal(p,'Username already registered',` ${p}`);
	});
	it('Should not allow same VIN to be registered twice', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			const message = Message.replyTo(data);
			message.error = { code: 500, description: 'Vehicle already registered' };
			messageBus.sendMessage(message);
		});
		messageBus.receiveMessageFilter(Topics.DONGLE_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		return assert.eventually.deepEqual(sut.registration(register3),{ code: 500, description: 'Vehicle already registered' });
	});
	it('Should not allow invalid payload', () => {
		return assert.eventually.propertyVal(sut.registration({ 123: 123 }), 'isJoi', true);
	});
});