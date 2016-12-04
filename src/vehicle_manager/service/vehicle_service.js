import { Topics } from '../../common/message_bus/topics';
import { MessageTypes, MessageCommands } from '../../common/message_bus';
import Store from '../../common/store/new_store_sync';
import { VehicleSchema } from '../../common/data/schema';
import HttpService from '../../common/http_service';
import * as Joi from 'joi';

export default class VehicleService extends HttpService {
	constructor({logger, messageBus, store = new Store() }) {
		super({ logger, messageBus });

		this.store = store;

	}
	start() {
		super.start();
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
		this.registerHttpHandler('vehicle_manager', {
			get: {
				method: (request, reply) => {
					const vehicle = this.getVehicle(request.params.vin);
					if (vehicle) {
						reply(vehicle).code(200);
					} else {
						reply({ status: 'Vehicle not found' }).code(404);
					}
				},
				path: '/vehicles/{vin}',
			},
			post: {
				method: (request, reply) => {
					try {
						this.addVehicle(request.payload);
						reply({}).created('/vehicles/' + request.payload.vehicle.vin);
					} catch (err) {
						reply({ err }).code(400);
					}
				},
				path: '/vehicles',
				schema: VehicleSchema,
			}
		});
	}
	stop() {
		super.stop();
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
		this.logger.debug('Call to register vehicle ' + JSON.stringify(vehicle));
		Joi.validate(vehicle.vehicle, VehicleSchema, (err, value) => {
			if (err) {
				this.logger.error('Add vehicle validation error ' + err + ' value ' + value);
				throw err;
			}
			if (this.store.has(vehicle.vehicle.vin)) {
				throw new Error('VIN already registered ' + vehicle.vehicle.vin);
			}
			this.store.set(vehicle.vehicle.vin, vehicle);
			return;
		});
	}
}