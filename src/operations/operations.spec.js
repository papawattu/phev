import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as Joi from 'joi';

import { logger } from '../common/logger';
import Operations from './operations';
import {ServiceStatus} from '../common/base_service';
import {Mocks} from '../common/test/mocks';


const assert = chai.use(chaiAsPromised).assert;

describe('Operations bootstrap',()=>{
    beforeEach(() => {
        Mocks.httpService.start.reset();
    });
    it('Should start with no operations',(done)=>{
        const sut = new Operations({logger,operations: []});

        sut.start(()=> {
            assert.equal(sut.status,ServiceStatus.Started);
            done();
        });
    });
    it('Should start with one operation',(done)=>{
        const sut = new Operations({logger,operations: [Mocks.httpService]});

        sut.start(()=> {
            assert(Mocks.httpService.start.calledOnce,'Should have called httpService.start');
            done();
        });
    });
    it('Should start with more than one operation',(done)=>{
        const sut = new Operations({logger,operations: [Mocks.httpService,Mocks.httpService]});

        sut.start(()=> {
            assert(Mocks.httpService.start.calledTwice,'Should have called httpService.start twice');
            done();
        });
    });
});
