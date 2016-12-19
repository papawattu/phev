import * as Joi from 'joi';

export const UserSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	username: Joi.string().required(),
	password: Joi.string().required(),
	email: Joi.string().email().required(),
});
export const VehicleSchema = Joi.object({
	ssid: Joi.string().required(),
	password: Joi.string().required(),
	vin: Joi.string().required(),
});
export const DongleSchema = Joi.object({
	id: Joi.string().required(),
	vin: Joi.string().optional(),
});
export const RegistrationSchema = Joi.object({
	register: Joi.object().keys({
		user: UserSchema,
		vehicle: VehicleSchema,
		dongle: DongleSchema,
	})
});