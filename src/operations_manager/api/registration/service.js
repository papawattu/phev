'use strict';
import {RegistrationSchema} from './schema';
const Joi = require('joi');
const Store = require('../../../common/store/promise_store');
//const logger = require('../../../common/util').logger;
//const userService = require('userService');
//const vehicleService = require('vehicleService');
//const deviceService = require('deviceService');

const RegNS = 'registration.';

module.exports = function RegistrationService({logger,messageBus}) {

	const store = new Store();

	function _createUser(user) {
		return store.has(RegNS + user.username).then((exists) => {
			if (exists) {
				throw new Error('User already registered ' + user.username);
			}
			return store.set(RegNS + user.username, user);
		});
	}
	function _createVehicle(vin) {
		return Promise.resolve(vin);
	}
	function _createDevice(id) {
		return Promise.resolve(id);
	}
	function _registration(reg) {
		return new Promise((resolve, reject) => {
			Joi.validate(reg, RegistrationSchema, (err, value) => {
				if (err) {
					return reject(err);
				}
				return resolve(value);
			});
		}).then(() => {
			return Promise.all([
				_createUser(reg.register.user),
				_createVehicle(reg.register.vehicle),
				_createDevice(reg.register.device),
			]);
		});
	}
	return {
		registration: _registration,
	};
};
