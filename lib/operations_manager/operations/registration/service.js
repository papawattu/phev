'use strict';

const Logger = require('../../../common/logging');
const Store = require('../../../common/store');

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
