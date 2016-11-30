'use strict';
import { Topics } from '../../common/message_bus/topics';
import { Message,MessageTypes } from '../../common/message_bus';
import { Store } from '../../common/store/new_store_sync';
import { UserSchema } from '../../common/data/schema';
import * as Joi from 'joi';

class UserService {
	constructor({logger, messageBus, store = new Store()}) {

		this.logger = logger;
		this.messageBus = messageBus;
		this.store = store;

		this.commands = [{
			name: 'GET',
			numArgs: 1,
			handle: this.getUser,
		},{
			name: 'ADD',
			numArgs: 1,
			handle: this.addUser,
		}];

		messageBus.receiveMessagesFilter(Topics.USER_TOPIC, {type: MessageTypes.REQUEST},(message) => {
			const replyMessage = Message.replyTo(message);
			Joi.validate(message.payload.user, UserSchema, (err) => {
				if (err) {
					throw err;
				}
			});
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
	getUser(username) {
		this.logger.debug('Call to get user username ' + username);
		return (this.store.get(username) != undefined?this.store.get(username).value:undefined);
	}
	getUsers() {
		this.logger.debug('Call to get users username ');
		return this.store.getAll();
	}
	addUser(user) {
		this.logger.debug('Call to register user ' + user);
		if(this.store.has(user.user.username)) throw new Error('User already exists ' + user.user.username);
		this.store.set(user.user.username, user);
	}
}

export { UserService };