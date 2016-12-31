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
	it('Should handle connect', (done) => {
		Mocks.messageBus.sendMessage.reset();
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: {connected: true} });
		//Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({payload: 'OK'});

		sut.handle({ command: 'CONNECT', args: ['12345'] }, (response) => {
			assert.equal(response, 'OK');
			assert(Mocks.messageBus.sendAndReceiveMessage.calledTwice);
			done();
		});
	});
	it('Should handle not registered', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: undefined });
		sut.handle({ id: '1234', command: 'CONNECT', args: ['12345yy'] }, (response) => {
			assert.equal(response, 'NOT REGISTERED');
			assert(Mocks.messageBus.sendAndReceiveMessage.calledOnce);
			done();
		});
	});
	it('Should handle error when try to update connection session', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ error: 'ERROR',payload: null });
		sut.registerConnection('12345', (response) => {
			assert.equal(response, 'ERROR');
			assert(Mocks.messageBus.sendAndReceiveMessage.calledOnce);
			done();
		});
	});
	it('Should get session', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: {connected: true} });
		sut.getSession('12345', (response) => {
			assert.isTrue(response.connected);
			done();
		});

	});
	it('Should handle get SSID', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: {connected:true,ssid: 'mysecret',dongleId: '54321', id:'54321',vin: '12345'} });
		sut.ssid({ command: 'SSID', id: '54321' }, (response) => {
			assert.equal(response, 'SSID mysecret');
			done();
		});
	});
	it('Should stop', (done) => {

		sut.stop(() => {
			assert.equal(sut.status, ServiceStatus.Stopped);
			done();
		});
	});
});