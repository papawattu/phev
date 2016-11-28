'use strict';

var logger = require('../../common/logging');
var Store = require('../../common/store/promise_store');
var DevNS = 'devices.';

module.exports = function DeviceService() {

	var store = new Store();

	function _getDevice(id) {
		logger.debug('Call to get Device id ' + id);
		return store.get(DevNS + id).then(function (data) {
			return data;
		});
	}
	function _getDevices() {
		logger.debug('Call to get Devices id ');
		return store.get('devices').then(function (data) {
			return data;
		});
	}
	function _addDevice(device) {
		logger.debug('Call to register Device ' + device);
		return store.has(DevNS + device.id).then(function (exists) {
			if (exists) {
				return 'ERROR';
			}
			return store.set(DevNS + device.id, device).then(function () {
				return 'OK';
			});
		});
	}
	return {
		getDevice: _getDevice,
		getDevices: _getDevices,
		addDevice: _addDevice,
		connect: function connect() {
			return 'OK';
		},
		version: function version() {
			return 'OK';
		},
		ssid: function ssid() {
			return 'SSID123';
		},
		password: function password() {
			return 'PASSWORD123';
		}
	};
};