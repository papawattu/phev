'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
import {UserService} from './user_service';
import {MessageBus,Message} from '../../common/message_bus';

const messageBus = new MessageBus();
const sut = new UserService({messageBus : messageBus});

messageBus.start();

chai.use(chaiAsPromised);

describe('User Service', () => {

	it('Should add user', () => {
		sut.addUser({ userId: '123456789' });
		assert.isDefined(sut.getUser('123456789'));
	});
	it('Should not add user with existing username', () => {
		return assert.isUndefined(sut.addUser({ userId: '123456789abcdef' }),'Should throw an error');
	});
});

describe('User store get user Id', () => {
	it('Should get user from User Id', () => {
		return assert.deepEqual(sut.getUser('123456789'), {userId : '123456789'});
	});
	it('Should not get user for non registered User Id', () => {
		return assert.isUndefined(sut.getUser('123456789abc'));
	});
	it('Should get all users', () => {
		return assert.deepEqual(sut.getUsers(),[{userId: '123456789'},{userId: '123456789abcdef'}]);
	});
});
describe('User service message bus', () => {
	it('Should handle GET command',(done) => {
		const message = new Message({topic : 'user',type: 'REQUEST', command: 'GET', payload : '123456789', correlation: true});

		messageBus.receiveMessagesFilter('user',{correlationId: message.correlationId,type: 'REPLY'}, (data) => {
			assert.deepEqual(data.payload,{userId: '123456789'});
			done();
		});
		messageBus.sendMessage(message);
	});
});
