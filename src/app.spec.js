import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import App from './app';
import {Mocks} from './common/test/mocks';

const assert = chai.use(chaiAsPromised).assert;

const mocks = Mocks;

describe('App Bootstrap', () => {
	it('Should start services at construction', () => {
		new App({
			messageBus: mocks.messageBus,
			operations: mocks.operations,
			userRepository: mocks.userRepository,
			vehicleRepository: mocks.vehicleRepository,
			dongleRepository: mocks.dongleRepository,
		});

		assert(mocks.messageBus.start.calledOnce, 'Should start message bus');
		assert(mocks.operations.start.calledOnce, 'Should start operations');
		assert(mocks.vehicleRepository.start.calledOnce, 'Should start vehicle repository');
		assert(mocks.userRepository.start.calledOnce, 'Should start user repository');
		assert(mocks.dongleRepository.start.calledOnce, 'Should start dongle repository');
	});
	it('Should stop services', () => {
		const app = new App({
			messageBus: mocks.messageBus,
			operations: mocks.operations,
			userRespository: mocks.userRespository,
			vehicleRepository: mocks.vehicleRepository,
			dongleRepository: mocks.dongleRepository,
		});

		app.stop(() => {
			assert(mocks.messageBus.stop.calledOnce,'Message bus stop should be called');
			assert(mocks.operations.stop.calledOnce,'Operations stop should be called');
		});
	});
	it('Should return service status should return array', () => {
		const app = new App({
			messageBus: mocks.messageBus,
			operations: mocks.operations,
			userRespository: mocks.userRespository,
			vehicleRepository: mocks.vehicleRepository,
			dongleRepository: mocks.dongleRepository,
		});

		const statuses = app.status();
		assert.isArray(statuses);
	});
});