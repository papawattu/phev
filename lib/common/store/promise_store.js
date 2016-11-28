'use strict';

var _store = require('./store');
var Logger = require('winston');

module.exports = function Store(db, logging) {

	var store = db || new _store();
	var logger = logging || Logger;
	logger.debug('Created store ' + store);
	function _set(key, value) {
		return new Promise(function (resolve) {
			return resolve(store.set(key, value));
		});
	}
	function _get(key) {
		return new Promise(function (resolve) {
			return resolve(store.get(key));
		});
	}
	function _has(key) {
		return new Promise(function (resolve) {
			return resolve(store.has(key));
		});
	}
	function _del(key) {
		return new Promise(function (resolve) {
			return resolve(store.del(key));
		});
	}
	return {
		set: _set,
		get: _get,
		has: _has,
		del: _del
	};
};