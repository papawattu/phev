import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import { ServiceStatus } from '../common/base_service';
import { Mocks } from '../common/test/mocks';
import VehicleHander from './vehicle_handler';

const messageBus = Mocks.messageBus;
const assert = chai.use(chaiAsPromised).assert;
const sut = new VehicleHander({ name: 'default', messageBus: messageBus });

describe('Vehicle Handler', () => {
	it('Should start', (done) => {
		sut.start(() => {
			assert.equal(sut.status, ServiceStatus.Started);
			done();
		});
	});
	it('Should handle connect',(done) => {
		Mocks.messageBus.sendMessage.reset();
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({payload: '{}'});
		//Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({payload: 'OK'});
			
		sut.handle({command: 'CONNECT', args: ['12345']},(response) => {
			assert.equal(response,'OK');
			assert(Mocks.messageBus.sendAndReceiveMessage.calledTwice);
			done();
		});
	});
	it('Should handle not registered',(done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({payload: undefined});
		sut.handle({command: 'CONNECT', args: ['12345yy']},(response) => {
			assert.equal(response,'NOT REGISTERED');
			assert(Mocks.messageBus.sendAndReceiveMessage.calledOnce);
			done();
		});
	});
	it.skip('Should handle get SSID',() => {
		assert.equal(sut.handle('SSID'),'ssid');
	});
	it('Should stop', (done) => {
		
		sut.stop(() => {
			assert.equal(sut.status, ServiceStatus.Stopped);
			done();
		});
	});
});