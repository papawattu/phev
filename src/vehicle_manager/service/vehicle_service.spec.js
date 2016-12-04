import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import VehicleService from './vehicle_service';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../../common/message_bus';
import { logger } from '../../common/logger';
import { Vehicle, Vehicle2, Vehicle3 } from '../../common/data/data';
import { Topics } from '../../common/message_bus/topics';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = new MessageBus({ logger });
messageBus.start();
const sut = new VehicleService({ logger: logger, messageBus: messageBus });

chai.use(chaiAsPromised);

describe.skip('Vehicle service register', () => {

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

describe.skip('Vehicle service get vin', () => {
	it('Should get vehicle from VIN', () => {
		return assert.deepEqual(sut.getVehicle(Vehicle.vehicle.vin), Vehicle);
	});
	it('Should not get vehicle for non registered VIN', () => {
		return assert.isUndefined(sut.getVehicle('123456'), 'Expected return value to be undefined is ' + sut.getVehicle('123456'));
	});
});
describe('Vehicle message bus', () => {
	beforeEach(()=> {
		sut.start();
	});
	afterEach(() => {
		sut.stop();
	});
	it('Should handle GET command', (done) => {
		const message = new Message({ topic: Topics.VEHICLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Get, payload: Vehicle.vehicle.vin, correlation: true });
		sut.addVehicle(Vehicle);
		
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { correlationId: message.correlationId, type: MessageTypes.Response }, (data) => {
			assert.deepEqual(data.payload, Vehicle,`Expected ${data.payload} to be ${JSON.stringify(Vehicle)}`);
			done();
		});
		messageBus.sendMessage(message);
	});
	it('Should handle ADD command', (done) => {
		const addMessage = new Message({ topic: Topics.VEHICLE_TOPIC, type: MessageTypes.Request, command: MessageCommands.Add, payload: Vehicle3, correlation: true });
		messageBus.receiveMessageFilter(Topics.VEHICLE_TOPIC, { correlationId: addMessage.correlationId, type: MessageTypes.Response }, (data) => {
			assert.isNull(data.error);
			done();
		});
		messageBus.sendMessage(addMessage);
	});
});