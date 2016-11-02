'use strict';

const logger = require('../common/logging');
const assert = require('chai').assert

const VehicleCommandHandler = require('./command_handler');
const CRLF = '\r\n';

//assert(logger,'logger is not defined');
const sut = new VehicleCommandHandler(logger);

describe('Vehicle Command Handler', () => {
  it('Should connect', () => {
    const result = sut.handleCommand('CONNECT');
    assert(result === 'OK' + CRLF, 'Connect should return OK actually returned ' + result);
  });
  it('Should support version 1.0 api', () => {
    const result = sut.handleCommand('VERSION 1.0');
    assert(result === 'OK' + CRLF, 'Version expects return OK actually returned ' + result);
  });
  it('Should check for an update', () => {
    const result = sut.handleCommand('UPDATE');
    assert(result === 'YES' + CRLF || result === 'NO' +CRLF, 'Update should return yes or no : returned ' + result);
  });
  it('Should register a new VIN', () => {
    const result = sut.handleCommand('REGISTER JMAXDGG2WGZ002035');
    assert(result === 'OK' + CRLF, 'Register should return OK actually returned ' + result);
  })
  it('Should get a secret', () => {
    const result = sut.handleCommand('SECRET');
    assert(result.length-CRLF.length == 16, 'Secret should be 16 character is ' + result.length-CRLF.length);
  })
  it('Should respond OK to ping', () => {
    const result = sut.handleCommand('PING');
    assert(result === 'OK' + CRLF, 'Ping should return OK actually returned ' + result);
  })
    it('Should respond INVALID to unsupported command', () => {
    const result = sut.handleCommand('XYXYXYX');
    assert(result === 'INVALID' + CRLF, 'Expected Invalid actually returned ' + result);
  })
})