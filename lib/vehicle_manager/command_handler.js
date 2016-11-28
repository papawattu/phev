'use strict';

var DeviceService = require('./service/device_service');
var eol = require('../common/util').eol;

module.exports = function VehicleCommandHandler() {

	var deviceService = new DeviceService();

	var commands = [{
		name: 'CONNECT',
		numArgs: 0,
		handle: deviceService.connect
	}, {
		name: 'REGISTER',
		numArgs: 1,
		handle: deviceService.addDevice
	}, {
		name: 'VERSION',
		numArgs: 1,
		handle: deviceService.version
	}, {
		name: 'SSID',
		numArgs: 0,
		handle: deviceService.ssid
	}, {
		name: 'PASSWORD',
		numArgs: 0,
		handle: deviceService.password
	}];

	function _respondWithPromise(res) {
		return res instanceof Promise ? res : new Promise(function (resolve) {
			return resolve(res);
		});
	}
	function _splitCommand(cmd) {
		return cmd.split(/[, \t\r\n]+/);
	}
	function _findCommand(cmd) {
		return commands.find(function (e) {
			return e.name === _splitCommand(cmd)[0];
		});
	}
	function _isValidCommand(cmd) {
		return _findCommand(cmd) != undefined;
	}
	return {
		handleCommand: function handleCommand(commandLine) {
			return _respondWithPromise(_isValidCommand(commandLine) ? _findCommand(commandLine).handle(_splitCommand(commandLine).shift()) : 'INVALID');
		},
		eol: eol
	};
};