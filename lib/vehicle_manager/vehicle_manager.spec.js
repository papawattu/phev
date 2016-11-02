'use strict';

const HOST = '127.0.0.1';
const PORT = '1974';
const logger = require('../common/logging');
const assert = require('chai').assert;
const status = require('http-status');
const chai = require("chai");
const net = require('net');
const VehicleManager = require('./vehicle_manager');
const client = new net.Socket();
const CRLF = '\r\n';

const sut = new VehicleManager(logger);
describe('Connect vehicle', ()=> {
    before((done)=> {
        sut.start(() => {
            client.connect(PORT, HOST, ()=> {
                logger.debug('Connected');
                done();
            });
        });
    });

    after(()=> {
        // Tear down
        client.destroy();

    });
    it('Should connect and return OK', (done)=> {
        client.write('CONNECT' + CRLF, ()=> {
            client.once('data', (data) => {
                logger.debug('Received: ' + data);
                assert(data.length > 0);
                assert(data.toString() == 'OK' + CRLF, 'Return string should be OK is ' + data.toString());
                done();
            });
        });
    });
});

describe('Register vehicle', ()=> {

    before(()=> {
        client.connect(PORT, HOST, ()=> {
            logger.debug('Connected');
        });
    });

    after(()=> {
        // Tear down
        client.destroy();

    });

    it('Should register VIN', (done)=> {
        
        client.write('REGISTER JMAXDGG2WGZ002035' + CRLF,()=> {
            client.once('data', (data)=> {
                logger.debug('Received: ' + data);
                assert(data.length > 0);
                assert(data == 'OK' + CRLF, 'Return string should be OK is ' + data);
                done();
            });
        });
    });

    describe('Get secret', ()=> {
        it('Should get secret', (done)=> {
            
            client.write('SECRET', ()=> {
                client.once('data', (data)=> {
                    logger.debug('Received: ' + data);
                    assert(data.toString().length-CRLF.length == 16, 'Secret should be 16 digits and got ' + data.toString().length-CRLF.length);
                    done();
                });
            });
        });
    });
    describe('Send command', ()=> {
        it('Should accept a command',()=> {
    //        client.write('')
        });
    });
});