'use strict';

const StatusController = require('./controller');

exports.status = function (server, options, next) {
    const logger = options.logger || require('../../../common/logging');
    const _statusController = new StatusController(options.status,options.logger);
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