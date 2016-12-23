import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import VehicleRepository from './vehicle_repository';
import { Message, MessageTypes, MessageCommands } from '../common/message_bus';
import { logger } from '../common/logger';
import { Vehicle, Vehicle2, Vehicle3 } from '../common/data/data';
import { Topics } from '../common/message_bus/topics';
import { Mocks } from '../common/test/mocks';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = Mocks.messageBus;
const sut = new VehicleRepository({ logger: logger, messageBus: messageBus, port: 3034 });

chai.use(chaiAsPromised);

describe('Vehicle repository register', () => {

	it('Should register VIN', () => {
		sut.addVehicle(Vehicle);
		assert.deepEqual(sut.getVehicle(Vehicle.vin), Vehicle, `Expected to get : ${Vehicle} got ${sut.getVehicle(Vehicle.vin)}`);
	});
	it('Should register more than 1 VIN', () => {
		sut.addVehicle(Vehicle2);
		assert.deepEqual(sut.getVehicle(Vehicle2.vin), Vehicle2, `Expected to get : ${Vehicle2} got ${sut.getVehicle(Vehicle2.vin)}`);
	});
	it('Should not allow same VIN to be registered twice', () => {
		return assert.throws((() => { sut.addVehicle(Vehicle); }), 'VIN already registered');
	});
});

describe('Vehicle repository get vin', () => {
	it('Should get vehicle from VIN', () => {
		return assert.deepEqual(sut.getVehicle(Vehicle.vin), Vehicle);
	});
	it('Should not get vehicle for non registered VIN', () => {
		return assert.isUndefined(sut.getVehicle('123456'), 'Expected return value to be undefined is ' + sut.getVehicle('123456'));
	});
});
describe('Vehicle message bus', () => {
	before((done)=> {
		Mocks.messageBus.subscribe.reset();
		sut.start(done);
	});
	after((done) => {
		sut.stop(done);
	});
	it('Should set up message handlers', () => {
		assert(Mocks.messageBus.subscribe.calledOnce,'Should be called once' + Mocks.messageBus.subscribe.callCount);
	});
});