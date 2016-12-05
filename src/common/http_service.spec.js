import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
//import sinon from 'sinon';
import * as Joi from 'joi';

import { logger } from './logger';
import HttpService from './http_service';
import {ServiceStatus} from './base_service';
import sinon from 'sinon';

const assert = chai.use(chaiAsPromised).assert;

const TestSchema = Joi.object().keys({id: Joi.string().required()});

const mocks = {};

mocks.messageBus = {};
mocks.messageBus.start = sinon.stub();
mocks.messageBus.stop = sinon.stub();
mocks.messageBus.sendMessage = sinon.stub();
mocks.messageBus.subscribe = sinon.stub();
		
const messageBus = mocks.messageBus;
const httpService = new HttpService({logger,messageBus});

describe('Http service', () => {

	before(() => {
		//messageBus.start();
	});
	after(() => {
		//messageBus.stop();
	});
	it('Should be stopped by default ', () => {
		assert.equal(httpService.status,ServiceStatus.Stopped,`Expected http service status to be stopped was ${httpService.status}`);
	});
	it('Should start http server', () => {
		httpService.start();
		assert.equal(httpService.status,ServiceStatus.Started,`Expected http service status to be started was ${httpService.status}`);
	});
	it('Should register http listener', () => {
		httpService.registerHttpHandler('test',{
			get: {
				method: () => {}, 
				path: '/test'
			},
			post: {
				method: () => {},
				path: '/test',
				schema: TestSchema,
			}
		});
	});
	it('Should register another http listener', () => {
		httpService.registerHttpHandler('test2',{
			get: {
				method: () => {}, 
				path: '/test2',
			},
			post: {
				method: () => {},
				path: '/test2',
				schema: TestSchema,
			}
		});
	});
	it('Should stop http server', () => {
		httpService.stop();
		assert.equal(httpService.status,ServiceStatus.Stopped,`Expected http service status to be stopped was ${httpService.status}`);
	});
});