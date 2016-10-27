'use strict';
const LightsPlugin = require('./Lights');
const StatusController = require('./statusController');

exports.status = function (server, options, next) {
    const logger = options.logger || require('../../Common/Logging');
    const _statusController = new StatusController(options.status,options.logger);
    logger.debug('IM HERE');
    server.route([{
        method: 'GET',
        path: '/operations/status',
        handler: _statusController.getStatus,
    },

    ]);

    next();
};

exports.status.attributes = {
    pkg: require('./package.json')
};