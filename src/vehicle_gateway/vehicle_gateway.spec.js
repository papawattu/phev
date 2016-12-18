import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import { ServiceStatus } from '../common/base_service';
import { Mocks } from '../common/test/mocks';
import VehicleGateway from './vehicle_gateway';

const messageBus = Mocks.messageBus;
const assert = chai.use(chaiAsPromised).assert;
const sut = new VehicleGateway({ name: 'default', messageBus });

/*Mocks = {};
Mocks.httpService = {};
Mocks.httpService.start = sinon.stub().yields();
Mocks.httpService.stop = sinon.stub().yields();
*/
describe('Vehicle Gateway', () => {
	it('Should start', (done) => {
		sut.server = {} ;
		sut.server.on = sinon.stub().yields();
		sut.server.listen = sinon.stub().yields();
		sut.server.close = sinon.stub().yields();
		
		sut.start(() => {
			assert.equal(sut.status, ServiceStatus.Started);
			assert(sut.server.listen.calledOnce,'server listen should be callled once');
			assert(sut.server.on.calledOnce);
			done();
		});
	});
	it('Should start', (done) => {
		done();
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