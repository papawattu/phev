import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ServiceStatus } from '../common/base_service';
//import { Mocks } from '../common/test/mocks';
import VehicleGateway from './vehicle_gateway';

const assert = chai.use(chaiAsPromised).assert;
const sut = new VehicleGateway({ name: 'default' });

describe('Vehicle Gateway', () => {
	it('Should start', (done) => {
		sut.logger.info('Test');
		sut.start(() => {
			assert.equal(sut.status, ServiceStatus.Started);
			done();
		});
	});
});