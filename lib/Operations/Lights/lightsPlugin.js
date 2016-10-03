'use strict';


exports.lights = function (server, options, next) {

    const LightsController = require('./lightsController');

    const lightsController = new LightsController();

    server.route([{
        method: 'PUT',
        path: '/lights/{type}',
        handler: lightsController.updateLights,
    },
        {
            method: 'GET',
            path: '/lights/{name}',
            handler: (request, reply) => {
                console.log('lights on ' + request.params.name);
                reply({ status: 'ok' }).code(200);
            },
        }
    ]);

    next();
};

exports.lights.attributes = {
    pkg: require('./package.json')
};