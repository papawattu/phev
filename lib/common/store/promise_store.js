'use strict';

const _store = require('./store');
const Logger = require('../logging');

module.exports = function Store(db,logging) {

	let store = db || new _store();
    let logger = logging || Logger;
	logger.debug('Created store ' + store);
    function _set(key,value) {
        return new Promise((resolve,reject) => resolve(store.set(key,value)));
    }
    function _get(key) {
        return new Promise((resolve,reject) => {
            return resolve(store.get(key));
        });
    }
    function _has(key) {
        return new Promise((resolve,reject) => resolve(store.has(key)));
    }
    function _del(key) {
        return new Promise((resolve,reject) => resolve(store.del(key)));
    }
    return {
        set : _set,
        get: _get,
        has: _has,
        del: _del,
    };
};