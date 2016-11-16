'use strict';

const Store = require('../../../common/store/promise_store');
const RegNS = 'registration.';

module.exports = function RegistrationService({store = new Store() } = {}) {

	function _createUser(user) {
		return store.has(RegNS + user.username).then((exists) => {
			if (exists) {
				throw new Error('User already registered ' + user.username);
			}
			return store.set(RegNS + user.username, user);
		});
	}

	return {
		createUser: _createUser,
	};
};
