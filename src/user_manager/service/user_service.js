'use strict';
import 'babel-polyfill';
import { Logger } from 'winston';
import { Message } from '../../common/message_bus';
import { Store } from '../../common/store/new_store_sync';


const logger = new Logger();

class UserService {
	constructor({messageBus} = {}) {

		this.commands = [{
			name: 'GET',
			numArgs: 1,
			handle: this.getUser,
		}];
		this.messageBus = messageBus;
		this.store = new Store();

		messageBus.receiveMessagesFilter('user', {type: 'REQUEST'},(message) => {
			const replyMessage = Message.replyTo(message);
			replyMessage.payload = 
				this._findCommand(message.command)
					.handle.call(this,message.payload);
			messageBus.sendMessage(replyMessage);
		});
	}
	_findCommand(cmd) {
		return this.commands.find(e => e.name === cmd);
	}
	_isValidCommand(cmd) {
		return (this._findCommand(cmd) != undefined);
	}
	_handleCommand(cmd, data) {
		//if (!this._isValidCommand(cmd)) throw new Error('Invalid command on bus ' + cmd);
		return this._findCommand(cmd).handle(cmd, data);
	}
	getUser(userId) {
		logger.debug('Call to get user userId ' + userId);
		return (this.store.get(userId) != undefined?this.store.get(userId).value:undefined);
	}
	getUsers() {
		logger.debug('Call to get users userId ');
		return this.store.getAll();
	}
	addUser(user) {
		logger.debug('Call to register user ' + user);
		if(this.store.has(user.userId)) throw new Error('User already exists ' + user.userId);
		this.store.set(user.userId, user);
	}
}

export { UserService };