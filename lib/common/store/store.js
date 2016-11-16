'use strict';

const Cache = require('cache-base');
const Logger = require('../logging');

module.exports = function Store(db,logging) {

	let store = db || new Cache();

	let logger = logging || Logger;
	logger.debug('Created store ' + store);
	function _set(key,value) {
		store.set(key,value);
	}
	function _get(key) {
		return store.get(key);
	}
	function _has(key) {
		return store.has(key);
	}
	function _del(key) {
		return store.del(key);
	}
	return {
		set: _set,
		get: _get,
		has: _has,
		del: _del,
	};
};
    
