'use strict';
const Logger = require('../../common/util').logger;
const Store = require('../../common/store/promise_store');
const StoreNS = 'users.';

module.exports = function UserService() {

    const store = new Store();
    const logger = Logger;
    function _getUser(userId) {
        logger.debug('Call to get user userId ' + userId);
        return store.get(StoreNS + userId).then(data => {
            return data;
        });
    }
    function _getUsers() {
        logger.debug('Call to get users userId ');
        return store.get('users').then(data => {
            return data;
        });
    }
    function _addUser(user) {
        logger.debug('Call to register user ' + user);
        return Promise.all([store.has(StoreNS + user.userId),
            getUsers() {
            if(exists) {
                throw new Error('User already registered ' + user.userId);
            }
            return store.set(StoreNS + user.userId, user);
        });
    }
    return {
        getUser: _getUser,
        getUsers: _getUsers,
        addUser: _addUser,
    };
};
