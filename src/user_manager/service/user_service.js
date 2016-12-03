import { Topics } from '../../common/message_bus/topics';
import { Message,MessageTypes,MessageCommands } from '../../common/message_bus';
import Store from '../../common/store/new_store_sync';
import { UserSchema } from '../../common/data/schema';
import BaseService from '../../common/base_service';
import * as Joi from 'joi';

export default class UserService extends BaseService {
	constructor({logger, messageBus, store = new Store()}) {
		super({logger,messageBus});
		
		this.store = store;

		this.registerMessageHandler(Topics.USER_TOPIC, UserSchema, { type: MessageTypes.Request }, 
			[{
				name: MessageCommands.Get,
				numArgs: 1,
				handle: this.getUser,
			}, {
				name: MessageCommands.Add,
				numArgs: 1,
				handle: this.addUser,
			}]);
	}
	getUser(username) {
		this.logger.debug('Call to get user username ' + username);
		return this.store.get(username);
	}
	getUsers(filter) {
		this.logger.debug('Call to get users');
		return this.store.getAll(filter);
	}
	addUser(user) {
		this.logger.debug('Call to add new user ' + user);
		Joi.validate(user,(err,value) => {
			if(err) {
				this.logger.error('Add user validation error ' + err + ' value ' + value);
				throw err;
			}
		});
		if(this.store.has(user.user.username)) {
			throw new Error('User already exists ' + user.user.username);
		} 
		this.store.set(user.user.username, user);
		return;
	}
}