'use strict';

const assert = require('chai').assert

const VehicleCommandHandler = require('./vehicleCommandHandler');

const sut = new VehicleCommandHandler();

describe('Vehicle Command Handler', () => {
  it('Should register new VIN',  () => {
    const result = sut.handleCommand('REGISTER JMAXDGG2WGZ002035');
    assert(result === 'OK','Register should return OK actually returned ' + result);
  })
  it('Should get secret',  () => {
    const result = sut.handleCommand('SECRET');
    assert(result.length == 16,'Secret should be 16 character is ' + result.length);
  })
})