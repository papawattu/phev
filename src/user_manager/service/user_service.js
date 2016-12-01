'use strict';
import { Topics } from '../../common/message_bus/topics';
import { Message,MessageTypes,MessageCommands } from '../../common/message_bus';
import Store from '../../common/store/new_store_sync';
import { UserSchema } from '../../common/data/schema';
import * as Joi from 'joi';

class UserService {
	constructor({logger, messageBus, store = new Store()}) {

		this.logger = logger;
		this.messageBus = messageBus;
		this.store = store;

		this.commands = [{
			name: MessageCommands.Get,
			numArgs: 1,
			handle: this.getUser,
		},{
			name: MessageCommands.Add,
			numArgs: 1,
			handle: this.addUser,
		}];

		messageBus.receiveMessagesFilter(Topics.USER_TOPIC, {type: MessageTypes.Request},(message) => {
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
	getUser(username) {
		this.logger.debug('Call to get user username ' + username);
		return this.store.get(username);
	}
	getUsers() {
		this.logger.debug('Call to get users username ');
		return this.store.getAll();
	}
	addUser(user) {
		this.logger.debug('Call to add new user ' + user);
		if(this.store.has(user.user.username)) throw new Error('User already exists ' + user.user.username);
		return this.store.set(user.user.username, user);
	}
}

export { UserService };