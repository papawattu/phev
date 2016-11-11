'use strict';

const Logger = require('../../../common/logging');
const Store = require('../../../common/store');

<<<<<<< HEAD
	function _registration() {
        //console.log('Head lights on');
	} 

	return {
		registration : _registration,
	};
};
=======
module.exports = function RegistrationService(registrationStore,_logger) {

    const logger = _logger || Logger;
    const store = registrationStore || new Store();
    function _createUser(user) {
        return store.has(user.userName).then((data) => {
            if (data) {
                return Promise.reject(new Error('User already registered ' + data.userName));
            }
            return store.set(user.userName,user).then(() => {
                return store.get(user.userName);
            });
        });
    } 

    return {
        createUser : _createUser,
    }
}
>>>>>>> 5005871744373ba62352866e6895f747e1594af7
