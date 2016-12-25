import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as Joi from 'joi';

import { logger } from './logger';
import BaseService from './base_service';
import { ServiceStatus } from './base_service';
import { Mocks } from './test/mocks';

const assert = chai.use(chaiAsPromised).assert;

const TestSchema = Joi.object().keys({ id: Joi.string().required() });

const baseService = new BaseService({ logger, messageBus: Mocks.messageBus,port:3000 });

describe('Base service', () => {

	it('Should be stopped by default ', () => {
		assert.equal(baseService.status, ServiceStatus.Stopped, `Expected base service status to be stopped was ${baseService.status}`);
	});
	it('Should start base server', (done) => {
		baseService.start(() => {
			assert.equal(baseService.status, ServiceStatus.Started, `Expected base service status to be started was ${baseService.status}`);
			done();
		});
	});
	it.skip('Should register message listener', () => {
		baseService.registerMessageHandler('test', {
			get: {
				method: () => { },
				path: '/test'
			},
			post: {
				method: () => { },
				path: '/test',
				schema: TestSchema,
			}
		});
	});
	it.skip('Should register another message listener', () => {
		baseService.registerMessageHandler('test2', {
			get: {
				method: () => { },
				path: '/test2',
			},
			post: {
				method: () => { },
				path: '/test2',
				schema: TestSchema,
			}
		});
	});
	it('Should stop base server', (done) => {
		baseService.stop(() => {
			assert.equal(baseService.status, ServiceStatus.Stopped, `Expected http service status to be stopped was ${baseService.status}`);
			done();
		});
	});
});