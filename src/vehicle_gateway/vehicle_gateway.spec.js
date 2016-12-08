import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { logger } from '../common/logger';
import { MessageBus, Message, MessageTypes, MessageCommands } from '../common/message_bus/message_bus';
import { register, register2 } from '../common/data/data';
import { Topics } from '../common/message_bus/topics';
import {Mocks} from '../common/test/mocks';

import VehicleGateway from './vehicle_gateway';

describe('Vehicle Gateway',()=> {
    beforeEach(() => {
        console.log('*** ' +logger);
    });
    it('Should starts', (done)=> {
        const sut = new VehicleGateway({logger: logger, messageBus: Mocks.messageBus});

        sut.start(()=> {
            assert.equal(sut.status, ServiceStatus.Started);
            done();
        });
    });
});