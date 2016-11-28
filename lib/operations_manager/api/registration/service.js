'use strict';

var Joi = require('joi');
var Store = require('../../../common/store/promise_store');
var logger = require('../../../common/util').logger;
//const userService = require('userService');
//const vehicleService = require('vehicleService');
//const deviceService = require('deviceService');

var RegNS = 'registration.';

module.exports = function RegistrationService() {

	var store = new Store();

	var registrationSchema = Joi.object().keys({
		register: Joi.object().keys({
			user: Joi.object().keys({
				firstName: Joi.string().required(),
				lastName: Joi.string().required(),
				username: Joi.string().required(),
				password: Joi.string().required(),
				email: Joi.string().email().required()
			}),
			vehicle: {
				ssid: Joi.string().required(),
				password: Joi.string().required(),
				vin: Joi.string().required()
			},
			device: {
				id: Joi.string().required()
			}
		})
	});

	function _createUser(user) {
		return store.has(RegNS + user.username).then(function (exists) {
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
		logger.info('Register new user');
		return new Promise(function (resolve, reject) {
			Joi.validate(reg, registrationSchema, function (err, value) {
				if (err) {
					return reject(err);
				}
				return resolve(value);
			});
		}).then(function () {
			return Promise.all([_createUser(reg.register.user), _createVehicle(reg.register.vehicle), _createDevice(reg.register.device)]);
		});
	}
	return {
		registration: _registration
	};
};