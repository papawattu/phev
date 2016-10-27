"use strict";

const HOST = 'E826O7L96CG8E4S';
const HOST_API = '/api';
const PROTOCOL = 'http';
const PORT = '3000';
const logger = require('../../../Common/Logging');
const assert = require('chai').assert;
const request = require('superagent');
const status = require('http-status');
const chai = require("chai");
const OperationsManagerHttpApi = require('../../OperationsManagerHttpApi');

const opmgr = new OperationsManagerHttpApi(logger);

describe('Light operations', (done)=> {
    beforeEach((done) => {
        opmgr.start(done);
    });
    it('Should turn on headlights', (done)=> {
        request.put(PROTOCOL + '://' + HOST + ':' + PORT + '/operations/lights/head')
            .send({status : 'on'})
            .type('application/json')
            .accept('json')
            .end(function(err, res) {
                assert.ifError(err);
                assert.equal(res.status, status.OK);
                done();
            });
    });
});