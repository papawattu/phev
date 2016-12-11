import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import App from './app';
import { Mocks } from './common/test/mocks';

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
			vehicleGateway: mocks.vehicleGateway,
			
		});

		assert(mocks.messageBus.start.calledOnce, 'Should start message bus');
		assert(mocks.operations.start.calledOnce, 'Should start operations');
		assert(mocks.vehicleRepository.start.calledOnce, 'Should start vehicle repository');
		assert(mocks.userRepository.start.calledOnce, 'Should start user repository');
		assert(mocks.dongleRepository.start.calledOnce, 'Should start dongle repository');
		assert(mocks.vehicleRepository.start.calledOnce, 'Should start vehicle gateway');
	});
	it('Should have status started on successful startup ', (done) => {
		const app = new App({
			messageBus: mocks.messageBus,
			operations: mocks.operations,
			userRepository: mocks.userRepository,
			vehicleRepository: mocks.vehicleRepository,
			dongleRepository: mocks.dongleRepository,
			vehicleGateway: mocks.vehicleGateway,
		});
		
		setTimeout(()=> {
			assert.equal(app.status,'STARTED');
			done();
		},100);
	});

	it('Should have failed status if one ore more services fail at startup ', (done) => {
		mocks.userRepository.start = sinon.stub().throws();
		const app = new App({
			messageBus: mocks.messageBus,
			operations: mocks.operations,
			userRepository: mocks.userRepository,
			vehicleRepository: mocks.vehicleRepository,
			dongleRepository: mocks.dongleRepository,
			vehicleGateway: mocks.vehicleGateway,
		});
		
		setTimeout(()=> {
			assert.equal(app.status,'FAILED');
			done();
		},10);
		
	});
	it('Should stop services', (done) => {
		const app = new App({
			messageBus: mocks.messageBus,
			operations: mocks.operations,
			userRepository: mocks.userRepository,
			vehicleRepository: mocks.vehicleRepository,
			dongleRepository: mocks.dongleRepository,
			vehicleGateway: mocks.vehicleGateway,
		});

		app.stop(() => {
			assert(mocks.messageBus.stop.calledOnce, 'Message bus stop should be called');
			assert(mocks.operations.stop.calledOnce, 'Operations stop should be called');
			assert(mocks.userRepository.stop.calledOnce, 'Operations stop should be called');
			assert(mocks.vehicleRepository.stop.calledOnce, 'Operations stop should be called');
			assert(mocks.dongleRepository.stop.calledOnce, 'Dongle stop should be called');
			assert(mocks.vehicleGateway.stop.calledOnce, 'Vehicle gateway stop should be called');

			done();
		});
	});
});