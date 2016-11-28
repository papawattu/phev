'use strict';

var UserService = require('../service/user_service');
var Logger = require('../../common/util').logger;
var Boom = require('boom');

module.exports = function UserManagerApiController() {

	var userService = new UserService();
	var logger = Logger;

	function _getUser(request, reply) {
		logger.debug('Call to get user ' + request.params.userId + ' request.params.userId ');
		return userService.getUser(request.params.userId).then(function (done) {
			if (done) {
				return reply(done).code(200);
			}
			return reply(Boom.notFound('User not found'));
		});
	}
	function _registerUser(request, reply) {
		return userService.addUser(request.payload.user).then(function () {
			return reply({}).created('/userManger/users/' + request.payload.user.userId);
		});
	}
	return {
		getUser: _getUser,
		registerUser: _registerUser
	};
};