import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import App from './app';
import {Mocks} from './common/test/mocks';

const assert = chai.use(chaiAsPromised).assert;

const mocks = Mocks;

describe('App Bootstrap', () => {
	before(() => {

	});
	it('Should start services at construction', () => {
		new App({
			messageBus: mocks.messageBus,
			operationsManager: mocks.operationsManager,
			vehicleManager: mocks.vehicleManager
		});

		assert(mocks.messageBus.start.calledOnce, 'Should start message bus');
		assert(mocks.operationsManager.start.calledOnce, 'Should start operations manager');
		assert(mocks.vehicleManager.start.calledOnce, 'Should start vehicle manager');
	});
	it('Should stop services', () => {
		const app = new App({
			messageBus: mocks.messageBus,
			operationsManager: mocks.operationsManager,
			vehicleManager: mocks.vehicleManager
		});

		app.stop(60 * 1000, () => {});
		assert(mocks.messageBus.stop.calledOnce,'Message bus stop should be called');
		assert(mocks.vehicleManager.stop.calledOnce,'Vehicle Manager stop should be called');
		assert(mocks.operationsManager.stop.calledOnce,'Operations Manager stop should be called');

	});
	it('Should return service status should return array', () => {
		const app = new App({
			messageBus: mocks.messageBus,
			operationsManager: mocks.operationsManager,
			vehicleManager: mocks.vehicleManager
		});

		const statuses = app.status();
		assert.isArray(statuses);
	});
});