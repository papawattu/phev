'use strict';

const HOST = 'localhost';
const PROTOCOL = 'http';
const PORT = '3000';

const logger = require('../Common/logging');
const assert = require('chai').assert
const request = require('superagent');
const OperationsManagerHttpApi = require('./OperationsManagerHttpApi');

const sut = new OperationsManagerHttpApi(logger);

describe('Operations Manager status', () => {
    it('Should return service status as string', () => {
        const statuses = sut.status();
        assert.isString(statuses);
    });
    it('Should be stopped by default', () => {
        const statuses = sut.status();
        assert(statuses === 'STOPPED', 'Expected status to be STOPPED and is ' + statuses);
    });
});
describe('Operations Manager start', () => {
    after((done) => {
       sut.stop(60 * 1000, done);
    });
    it('Should start service', () => {
        assert(sut.status() === 'STOPPED', 'Expetced status to be STOPPED is ' + sut.status());
        sut.start(() => {
            assert(sut.status() === 'RUNNING');
        });
    });
    it('Should not error if start service again', () => {
        sut.start(() => {
            assert(sut.status() === 'RUNNING', 'Expetced status to be RUNNING is ' + sut.status());
            sut.start(() => {
                assert(sut.status() === 'RUNNING');
            });
        });
    });
});
describe('Operations Manager listen on port', () => {
    before((done) => {
        sut.start(done);
    });
    after((done) => {
        sut.stop(60 * 10000,done);
    });
    it('Should be listening on port', (done)=> {
        let uri = PROTOCOL + '://' + HOST + ':' + PORT + '/operations/status';
        logger.debug('Connecting to ' + uri);
        request.get(uri)
            .type('application/json')
            .accept('json')
            .end(function (err, res) {
                assert.ifError(err);
                assert.equal(res.status, 200);
                assert(res.status != 'undefined');
                done();
            });
    });
});



