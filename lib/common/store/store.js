'use strict';

const redisClient = require('redis-js');
const logger = require('../logging');

module.exports = function Store(db) {

	const keys = [];

	let store = db || redisClient.createClient();
	logger.debug('Created store ' + store);

	function _set(key,value) {
		logger.debug('Set called key ' + key + ' value ' + value);
		return new Promise((resolve,reject) => {
			return store.set(key,value,(err,reply) => {
				logger.debug('Set response ' + reply.toString());
				if(err) {
					logger.debug('Get resolve ' + reply.toString());
					logger.error(err);
					reject(err);
				}
				logger.debug('Set resolve ' + reply.toString());
				resolve(reply);
			});
		}).catch(err => {
			logger.error(err);
		});
	}

	function _get(key) {
		logger.debug('Get called key ' + key);
		return new Promise((resolve,reject) => {
			return store.get(key,(err,reply) => {
				if(err) {
					logger.error('Get reject ' + err);
					reject(err);
				}
				logger.debug('Get resolve ' + reply);
				resolve(reply);
			});
		}).catch(err => {
			logger.error(err);
		});
	}
	function _has(key) {
		logger.debug('Has called key ' + key);
		return new Promise((resolve,reject) => {
			return store.exists(key,(err,reply) => {
				if(err) {
					logger.error('Has got error ' + err);
					return reject(err);
				}
				return resolve(reply == 1);
			});
		});
	}
	function _del(key) {
		logger.debug('Del called key ' + key);
		return new Promise((resolve,reject) => {
			return store.del(key, (err,reply) => {
				if(err) {
					logger.error('Del got error ' + err);
					reject(err);
				}
				resolve(reply);
			});
		});
	}
	return {
		set : _set,
		get: _get,
		has: _has,
		del: _del,
	};
    
};
    
