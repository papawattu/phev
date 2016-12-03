'use strict';
const UserService = require('../service/user_service');
const Boom = require('boom');	

module.exports = function UserManagerApiController({logger,messageBus}) {
	
	const userService = new UserService({logger,messageBus});
	
	function _getUser(request,reply) {
		logger.debug('Call to get user ' + request.params.userId + ' request.params.userId ');
		return userService.getUser(request.params.userId).then((done) => {
			if(done) {
				return reply(done).code(200);
			}
			return reply(Boom.notFound('User not found'));	
		});
	}
	function _registerUser(request,reply) {
		return userService.addUser(request.payload.user).then(() => {
			return reply({}).created('/userManger/users/' + request.payload.user.userId);
		});
	}
	return {
		getUser : _getUser,
		registerUser : _registerUser,
	};
};