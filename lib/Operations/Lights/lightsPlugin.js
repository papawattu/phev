'use strict';

const LightsController = require('./lightsController');

exports.lights = function (server, options, next) {

    const _lightsController = new LightsController();

    server.route([{
            method: 'PUT',
            path: '/lights/{type}',
            handler: _lightsController.updateLights,
        },

    ]);

    next();
};

exports.lights.attributes = {
    pkg: require('./package.json')
};