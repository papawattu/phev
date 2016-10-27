'use strict';

const logger = require('../../Common/Logging');
const HOST = 'localhost';
const HOST_API = '/api';
const PROTOCOL = 'http';
const PORT = '3000';
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');
const chai = require("chai");
const OpMgr = require('../OperationsManagerHttpApi');

const opmgr = new OpMgr(logger);

describe('Status operations', ()=> {
    before((done) => {
        opmgr.start((done) => {
            let status = opmgr.status();
            assert(status === 'RUNNING','Expected Op manager to be running and is ' + status);
            done();
        });
    });
    after((done) => {
        opmgr.stop(60 * 1000,done);
    });
    it('Should get status', (done)=> {
        request.get(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/status')
            .type('application/json')
            .accept('json')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.status, status.OK);
                assert(res.status != 'undefined');
                done();
            });
    });
});