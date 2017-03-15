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
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true } });
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
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ error: 'ERROR', payload: null });
		sut.registerConnection('12345', (response) => {
			assert.equal(response, 'ERROR');
			assert(Mocks.messageBus.sendAndReceiveMessage.calledOnce);
			done();
		});
	});
	it('Should get session', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true } });
		sut.getSession('12345', (response) => {
			assert.isTrue(response.connected);
			done();
		});

	});
	it('Should set session', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { id: '12345' } });
		sut.setSession({id:'12345'}, (response) => {
			assert.equal(response.id,'12345');
			done();
		});

	});
	it('Should handle get SSID', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true, ssid: 'mysecret', dongleId: '54321', id: '54321', vin: '12345' } });
		sut.ssid({ command: 'SSID', id: '54321' }, (response) => {
			assert.equal(response, 'SSID mysecret');
			done();
		});
	});
	it('Should handle get Password', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true, password: 'mysecret', dongleId: '54321', id: '54321', vin: '12345' } });
		sut.password({ command: 'PASSWORD', id: '54321' }, (response) => {
			assert.equal(response, 'PASSWORD mysecret');
			done();
		});
	});
	it('Should handle Wifi on', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true, password: 'mysecret', dongleId: '54321', id: '54321', vin: '12345',wifiConnected: true } });
		sut.wifi({ command: 'WIFION', id: '54321' }, (response) => {
			assert.equal(response, 'OK');
			done();
		});
	});
	it('Should handle host', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true, password: 'mysecret', dongleId: '54321', id: '54321', vin: '12345',wifiConnected: true } });
		sut.host({ command: 'HOST', id: '54321' }, (response) => {
			assert.equal(response, 'HOST 192.168.6.46 8080');
			done();
		});
	});
	it('Should handle ready', (done) => {
		Mocks.messageBus.sendAndReceiveMessage = sinon.stub().yields({ payload: { connected: true, password: 'mysecret', dongleId: '54321', id: '54321', vin: '12345',wifiConnected: true } });
		sut.ready({ command: 'READY', id: '54321' }, (response) => {
			assert.equal(response, 'OK');
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