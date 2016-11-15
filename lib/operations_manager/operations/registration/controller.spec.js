'use strict';

const HOST = 'localhost';
const HOST_API = '/api';
const PROTOCOL = 'http';
const PORT = '3000';
const logger = require('../../../common/logging');
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');
const chai = require('chai');
const OperationsManagerHttpApi = require('../../api');

const opmgr = new OperationsManagerHttpApi(logger);

describe('Registration operations', (done)=> {
    before((done) => {
        opmgr.start(done);
    });
    after((done) => {
        opmgr.stop(60 * 1000,done);
    });
    it('Should register', (done)=> {
        const req = {
            register : {
                firstName: 'Jamie',
                lastName: 'Nuttall',
                username: 'papawattu',
                password: 'Pa55word!',
                email: 'jamie@me.com',
                phevSsid: 'REMOTE123456',
                phevPassword: 'qwertyuiop',
                vin: 'VIN1234',
            }
        };
        request.post(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/registration')
            .send(req)
            .type('application/json')
            .accept('json')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.headers.location,'/users/papawattu');
                assert.equal(res.status, status.CREATED);
                return done();
            });
    });
});