import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ServiceStatus } from '../common/base_service';
import { Mocks } from '../common/test/mocks';
import VehicleGateway from './vehicle_gateway';

const messageBus = Mocks.messageBus;
const assert = chai.use(chaiAsPromised).assert;
const sut = new VehicleGateway({ name: 'default',messageBus });

describe('Vehicle Gateway', () => {
	it('Should start', (done) => {
		sut.start(() => {
			assert.equal(sut.status, ServiceStatus.Started);
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