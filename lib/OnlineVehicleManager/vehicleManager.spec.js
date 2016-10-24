'use strict';

const HOST = 'localhost';
const PORT = '1974';
const logger = require('../Common/logging');
const assert = require('chai').assert;
const status = require('http-status');
const chai = require("chai");
const net = require('net');
const client = new net.Socket();

describe('Connect vehicle', ()=> {
    before(()=> {
        client.connect(PORT, HOST, ()=> {
            logger.debug('Connected');
        });
    });

    after(()=> {
        // Tear down
        client.destroy();

    });
    it('Should connect and return OK', (done)=> {
        client.write('CONNECT', ()=> {
            client.once('data', (data) => {
                logger.debug('Received: ' + data);
                assert(data.length > 0);
                assert(data.toString() == 'OK', 'Return string should be OK is ' + data.toString());
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
        
        client.write('REGISTER JMAXDGG2WGZ002035',()=> {
            client.once('data', (data)=> {
                logger.debug('Received: ' + data);
                assert(data.length > 0);
                assert(data == 'OK', 'Return string should be OK is ' + data);
                done();
            });
        });
    });

    describe('Get secret', function () {
        it('Should get secret', (done)=> {
            
            client.write('SECRET', ()=> {
                client.once('data', (data)=> {
                    logger.debug('Received: ' + data);
                    assert(data.toString().length == 16, 'Secret should be 16 digits and got ' + data.toString().length);
                    done();
                });
            });
        });
    });
});