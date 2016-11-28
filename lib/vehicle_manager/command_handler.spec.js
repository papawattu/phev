'use strict';

var chai = require('chai');
var assert = require('chai').assert;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var VehicleCommandHandler = require('./command_handler');

var sut = new VehicleCommandHandler();

function eol(str) {
	return sut.eol(str);
}
describe('Vehicle Command Handler', function () {
	var result = '';
	it('Should connect', function () {
		return assert.becomes(result = sut.handleCommand('CONNECT'), 'OK', 'Connect should return OK actually returned ' + result);
	});
	it('Should support version 1.0 api', function () {
		return assert.becomes(result = sut.handleCommand('VERSION 1.0'), 'OK', 'Version expects return OK actually returned ' + result);
	});
	it.skip('Should check for an update', function () {
		return assert.becomes(result === 'YES' || result === 'NO', 'Update should return yes or no : returned ' + result);
	});
	it('Should register a new remote', function () {
		return assert.becomes(sut.handleCommand('REGISTER 123456789'), 'OK');
	});
	it('Should not register a new remote twice', function () {
		return assert.becomes(sut.handleCommand('REGISTER 123456789'), 'ERROR');
	});
	it.skip('Should get a wifi password', function () {
		return assert.becomes(result = sut.handleCommand('PASSWORD'), 'PASSWORD123', 'Password should be PASSWORD123 character is ' + result);
	});
	it.skip('Should get a remote ssid', function () {
		return assert.becomes(result = sut.handleCommand('SSID'), 'SSID123', 'SSID should be SSID123 character is ' + result);
	});
	it.skip('Should get a secret', function () {
		var result = sut.handleCo1mmand('SECRET');
		return assert.becomes(result.length, 'Secret should be 16 character is ' + result.length);
	});
	it.skip('Should respond OK to ping', function () {
		var result = sut.handleCommand('PING');
		return assert.becomes(result === eol('OK'), 'Ping should return OK actually returned ' + result);
	});
	it('Should respond INVALID to unsupported command', function () {
		return assert.becomes(result = sut.handleCommand('XYXYXYX'), 'INVALID', 'Expected Invalid actually returned ' + result);
	});
});