import * as _Joi from 'joi';
const Joi = _Joi.default;

export const UserSchema = Joi.object().keys({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	username: Joi.string().required(),
	password: Joi.string().required(),
	email: Joi.string().email().required(),
});
export const VehicleSchema = Joi.object().keys({
	ssid: Joi.string().required(),
	password: Joi.string().required(),
	vin: Joi.string().required(),
});
export const DeviceSchema = Joi.object().keys({
	id: Joi.string().required(),
});
export const RegistrationSchema = Joi.object().keys({
	register: Joi.object().keys({
		user: UserSchema,
		vehicle: VehicleSchema,
		device: DeviceSchema,
	})
});