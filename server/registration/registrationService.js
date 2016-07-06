var registrationStore = require('./registrationStore');
var registrationUser = require('./registrationDomain.js').user;

var registrationService = {
    createUser : function (username,firstname,lastname,email,password) {

        registrationUser = {
            username : username,
            firstname : firstname,
            lastname : lastname,
            email : email,
            password : password
        };
        console.log('username ' + username + ' first name ' + firstname + ' last name ' + lastname
            + ' email ' + email + ' password ' + password);


        if(registrationStore.get(registrationUser)) {
            console.log('User ' + user.username + ' cannot be registered already exists.');
            return false;
        }

        if(registrationStore.set(registrationUser)) {
            console.log('User ' + user.username + ' cannot be registered.');
            return false;
        }
        return true;
    }
}

module.exports = registrationService;