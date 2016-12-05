import { Topics } from '../../common/message_bus/topics';
import { MessageTypes,MessageCommands } from '../../common/message_bus';
import Store from '../../common/store/new_store_sync';
import { DongleSchema } from '../../common/data/schema';
import HttpService from '../../common/http_service';
import * as Joi from 'joi';

export default class DongleService extends HttpService {
	constructor({logger, messageBus, port,store = new Store()}) {
		super({logger,messageBus,port});
		this.name = 'Dongle Service';
		this.store = store;
	}
	start() {
		super.start();
		this.registerMessageHandler(Topics.DONGLE_TOPIC, DongleSchema, { type: MessageTypes.Request }, 
			[{
				name: MessageCommands.Get,
				numArgs: 1,
				handle: this.getDongle,
			}, {
				name: MessageCommands.Add,
				numArgs: 1,
				handle: this.addDongle,
			}]);
		this.registerHttpHandler('dongle_manager',{
			get: {
				method: (request,reply) => {
					const dongle = this.getDongle(request.params.id);
					if(dongle) {
						reply(dongle).code(200);
					} else { 
						reply({status: 'Dongle not found'}).code(404);	 
					}
				},
				path: '/dongles/{id}',
			},
			post: {
				method: (request,reply) => {
					try {
						this.addDongle(request.payload);
						reply({}).created('/dongles/' + request.payload.dongle.id);
					} catch(err) {
						reply({err}).code(400);
					}
				},
				path: '/dongles',
				schema: null,
			}
		});
	}
	stop() {
		super.stop();
	}
	getDongle(id) {
		this.logger.debug('Call to get dongle id ' + id);
		return this.store.get(id);
	}
	getDongles(filter) {
		this.logger.debug('Call to get dongles');
		return this.store.getAll(filter);
	}
	addDongle(dongle) {
		this.logger.debug('Call to add new dongle ' + dongle.dongle.id + ' ' + JSON.stringify(dongle));
		Joi.validate(dongle.dongle,DongleSchema,(err,value) => {
			if(err) {
				this.logger.error('Add dongle validation error ' + err + ' value ' + value);
				throw err;
			}
			if(this.store.has(dongle.dongle.id)) {
				this.logger.error('Dongle already exists ' + dongle.dongle.id);
				throw new Error('Dongle already exists ' + dongle.dongle.id);
			} 
			this.store.set(dongle.dongle.id, dongle);
			return;
		});
	}
}