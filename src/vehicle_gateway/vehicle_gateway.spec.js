import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import { ServiceStatus } from '../common/base_service';
import { Mocks } from '../common/test/mocks';
import VehicleGateway from './vehicle_gateway';

const messageBus = Mocks.messageBus;
const store = Mocks.store;
const assert = chai.use(chaiAsPromised).assert;
const sut = new VehicleGateway({ name: 'default', messageBus, store: store });

/*Mocks = {};
Mocks.httpService = {};
Mocks.httpService.start = sinon.stub().yields();
Mocks.httpService.stop = sinon.stub().yields();
*/

const socket = {};
socket.on = sinon.stub();
socket.write = sinon.stub();
		
describe('Vehicle Gateway', () => {
	it('Should start', (done) => {
		sut.server = {} ;
		sut.server.on = sinon.stub().yields();
		sut.server.listen = sinon.stub().yields();
		sut.server.close = sinon.stub().yields();
		
		sut.start(() => {
			assert.equal(sut.status, ServiceStatus.Started);
			done();
		});
	});
	it('Should accept connections', () => {
		assert(sut.server.listen.calledOnce,'server listen should be callled once');
	});
	it('Should receive data', () => {
		assert(sut.server.on.calledOnce);
	});
	it('Should create new session', () => {
		sut.handleNewConnection(socket);
		assert(sut.store.set.calledOnce);
	});
	it('Should write HELLO PHEV', () => {
		assert(socket.write.calledOnce);
		assert(socket.write.calledWith('HELLO PHEV\r\n'));
	});
	it('Should send message', (done)=> {
		sut.handle({},() => {	

			done();	
		});
		assert(messageBus.sendMessage.calledOnce);
		assert(messageBus.receiveMessageFilter.calledOnce);
	});
	it('Should get session', ()=> {
		Mocks.store.get.returns({});
		assert.deepEqual(sut.getSession('1234'),{});
	});
	it('Should validate session', ()=> {
		Mocks.store.get.returns({connected: false, id: 'abcdef'});
		sut.validateSession({sessionId: 'abcdef',dongleId: '12345'});
		assert.deepEqual(sut.getSession('abcdef'),{id: 'abcdef',connected: true,dongleId: '12345'});
	});
	it('Should stop', (done) => {
		sut.server = {} ;
		sut.server.close = sinon.stub().yields();
		
		sut.stop(() => {
			assert.equal(sut.status, ServiceStatus.Stopped);
			assert(sut.server.close.calledOnce);
			
			done();
		});
	});
});