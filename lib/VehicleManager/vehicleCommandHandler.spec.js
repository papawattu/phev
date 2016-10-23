'use strict';

const logger = require('../Common/logging');
const assert = require('chai').assert

const VehicleCommandHandler = require('./vehicleCommandHandler');

//assert(logger,'logger is not defined');
const sut = new VehicleCommandHandler(logger);

describe('Vehicle Command Handler', () => {
  it('Should connect', () => {
    const result = sut.handleCommand('CONNECT');
    assert(result === 'OK', 'Connect should return OK actually returned ' + result);
  });
  it('Should support version 1.0 api', () => {
    const result = sut.handleCommand('VERSION 1.0');
    assert(result === 'OK', 'Version expects return OK actually returned ' + result);
  });
  it('Should check for an update', () => {
    const result = sut.handleCommand('UPDATE');
    assert(result === 'YES' || result === 'NO', 'Update should return yes or no : returned ' + result);
  });
  it('Should register a new VIN', () => {
    const result = sut.handleCommand('REGISTER JMAXDGG2WGZ002035');
    assert(result === 'OK', 'Register should return OK actually returned ' + result);
  })
  it('Should get a secret', () => {
    const result = sut.handleCommand('SECRET');
    assert(result.length == 16, 'Secret should be 16 character is ' + result.length);
  })
  it('Should respond OK to ping', () => {
    const result = sut.handleCommand('PING');
    assert(result === 'OK', 'Ping should return OK actually returned ' + result);
  })
    it('Should respond INVALID to unsupported command', () => {
    const result = sut.handleCommand('XYXYXYX');
    assert(result === 'INVALID', 'Expected Invalid actually returned ' + result);
  })
})