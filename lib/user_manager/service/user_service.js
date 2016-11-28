'use strict';

var Logger = require('../../common/util').logger;
var Store = require('../../common/store/promise_store');
var StoreNS = 'users.';

module.exports = function UserService() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    _ref$logger = _ref.logger,
	    logger = _ref$logger === undefined ? Logger : _ref$logger;

	var store = new Store();
	//const logger = Logger;
	function _getUser(userId) {
		logger.debug('Call to get user userId ' + userId);
		return store.get(StoreNS + userId).then(function (data) {
			return data;
		});
	}
	function _getUsers() {
		logger.debug('Call to get users userId ');
		return store.get('users').then(function (data) {
			return data;
		});
	}
	function _addUser(user) {
		logger.debug('Call to register user ' + user);
		return _getUser(user.userId).then(function (exists) {
			if (exists) {
				return Promise.reject();
			}
			return store.set(StoreNS + user.userId, user);
		}, function () {
			return Promise.reject();
		});
	}
	return {
		getUser: _getUser,
		getUsers: _getUsers,
		addUser: _addUser
	};
};