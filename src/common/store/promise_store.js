'use strict';

const _store = require('./store');
const Logger= require('winston');

module.exports = function Store(db,logging) {

	let store = db || new _store();
	let logger = logging || Logger;
	logger.debug('Created store ' + store);
	function _set(key,value) {
		return new Promise((resolve) => resolve(store.set(key,value)));
	}
	function _get(key) {
		return new Promise((resolve) => {
			return resolve(store.get(key));
		});
	}
	function _has(key) {
		return new Promise((resolve) => resolve(store.has(key)));
	}
	function _del(key) {
		return new Promise((resolve) => resolve(store.del(key)));
	}
	return {
		set : _set,
		get: _get,
		has: _has,
		del: _del,
	};
};