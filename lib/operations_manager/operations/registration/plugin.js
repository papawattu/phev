'use strict';

const RegistrationController = require('./controller');

exports.registration = function (server, options, next) {

    const _registrationController = new RegistrationController(options.logger);

    server.route([{
            method: 'POST',
            path: '/operations/registration',
            handler: _registrationController.registration,
        },

    ]);

    next();
};

exports.registration.attributes = {
    pkg: require('./package.json')
};