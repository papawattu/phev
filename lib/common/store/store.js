'use strict';
const Cache = require('cache-base');

module.exports = function Store(db) {

    const store = db || new Cache();
    const keys = [];

    store.on('set', (key, val) => {
        if(keys.indexOf(key) == -1) {
            keys.push(key);
        }
    });

    store.on('del', (key, val) => {
        if(keys.indexOf(key) > -1) {
            keys.filter((e) => {return !key===e});
        }
    });

    function _set(key,value) {
        return new Promise((resolve,reject) => {
            resolve(store.set(key,value));
        });
    }

    function _get(key) {
        return new Promise((resolve,reject) => {
            resolve(store.get(key));
        });
    }
    function _has(key) {
        return new Promise((resolve,reject) => {
            resolve(store.has(key));
        });
    }
    function _del(key) {
        return new Promise((resolve,reject) => {
            resolve(store.del(key));
        });
    }
    return {
        set : _set,
        get: _get,
        has: _has,
        del: _del,
        keys : () => {
            return keys
        },
    };
    
};
    
