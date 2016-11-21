'use strict';
const logger = require('../../common/logging');
const Store = require('../../common/store/promise_store');
const DevNS = 'devices.';

module.exports = function DeviceService({store = new Store()} = {}) {

	function _getDevice(id) {
		logger.debug('Call to get Device id ' + id);
		return store.get(DevNS + id).then(data => {
			return data;
		});
	}
	function _getDevices() {
		logger.debug('Call to get Devices id ');
		return store.get('devices').then(data => {
			return data;
		});
	}
	function _addDevice(device) {
		logger.debug('Call to register Device ' + device);
		return store.has(DevNS + device.id).then((exists) => {
			if(exists) {
				return 'ERROR';
			}  
			return store.set(DevNS + device.id, device).then(() => {
				return 'OK';
			});
		});
	}
	return {
		getDevice: _getDevice,
		getDevices: _getDevices,
		addDevice: _addDevice,
		connect: () => 'OK',
		version: () => 'OK',
		ssid: () => 'SSID123',
		password: () => 'PASSWORD123',
	};
};