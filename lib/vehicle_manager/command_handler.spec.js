'use strict';

const logger = require('../common/logging');
const chai = require('chai');
const assert = require('chai').assert;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const VehicleCommandHandler = require('./command_handler');

const sut = new VehicleCommandHandler(logger);

function eol(str) { 
	return sut.eol(str);
}
describe('Vehicle Command Handler', () => {
	let result = '';
	it('Should connect', () => {
		return assert.becomes(result = sut.handleCommand('CONNECT'),'OK', 'Connect should return OK actually returned ' + result);
	});
	it('Should support version 1.0 api', () => {
		return assert.becomes(result = sut.handleCommand('VERSION 1.0'),'OK', 'Version expects return OK actually returned ' + result);
	});
	it.skip('Should check for an update', () => {
		return assert.becomes(result === 'YES' || result === 'NO', 'Update should return yes or no : returned ' + result);
	});
	it('Should register a new remote', () => {
		return assert.becomes(result = sut.handleCommand('REGISTER 123456789'),'OK','Expected OK returned ' + result);
	});
	it.skip('Should get a wifi password', () => {
		const result = sut.handleCommand('PASSWORD');
		return assert.becomes(result.length == 16, 'Secret should be 16 character is ' + result.length);
	});
	it.skip('Should get a remote ssid', () => {
		const result = sut.handleCommand('SSID');
		return assert.becomes(result.length, 'Secret should be 16 character is ' + result.length);
	});
	it.skip('Should get a secret', () => {
		const result = sut.handleCommand('SECRET');
		return assert.becomes(result.length, 'Secret should be 16 character is ' + result.length);
	});
	it.skip('Should respond OK to ping', () => {
		const result = sut.handleCommand('PING');
		return assert.becomes(result === eol('OK'), 'Ping should return OK actually returned ' + result);
	});
	it('Should respond INVALID to unsupported command', () => {
		return assert.becomes(result =sut.handleCommand('XYXYXYX'), 'INVALID','Expected Invalid actually returned ' + result);
	});
});