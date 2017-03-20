//TODO: this needs to be refactored as its more of an integration test with message bus
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Lights from './lights';
import { Topics } from '../common/message_bus/topics';

const assert = chai.use(chaiAsPromised).assert;
const messageBus = {};

const sut = new Lights({ messageBus: messageBus });

chai.use(chaiAsPromised);

describe('Registration', () => {

	before(() => {
	});
	after(() => {
	});
	it('Should switch on lights', () => {
		return assert.isFulfilled(sut.lights({status : 'on'}));
	});
	it('Should not allow invalid payload', () => {
		return assert.isRejected(sut.lights({ 123: 123 }));
	});
});