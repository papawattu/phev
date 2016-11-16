'use strict';

const Logger = require('../../../common/logging');
const Store = require('../../../common/store/promise_store');
const RegNS = 'registration.';

module.exports = function RegistrationService({logger = Logger,store = new Store()} = {}) {

	function _createUser(user) {
		return store.has(RegNS + user.username).then((exists) => {
			if(exists) {
				throw new Error('User already registered ' + data.username);
			}
			return store.set(RegNS + user.username,user);
		});
	} 

	return {
		createUser : _createUser,
	};
};
