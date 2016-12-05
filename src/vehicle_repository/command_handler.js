'use strict';
// TODO: fix me
//const DeviceService = {};//require('./service/device_service');
const eol = require('../common/util').eol;


module.exports = function VehicleCommandHandler() {

	const deviceService = {};//new DeviceService();

	const commands = [{
		name: 'CONNECT',
		numArgs: 0,
		handle: deviceService.connect
	},{
		name: 'REGISTER',
		numArgs: 1,
		handle: deviceService.addDevice
	},{
		name: 'VERSION',
		numArgs: 1,
		handle: deviceService.version
	},{
		name: 'SSID',
		numArgs: 0,
		handle: deviceService.ssid
	},{
		name: 'PASSWORD',
		numArgs: 0,
		handle: deviceService.password
	}];

	function _respondWithPromise(res) {
		return (res instanceof Promise ? res: new Promise((resolve) => resolve(res)));
	}
	function _splitCommand(cmd) {
		return cmd.split(/[, \t\r\n]+/);
	} 
	function _findCommand(cmd) {
		return commands.find(e => e.name === _splitCommand(cmd)[0]);
	}
	function _isValidCommand(cmd) {
		return (_findCommand(cmd) != undefined);
	}
	return {
		handleCommand: commandLine => 
			_respondWithPromise(_isValidCommand(commandLine) ? _findCommand(commandLine).handle(_splitCommand(commandLine).shift()) : 'INVALID'),
		eol: eol
	};

};
