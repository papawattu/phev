'use strict';
const Logger = require('../../common/logging');
const Store = require('../../common/store/promise_store');
const DevNS = 'devices.';

module.exports = function DeviceStore({store = new Store(), logger = Logger} = {}) {

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
				throw new Error('id already registered ' + device.id);
			}    
			return store.set(DevNS + device.id, device);
		});
	}
	return {
		getDevice: _getDevice,
		getDevices: _getDevices,
		addDevice: _addDevice,
	};
};