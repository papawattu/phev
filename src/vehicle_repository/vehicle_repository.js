import * as Joi from 'joi';

import { Topics } from '../common/message_bus/topics';
import { MessageTypes, MessageCommands } from '../common/message_bus';
import Store from '../common/store/new_store_sync';
import { VehicleSchema } from '../common/data/schema';
import HttpService from '../common/http_service';

export default class VehicleRepository extends HttpService {
	constructor({messageBus, port, store = new Store() }) {
		super({ messageBus, port, name: 'Vehicle Repository' });

		this.store = store;
	}
	start(done) {
		super.start(() => {
			this.registerMessageHandler(Topics.VEHICLE_TOPIC, null, { type: MessageTypes.Request },
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
			done();
		});
	}
	stop(done) {
		super.stop(done);
	}
	getVehicle(vin) {
		this.logger.debug('Call to get vehicle vin ' + vin);
		return this.store.get(vin);
	}
	getVehicles(filter) {
		this.logger.debug('Call to get vehicles');
		return this.store.getFilter(filter);
	}
	addVehicle(vehicle) {
		this.logger.debug('Call to register vehicle ' + JSON.stringify(vehicle));
		if (this.store.has(vehicle.vin)) {
			this.logger.error('VIN already exists ' + vehicle.vin);
			throw new Error('VIN already registered ' + vehicle.vin);
		}
		this.store.set(vehicle.vin, vehicle);
		return;

	}
}