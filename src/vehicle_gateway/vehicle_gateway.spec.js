import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';


import { Mocks } from '../common/test/mocks';
import  VehicleGateway from './vehicle_gateway';

const sut = new VehicleGateway({name : 'default'});


describe('Vehicle Gateway',()=> {
    it('Should start', (done)=> {
        sut.logger.info('Test');
        sut.start(()=> {
    //        assert.equal(sut.status, ServiceStatus.Started);
            done();
        });
    });
});