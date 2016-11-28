'use strict';

var Cache = require('cache-base');
var Logger = require('winston');

module.exports = function Store(db, logging) {

	var store = db || new Cache();

	var logger = logging || Logger;
	logger.debug('Created store ' + store);
	function _set(key, value) {
		store.set(key, value);
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
		del: _del
	};
};