import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import VehicleService from './vehicle_service';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../../common/message_bus';
import { logger } from '../../common/logger';
import { Topics } from '../../common/message_bus/topics';
import { Vehicle,Vehicle2 } from '../../common/data/data';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = new MessageBus();
messageBus.start();
const sut = new VehicleService({ logger: logger, messageBus: messageBus });

chai.use(chaiAsPromised);

describe('Vehicle service register', () => {

	it('Should register VIN', () => {
		sut.addVehicle(Vehicle);
		assert.deepEqual(sut.getVehicle(Vehicle.vehicle.vin), Vehicle, `Expected to get : ${Vehicle} got ${sut.getVehicle(Vehicle.vehicle.vin)}`);
	});
	it('Should register more than 1 VIN', () => {
		sut.addVehicle(Vehicle2);
		assert.deepEqual(sut.getVehicle(Vehicle2.vehicle.vin), Vehicle2, `Expected to get : ${Vehicle2} got ${sut.getVehicle(Vehicle2.vehicle.vin)}`);
	});
	it('Should not allow same VIN to be registered twice', () => {
		return assert.throws((() => { sut.addVehicle(Vehicle); }), 'VIN already registered');
	});
});

describe('Vehicle service get vin', () => {
	it('Should get vehicle from VIN', () => {
		return assert.deepEqual(sut.getVehicle(Vehicle.vehicle.vin), Vehicle);
	});
	it('Should not get vehicle for non registered VIN', () => {
		return assert.isUndefined(sut.getVehicle('123456'), 'Expected reyurn value t be undefined is ' + sut.getVehicle('123456'));
	});
	it.skip('Should get all vehicles', () => {
		return assert.becomes(sut.getVehicles(), { '123456789': { vin: '123456789' }, '123456789abcdef': { vin: '123456789abcdef' } });
	});
	it.skip('Should get vehicles by device Id', () => {
		return assert.becomes(sut.getVehicleByDeviceId('1234'), { '123456789': { vin: '123456789' }, '123456789abcdef': { vin: '123456789abcdef' } });
	});
});
