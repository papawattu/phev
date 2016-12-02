'use strict';

import { logger } from '../../../common/logger';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
import RegistrationService from './service';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../../../common/message_bus/message_bus';
import { register, register2 } from '../../../common/data/data';
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
		return assert.isFulfilled(sut.registration(register));
	});
	it('Should register another user', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			messageBus.sendMessage(Message.replyTo(data));
		});
		return assert.isFulfilled(sut.registration(register2));

	});
	it('Should not allow same username to be registered twice', () => {
		messageBus.receiveMessageFilter(Topics.USER_TOPIC, { type: MessageTypes.Request, command: MessageCommands.Add }, (data) => {
			const message = Message.replyTo(data);
			message.error = { code: 500, description: 'An error' };
			messageBus.sendMessage(message);
		});
		return assert.isRejected(sut.createUser({ user: register.user }));
	});
	it('Should not allow invalid payload', () => {
		return assert.eventually.propertyVal(sut.registration({ 123: 123 }), 'isJoi', true);
	});
});