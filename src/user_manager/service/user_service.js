import { Topics } from '../../common/message_bus/topics';
import { MessageTypes,MessageCommands } from '../../common/message_bus';
import Store from '../../common/store/new_store_sync';
import { UserSchema } from '../../common/data/schema';
import HttpService from '../../common/http_service';
import * as Joi from 'joi';

export default class UserService extends HttpService {
	constructor({logger, messageBus, store = new Store()}) {
		super({logger,messageBus});
		
		this.store = store;
	}
	start() {
		super.start();
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
		this.registerHttpHandler('user_manager',{
			get: {
				method: (request,reply) => {
					const user = this.getUser(request.params.username);
					if(user) {
						reply(user).code(200);
					} else { 
						reply({status: 'User not found'}).code(404);	 
					}
				},
				path: '/users/{username}',
			},
			post: {
				method: (request,reply) => {
					try {
						this.addUser(request.payload);
						reply({}).created('/users/' + request.payload.user.username);
					} catch(err) {
						reply({err}).code(400);
					}
				},
				path: '/users',
				schema: null,
			}
		});
	}
	stop() {
		super.stop();
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
		this.logger.debug('Call to add new user ' + user.username + ' ' + JSON.stringify(user));
		Joi.validate(user.user,UserSchema,(err,value) => {
			if(err) {
				this.logger.error('Add user validation error ' + err + ' value ' + value);
				throw err;
			}
			if(this.store.has(user.user.username)) {
				throw new Error('User already exists ' + user.user.username);
			} 
			this.store.set(user.user.username, user);
			return;
		});
	}
}