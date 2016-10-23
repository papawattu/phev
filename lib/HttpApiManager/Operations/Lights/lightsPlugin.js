'use strict';

const LightsController = require('./lightsController');

exports.lights = function (server, options, next) {

    const _lightsController = new LightsController();

    server.route([{
            method: 'PUT',
            path: '/operations/lights/{type}',
            handler: _lightsController.updateLights,
        },

    ]);

    next();
};

exports.lights.attributes = {
    pkg: require('./package.json')
};