import { Topics } from '../../common/message_bus/topics';
import { Message, MessageTypes, MessageCommands } from '../../common/message_bus';
import Store from '../../common/store/new_store_sync';
import { VehicleSchema } from '../../common/data/schema';
import BaseService from '../../common/base_service';
import * as Joi from 'joi';

export default class VehicleService extends BaseService {
	constructor({logger, messageBus, store = new Store() }) {
		super({ logger, messageBus });

		this.store = store;

		this.registerMessageHandler(Topics.VEHICLE_TOPIC, VehicleSchema, { type: MessageTypes.Request }, 
			[{
				name: MessageCommands.Get,
				numArgs: 1,
				handle: this.getVehicle,
			}, {
				name: MessageCommands.Add,
				numArgs: 1,
				handle: this.addVehicle,
			}]);
	}
	getVehicle(vin) {
		this.logger.debug('Call to get vehicle vin ' + vin);
		return this.store.get(vin);
	}
	getVehicles(filter) {
		this.logger.debug('Call to get vehicles');
		return this.store.getAll(filter);
	}
	addVehicle(vehicle) {
		this.logger.debug('Call to register vehicle ' + vehicle);
		Joi.validate(vehicle,(err,value) => {
			if(err) {
				this.logger.error('Add vehicle validation error ' + err + ' value ' + value);
				throw err;
			}
		});
		if(this.store.has(vehicle.vehicle.vin)) {
			throw new Error('VIN already registered ' + vehicle.vehicle.vin);
		}
		this.store.set(vehicle.vehicle.vin, vehicle);
		return;
	}
}